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

- 调用生成器函数会产生一个**生成器对象**。生成器对象一开始处于暂停执行（suspended）的状态。与迭代器相似，生成器对象也实现了 `Iterator` 接口，因此具有 next()方法。调用这个方法会让生成器 开始或恢复执行。
  ```js
  function *generatorFn() {
    console.info('this is g Fn')
  }

  console.log(generatorFn);  // generatorFn 
  console.log(generatorFn().next()); // 打印'this is g Fn'   // 返回{done: true, value: undefined};
  ```
- next()方法的返回值类似于迭代器，有一个 done 属性和一个 value 属性。

- value 属性是生成器函数的返回值，默认值为 undefined
  ```js
  function *generatorFn() {
    return 'hello world';
  }

  generatorFn().next();   // {value: "hello world", done: true}
  ```

- **生成器函数只会在初次调用 next()方法后开始执行**
  ```js
  *generatorFn() {
    console.info('hello world');
  }

  // 调用不会打印日志
  const g = generatorFn();
  g.next(); // hello world
  ```
- 生成器对象实现了 Iterable 接口，它们默认的迭代器是自引用的
  ```js
  function *gen() {
    return '123123';
  }

  console.log(gen);   // ƒ *generatorFn() { return '123123'; }
  console.log(gen()[Symbol.iterator]);    // ƒ [Symbol.iterator]() { [native code] }
  console.log(gen()); // generatorFn {<suspended>}
  console.log(gen()[Symbol.iterator]());  // generatorFn {<suspended>}
  const g = gen();
  console.log(g === g[Symbol.iterator]())   // true
  ```

#### 通过 yield 中断执行
yield 关键字可以让生成器停止和开始执行，也是生成器最有用的地方。生成器函数在遇到 **yield 关键字之前会正常执行**。**遇到这个关键字后，执行会停止，函数作用域的状态会被保留**。停止执行的生 成器函数只能通过在生成器对象上调用 next()方法来恢复执行：
```js
function *gen() {
  yield 'hello';
}

const g = gen();
console.info(g.next());   // { done: false, value: 'hello' }
console.info(g.next());   // { done: true, value: undefined }
```

此时的 yield 关键字有点像函数的中间返回语句，它生成的值会出现在 next()方法返回的对象里。通过yield关键子退出的生成器会处在 `done: false` 的状态，通过return 退出的生成器函数会处于 `done: true` 状态
```js
function *gen() {
  yield 'foo';
  yield 'bar';
  return 'baz';
}
const g = gen();
console.log(g.next());  // { done: false, value: 'foo' }
console.log(g.next());  // { done: false, value: 'bar' }
console.log(g.next());  // { done: true, value: 'baz' }
```

> 生成器函数内部的执行流程会针对每个生成器对象区分作用域。在一个生成器对象上调用 next() 不会影响其他生成器

> yield 关键字只能在生成器函数内部使用，用在其他地方会抛出错误。

##### 生成器对象作为可迭代对象
在生成器对象上显式调用 next()方法的用处并不大。可作为可迭代对象
```js
function *gen() {
  yield 1;
  yield 2;
  yield 3;
}

for (const x of gen()) {
  console.log(x);
}

// 1
// 2
// 3
```
在需要自定义迭代对象时，这样使用生成器对象会特别有用。比如，我们需要定义一个可迭代对象， 而它会产生一个迭代器，这个迭代器会执行指定的次数。
```js
function *nTimes(n) {
  while(n--) {
    yield;
  }
}

for (const _ of nTimes(3)) {
  console.log('hello world');
}
// hello world
// hello world
// hello world
```

##### 使用 yield 实现输入和输出
除了可以作为函数中间返回语句使用，yield 关键字还可以作为函数的中间参数使用。上一次让生成器函数暂停的 yield 关键字会接收到传给 next()方法的第一个值。
***第一次调用 next()传入的值不会被使用，因为这一次调用是为了开始执行生成器函数***
```js
function *generatorFn(initial) {
  console.log(initial);
  console.log(yield);
  // 相当于
  // const a = yield;
  // console.log(yield);
  console.log(yield);
}

let gObj = gen('foo');
gObj.next('bar'); // foo (第一次使用的是初始值)
gObj.next('baz'); // baz
gObj.next('qux'); // qux
```
> next 的参数值可以当作 yield 关键字的返回值；**由于next方法的参数表示上一个yield表达式的返回值，所以在第一次使用next方法时，传递参数是无效的。**

