---
title: 【js高级程序】对象、类与面向对象编程
date: 2020-12-25 08:18:07
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第8章*

ECMA-262 将对象定义为一组属性的无序集合。严格来说，这意味着对象就是一组没有特定顺序的值。

### 理解对象
创建自定义对象的通常方式是创建 Object 的一个新实例，然后再给它添加属性和方法
```js
let person = new Object();
person.name = "Nicholas";
person.age = 29;
person.job = "Software Engineer";
person.sayName = function() {
  console.log(this.name);
};
```
字面量创建
```js
let person = {
  name: "Nicholas",
  age: 29,
  job: "Software Engineer",
  sayName() {
    console.log(this.name);
  }
};
```

#### 数据属性
数据属性有 4 个特性描述它们的行为。
- `[[Configurable]]` 
  - 是否可以通过 delete 删除并重新定义
  - 是否可以修改它的特性
  - 是否可以把它改为访问器属性。
  - 默认为 **`true`**
- `[[Enumerable]]`
  - 是否可以通过 `for-in` 返回属性
  - 默认为 **`true`**
- `[[Writable]]`
  - 是否可以被修改
  - 默认为 **`true`**
- `[[Value]]`
  - 包含属性的实际值，即前面提到的那个读取和写入属性值的位置
  - 默认为 **`undefined`**

在像前面例子中那样将属性显式添加到对象之后， [[Configurable]] 、 [[Enumerable]] 和 [[Writable]]都会被设置为 true，而[[Value]]特性会被设置为指定的值。
```js
const person = {
  name: "Nicholas"
}
```
创建一个 `person` 对象 `name` 属性为 `Nicholas`, 可以通过 `Object.getOwnPropertyDescriptors(person)` 查看对象的属性信息
```js
console.log(Object.getOwnPropertyDescriptors(person));
// name:
//   configurable: true
//   enumerable: true
//   value: "Nicholas"
//   writable: true
```

#### 访问器属性
访问器属性不包含数据值。相反，它们包含一个获取`（getter）`函数和一个设置`（setter）`函数，不过这两个函数不是必需的。

- `[[Configurable]]` 
  - 是否可以通过 delete 删除并重新定义
  - 是否可以修改它的特性
  - 是否可以把它改为访问器属性。
  - 默认为 **`true`**
- `[[Enumerable]]`
  - 是否可以通过 `for-in` 返回属性
  - 默认为 **`true`**
- `[[Get]]`
  - 获取函数，在读取属性时调用
  - 默认值为 **`undefined`**
- `[[Set]]`
  - 获取函数，在写入属性时调用
  - 默认值为 **`undefined`**

访问器属性是不能直接定义的，必须使用 Object.defineProperty()。
```js
let book = {
  year_: 2017,
  edition: 1
}

Object.defineProperty(book, 'year', {
  get() {
    return this.year_;
  },

  set(newV) {
    if (newV > 2017) {
      this.year_ = newV;
      this.edition ++;
    }
  }
})

book.year = 2018;
console.log(book.edition);  // 2
```

#### 定义多个属性
实例代码没有设置属性的可写操作，代码是没有办法跑通的，这里设置 `year_` , `edition` 可写
```js
let book = {}

Object.defineProperties(book, {
  year_: {
    value: 2017,
    writable: true
  },
  edition: {
    value: 1,
    writable: true
  },
  year: {
    get() {
      return this.year_;
    },
  
    set(newV) {
      if (newV > 2017) {
        this.year_ = newV;
        this.edition ++;
      }
    }
  }
})

console.log(book.edition) // 1
book.year = 2018;
console.log(book.edition); // 2
```

#### 读取属性的特性
**Object.getOwnPropertyDescriptor()** 方法可以取得指定属性的属性描述符。
接受两个参数:
- 目标对象
- 属性名称
接着上一个实例使用 `book` 对象
```js
let descriptor = Object.getOwnPropertyDescriptor(book, 'year_');
console.log(descriptor);
// configurable: false
// enumerable: false
// value: 2018
// writable: true

console.log(Object.getOwnPropertyDescriptor(book, 'year'));
// configurable: false
// enumerable: false
// get: ƒ ()
// set: ƒ (newV)
```
对于**数据属性** `year_`，value 等于原来的值，configurable 是 false，get 是 undefined，writable 是 true
对于**访问器属性** `year`，value 是 undefined，enumerable 是 false，get 是一个指向获取函数的指针

**Object.getOwnPropertyDescriptor()**会在每个自有属性上调用 `Object.getOwnPropertyDescriptor()`，接收一个参数
- 目标对象

```js
conosle.log(Object.getOwnPropertyDescriptor(book));
// {
//   edition: {
//     configurable: false
//     enumerable: false
//     value: 2
//     writable: true
//   },
//   year: {
//     configurable: false
//     enumerable: false
//     get: ƒ ()
//     set: ƒ (newV)
//   },
//   year_: {
//     configurable: false
//     enumerable: false
//     value: 2018
//     writable: true
//   }
// }
``` 

