---
title: 【js高级程序】迭代器与生成器
date: 2020-12-17 07:01:14
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第7章*

### 理解迭代
JavaScript中 for 循环就是一种最简单的迭代
> 循环是迭代机制的基础

### 迭代器模式
可以把有些结构称为“可迭代对象”（`iterable`），因为它们实现了正式的 `Iterable` 接口，而且可以通过迭代器 `Iterator` 消费。

#### 可迭代协议
实现 Iterable 接口（可迭代协议）要求同时具备两种能力
- 支持迭代的自我识别能力和创建实现 Iterator 接口的对象的能力
- 属性必须使用特殊的 Symbol.iterator 作为键, 这个默认迭代器属性必须引用一个迭代器工厂函数(`Symbol.iterator`)，调用这个工厂函数必须返回一个新迭代器。

很多内置类型都实现了 Iterable 接口：
- 字符串
- 数组
- 映射
- 集合
- arguments 对象
- NodeList 等 DOM 集合类型

检查是否存在默认迭代器属性可以暴露这个工厂函数：
```js
let num = 1;
let obj = {};

console.info(num[Symbol.iterator]); // undefined;
console.log(obj[Symbol.iterator]); // undefined
```

```js
// 这些类型都实现了迭代器工厂函数
console.log(str[Symbol.iterator]);  // f values() { [native code] }
console.log(arr[Symbol.iterator]); // f values() { [native code] }
console.log(map[Symbol.iterator]); // f values() { [native code] }
console.log(set[Symbol.iterator]); // f values() { [native code] }
console.log(els[Symbol.iterator]); // f values() { [native code] }

// 调用这个工厂函数会生成一个迭代器
console.log(str[Symbol.iterator]()); // StringIterator {} 
console.log(arr[Symbol.iterator]()); // ArrayIterator {} 
console.log(map[Symbol.iterator]()); // MapIterator {}
console.log(set[Symbol.iterator]()); // SetIterator {}
console.log(els[Symbol.iterator]()); // ArrayIterator {}
```

实际代码中，有些代码会隐式调用工厂函数 `Symbol.iterator`，生成迭代器
- for of 循环
- 数组解构
- 扩展操作符
- Array.from
- 创建映射
- 创建集合
- Promise.all
- Promise.race
- yield*

#### 迭代器协议
迭代器 API 使用 next()方法在可迭代对象中遍历数据。每次成功调用 next()，都会返回一个 **`IteratorResult`** 对象，其中包含迭代器返回的下一个值。若不调用 next()，则无法知道迭代器的当前位置。

next()方法返回的迭代器对象 IteratorResult 包含两个属性
- `done`  布尔值，表示是否还可以再次调用 next()取得下一个值
- `value`  包含可迭代对象的下一个值（done 为 false），或者 undefined（done 为 true）。
  ```js
    let arr = ['foo', 'bar'];
    console.log(arr[Symbol.iterator]);  // ƒ values() { [native code] }

    let iter = arr[Symbol.iterator]()
    iter.next();  // {value: "foo", done: false}
    iter.next();  // {value: "bar", done: false}
    iter.next();  // {value: undefined", done: true}
  ```

每个迭代器都表示对可迭代对象的一次性有序遍历。不同迭代器的实例相互之间没有联系，只会独 立地遍历可迭代对象：
```js
let arr = ['foo', 'bar'];
let iter1 = arr[Symbol.iterator]();
let iter2 = arr[Symbol.iterator]();

console.log(iter1.next()); // { done: false, value: 'foo' } 
console.log(iter2.next()); // { done: false, value: 'foo' } 
console.log(iter2.next()); // { done: false, value: 'bar' } 
console.log(iter1.next()); // { done: false, value: 'bar' }
```

如果可迭代对象在迭代期间被修改了，那么迭代器也会反映相应的变化：
```js
let arr = ['foo', 'baz'];
let iter = arr[Symbol.iterator]();

console.log(iter.next()); // { done: false, value: 'foo' }
iter.splice(1, 0, 'bar');

console.log(iter.next()); // { done: false, value: 'bar' }
console.log(iter.next()); // { done: false, value: 'baz' }
console.log(iter.next()); // { done: true, value: undefined }
```

##### 显式的迭代器实现
```js
class Foo {
  [Symbol.iterator]() {
    return {
      next() {
        return {
          done: false,
          value: 'foo'
        }
      }
    }
  }
}
let f = new Foo();
console.info(f[Symbol.iterator]());   // { next: f() {} }
f[Symbol.iterator]().next();    // { done: false, value: 'foo' }
```

#### 自定义迭代器
创建多少个执行多少次迭代
```js
class It {
  constructor(limit) {
    this.limit = count;
  }

  [Symbol.iterator]() {
    let count = 1;
    let limit = this.limit;
    return {
      next () {
        if (count > limit) {
          return {
            done: true,
            value: undefined
          }
        } else {
          return {
            done: true,
            value: count ++
          }
        }
      }
    }
  }
}
```

#### 提前终止迭代器
可选的 return()方法用于指定在迭代器提前关闭时执行的逻辑。
- for-of 循环通过 break、continue、return 或 throw 提前退出；
- 解构操作并未消费所有值。

return()方法必须返回一个有效的 IteratorResult 对象。简单情况下，可以只返回{ done: true }。
```js
class It {
  constructor(limit) {
    this.limit = count;
  }

  [Symbol.iterator]() {
    let count = 1;
    let limit = this.limit;
    return {
      next () {
        if (count > limit) {
          return {
            done: true,
            value: undefined
          }
        } else {
          return {
            done: true,
            value: count ++
          }
        }
      }
      return () {
        console.info('start return')
        return {
          done: true
        }
      }
    }
  }
}
```

### 生成器
生成器是 ECMAScript 6 新增的一个极为灵活的结构，拥有在一个函数块内暂停和恢复代码执行的 能力。这种新能力具有深远的影响，比如，使用生成器可以自定义迭代器和**实现协程**。

#### 生成器基础
```js
// 生成器函数声明
function *generatorFn() {}

// 生成器函数表达式
let generatorFn = function *() {}

// 对象字面量属性生成器定义
let foo = {
  * generatorFn() {}
}
```
> 箭头函数不能用来定义生成器函数。