看这个例子 (来自 https://es6.ruanyifeng.com/#docs/generator )
```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

const a = foo(5);
a.next(); 
// 第一个next 执行 x + 1  { done: false, value: 6 }

a.next(); 
// 第二个next参数表示第一个 yield 的返回值
// 这时候 执行 2 * undefined 值为 NaN 再除以3 并返回
// 还是 NaN  { done: false, value: NaN }

a.next();
// 第三个next参数表示第二个 yield 的返回值：undefined
// 执行 5 + NaN + undefined
// 结果为  { done: true, value: NaN }

const b = foo(5);
b.next();
// 第一个next 执行 x + 1  { done: false, value: 6 }

b.next(12);
// 第二个next参数表示第一个 yield 的返回值
// 这时候 执行 2 * 12 值为 24 再除以3 并返回
// 结果为 { done: false, value: 8 }

b.next(13);
// 第三个next参数表示第二个 yield 的返回值： z = 13; y = 24
// 执行 5 + 24 + 13
// 结果为  { done: true, value: 42 }
```
> next 可以理解 **参数作为上一次 yield 的返回值，执行下一次 yield 或者 return 的动作**，因为第一次next 没有yield，所以next 的第一次传参无效

##### 产生可迭代对象
可以使用星号增强 yield 的行为，让它能够迭代一个可迭代对象，从而一次产出一个值
```js
function *gen() {
  yield* [1, 2, 3];
}

const g = gen();
for (const x of g) {
  console.log(x);
}
// 1
// 2
// 3
```
与生成器类似，yield 两侧空格不影响其行为
```js
function* generatorFn() {
  yield* [1, 2];
  yield* [3, 4];
  yield* [5, 6];
}

for (const x of generatorFn()) {
  console.log(x);
}

// 1
// 2
// 3
// 4
// 5
// 6
```
> **yield*实际上只是将一个可迭代对象序列化为一连串可以单独产出的值，所以这跟把 yield 放到一个循环里没什么不同**

```js
function *gen() {
  for(const v of [1, 2, 3]) {
    yield v;
  }
}

// 等同于

function *gen() {
  yield* [1, 2, 3];
}
```
对于生成器产生的迭代器来说，这个值就是生成器函数的返回值
```js
function *innerGeneratorFn() {
  yield 'foo';
  yield 'zzz';
  return 'bar';
}

function *outGen() {
  console.log('iter value:', yield* innerGeneratorFn());
}

for (const x of outGen()) {
  console.log('value:', x);
}
// 遍历三个次 前两个yield 返回结果值，最后一个为 innerGeneratorFn 的返回值 原样输出
// value: foo;
// value: zzz;
// iter value: bar
```

##### 使用 yield* 实现递归算法
```js
export function *nTimes(n){
  if (n > 0) {
    yield* nTimes(n - 1);
    yield n - 1;
  }
}

const g = nTimes(3);
for (const x of g) {
  console.info(x);
}
// 0
// 1
// 2
```

**注意：**
```js
function *foo() {
  yield 2;
  yield 3;
}

function *bar() {
  yield 1;
  yield* foo();
  yield 4;
}
// 等同于
function *bar() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
}
```

#### 生成器作为默认迭代器
```js
export class Foo {
  constructor () {
    this.values = [1, 2, 3];
  }

  *[Symbol.iterator]() {
    yield* this.values;
  }
}

const f = new Foo();
for (const a of f) {
  console.info('a', a);
}
// a 1
// a 2
// a 3
```
for-of 循环调用了默认迭代器（它恰好又是一个生成器函数）并产生了一个生成器对象。 这个生成器对象是可迭代的，所以完全可以在迭代中使用

#### 提前终止迭代器
##### 1. return()
return()方法会强制生成器进入关闭状态。后续调用 next()会显示 done: true 状态
```js
function *gen() {
  yield* [1, 2, 3];
}

const g = gen();
console.info(g);  // gen {<suspended>}
console.info(g.next()); // { value: 1, done: false }
console.info(g.return(10)); // { value: 10, done: true }
console.info(g);  // gen {<closed>}
```

##### 2. throw()
**throw()方法会在暂停的时候将一个提供的错误注入到生成器对象中**。如果错误未被处理，生成器就会关闭
```js
function *gen(){
  for (const v of [1, 2, 3]) {
    yield x;
  }
}

const g = gen();
console.log(g);
try {
  g.throw('foo');
} catch (e) {
  console.log(e); // foo
}

console.log(g);   // generatorFn {<closed>}
```

**假如生成器函数内部处理了这个错误，那么生成器就不会关闭，而且还可以恢复执行**。错误处理会跳过对应的 yield，因此在这个例子中会跳过一个值。
```js
function *gen(){
  for (const x of [1, 2, 3]) {
    try {
      yield x;
    } catch (e) {}
  }
}

const g = gen();
console.log(g.next()); // { done: false, value: 1}
g.throw('foo');
console.log(g.next()); // { done: false, value: 3}
```

> 如果生成器对象还没有开始执行，那么调用 throw()抛出的错误不会在函数内部被捕获，因为这相当于在函数块外部抛出了错误。

### 小结
迭代是一种所有编程语言中都可以看到的模式。ECMAScript 6 正式支持迭代模式并引入了两个新的语言特性：**迭代器**和**生成器**。

迭代器是一个可以由任意对象实现的接口，支持连续获取对象产出的每一个值。
任何实现 `Iterable` 接口的对象都有一个 `Symbol.iterator` 属性，这个属性引用默认迭代器。

迭代器必须通过连续调用 `next()`方法才能连续取得值，这个方法返回一个 `IteratorObject`。这个接口可以通过手动反复调用 `next()`方法来消费，也可以通过原生消 费者，比如 `for-of` 循环来自动消费。

生成器是一种特殊的函数，调用之后会返回一个生成器对象。生成器对象实现了 `Iterable` 接口， 因此可用在任何消费可迭代对象的地方。