#### 合并对象
**Object.assign()** ECMAScript 6 专门为合并对象提供的方法
这个方法接收 **一个目标对象** 和 **一个或多个源对象** 作为参数，然后将每个源对象中
- `可枚举（Object.propertyIsEnumerable()返回 true）` 和
- `自有（Object.hasOwnProperty()返回 true）属性` 复制到目标对象。
使用每一个源对象(即被复制的值)的`[[Get]]`取得属性值，然后使用目标对象的`[[Set]]`设置属性的值
```js
let dest = {};
let src = { id: 'src' }
let result = Object.assign(dest, src);
console.log(dest === result);   // true
console.log(dest !== src);    // true
console.log(result); //  { id: 'src' }
```
> Object.assign()实际上对每个源对象执行的是浅复制。如果多个源对象都有相同的属性，则使 用最后一个复制的值。

#### 对象标识及相等判定
**`Object.is`** 方法与===很像，但同时也考虑到了边界情形
方法接收两个参数: 被比较的两个值；
```js
let a = [];
console.log(Object.is(a, a)); // true
console.log(Object.is(a, []));  // false

let b = NaN;
console.log(b === b); // false  
console.log(Object.is(b, b)); // true

console.log(+0 === -0); // true
console.log(Object.is(+0, -0)); //  false
```
要检查超过两个值，递归地利用相等性传递即可：
```js
function recursivelyCheckEqual(x, ...rest) {
  return Object.is(x, rest[0]) && (rest.length < 2 || recursivelyCheckEqual(...rest));
}
```

#### 增强的对象语法
##### 1. 属性值简写
```js
let name = 'Matt';
let person = {
  name
};
```

##### 2. 可计算属性
```js
const nameKey = 'name';
const ageKey = () => 'age';
const jobKey = 'job';

let person = {
  [nameKey]: 'Matt',
  [ageKey()]: 27,
  [jobKey]: 'Software engineer'
};
```
> 可计算属性表达式中抛出任何错误都会中断对象创建。如果计算属性的表达式有副作用，那就要小心了，因为如果表达式抛出错误，那么之前完成的计算是不能回滚的。

##### 3. 对象解构
```js
const person = {
  name: 'dw',
  age: 27,
  job: 'fed'
}

const { name, ...rest } = person;
// name   dw
// rest   { age: 27, job: 'fed' }
```
关于对象解构的具体内容可以看这里: [es6入门 - 变量解构](https://es6.ruanyifeng.com/#docs/destructuring#%E5%AF%B9%E8%B1%A1%E7%9A%84%E8%A7%A3%E6%9E%84%E8%B5%8B%E5%80%BC)


### 创建对象
#### 工厂模式
工厂模式是一种众所周知的设计模式，广泛应用于软件工程领域，用于抽象创建特定对象的过程。
```js
function createPerson(name, age, job) {
  let o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function() {
    console.log(this.name);
  };
  return o;
}

let person1 = createPerson("Nicholas", 29, "Software Engineer");
let person2 = createPerson("Greg", 27, "Doctor");
```
`createPerson` 每次执行都会返回包含 3 个属性和 1 个方法的对象

#### 构造函数模式
```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    console.log(this.name);
  };
}
let person1 = new Person("Nicholas", 29, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");

person1.sayName();  // Nicholas
person2.sayName();  // Greg
```
要创建 Person 的实例，应使用 new 操作符。以这种方式调用构造函数会执行如下操作。
- 内存创建新对象
- 新对象的 `__proto__` 属性被赋值为函数的 `prototype` 属性
- 构造函数的 `this` 被赋值为这个新对象 (即 `this` 指向新对象)
- 执行构造函数内部代码 (即创建对象属性)
- 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的对象。

##### 1. 构造函数也是函数
作为构造函数调用
```js
let person = new Person("Nicholas", 29, "Software Engineer");
person.sayName(); // "Nicholas"
```

作为函数调用
```js
Person("Greg", 27, "Doctor"); // 添加到 window 对象
window.sayName(); // "Greg"
```

在另外一个对象作用域中调用
```js
let o = new Object();
Person.call(o, "Kristen", 25, "Nurse");
o.sayName();   // "Kristen"
```

使用 new 操作符创建一个新对象。然后是普通 函数的调用方式，这时候没有使用 new 操作符调用 Person()，结果会将属性和方法添加到 window 对象。

> 在调用一个函数而没有明确设置 this 值的情况下（即没有作为对象的方法调用，或者没有使用 call()/apply()调用），this 始终指向 Global 对象（在浏览器中就是 window 对象）。

> 构造函数与普通函数唯一的区别就是调用方式不同。

##### 2. 构造函数的问题 (定义的方法会在每个实例上都创建一遍)
person1 和 person2 都有名为 sayName()的方法，但这两个方 法不是同一个 Function 实例。
```js
console.log(person1.sayName == person2.sayName); // false
```
*可以把函数定义转移到构造函数外部*
```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = sayName;
}

function sayName() {
  console.log(this.name);
}

let person1 = new Person("Nicholas", 29, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");

person1.sayName();  // Nicholas
person2.sayName();  // Greg
console.log(person1.sayName == person2.sayName); // true
```
> 但是这么做又有问题： 函数作用域问题，所以会有更好的方式来创建对象 => 原型模式

#### 原型模式

