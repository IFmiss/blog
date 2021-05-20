---
title: 【面试题】js基础
date: 2021-03-29 18:49:17
categories: js
tags: [js, 面试]
---

### ['1', '2', '3'].map(parseInt)

```js
// 1, NaN, NaN

parseInt("1", 0); // 1  parseInt() 0 会根据十进制来解析，所以结果为 1；  
parseInt("2", 1); // NaN  radix 为 1，超出区间范围，所以结果为 NaN； 范围 2 - 36
parseInt("3", 2); // NaN  radix 为 2，用2进制来解析，应以 0 和 1 开头，所以结果为 NaN。
```

### Set、Map、WeakSet 和 WeakMap 的区别

Set 和 Map 主要的应用场景在于 数据重组 和 数据储存
Set 是一种叫做集合的数据结构
Map 是一种叫做字典的数据结构

**WeakSet 与 Set 的区别**

- WeakSet 只能储存对象引用，不能存放值，而 Set 都可以
- WeakSet 对象中储存的对象值都是被弱引用的，垃圾回收机制不考虑 WeakSet 对该对象的应用，如果没有其他的变量或属性引用这个对象值，则这个对象将会被垃圾回收掉。
- Set 可以遍历， WeakSet 不可遍历

**WeakMap 与 Map 的区别**

- Map 本质上是键值对的集合，无键值限制， WeakMap 只接受对象作为键名（null 除外）的键名
- WeakMap 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
- Map 可以遍历， WeakMap 不能遍历

### ES5/ES6 的继承除了写法以外还有什么区别？

继承机制完全不同
ES5 通常是构造函数继承 和 原型链继承
**构造函数继承**

```js
function Parent(name) {
  this.name = name;
  this.getName = function () {
    return this.name;
  };
}

function Child(age, ...args) {
  this.age = age;
  Parent.apply(this, args);
}

var user = new Child(20, "李四");
console.log(user.getName());
console.log(user.age);
```

**原型链继承**

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function () {
  return this.name;
};

function Child(age) {
  this.age = age;
}

Child.prototype = new Parent("张三");
// Child.prototype.constructor === Parent.prototype.constructor = Parent

var user = new Child(20);
// user.constructor === Child.prototype.constructor === Parent
console.log(user.getName());
console.log(user.age);
```

- ES5 是先创建子类实例对象的 this，然后再将父类的方法添加到 this 上面（Parent.apply(this)）。
- ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 this 上面（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。
- ES6 继承中子类的**proto**指向父类。ES5 继承中没有。

### 以下代码执行结果

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

结果

```js
var b = 10;
(function b() {
  // 内部作用域，会先去查找是有已有变量b的声明，有就直接赋值20
  // IIFE的函数无法进行赋值（内部机制，类似const定义的常量），所以无效。
  // 在非匿名自执行函数中，函数变量为只读状态无法修改
  b = 20; // 执行无效
  console.log(b); // [Function b]
})();
```

### [3, 15, 81, 292, 102, 2012].sort(); 结果，原因？

结果

```js
// [102, 15, 2012, 292, 3, 81]
```

默认按照 `ASCII` 字符编码的顺序进行排序
实现数字大小排序效果

```js
[3, 15, 81, 292, 102, 2012].sort((a, b) => a - b);
```

### 以下代码输出结果

```js
var obj = {
  2: 3,
  3: 4,
  length: 2,
  splice: Array.prototype.splice,
  push: Array.prototype.push,
};
obj.push(1);
obj.push(2);
console.log(obj);
```

结果
![结果](https://www.daiwei.site/static/blog/【面试题】js基础/object-push.png)
[,,1,2], length 为 4

有 length 属性被定义为伪数组
因为 length 为 2 所以 push 会从第三个才是，也就是索引为 2 的位置，
0, 1 则是 empty
使用 push 属性会 length + 1，因此两次 push length 变成 4。

### 以下代码执行结果

```js
var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };

console.log(a.x);
console.log(b.x);
```

结果

```js
a.x; // undefined
b.x; // { n: 2 }
```

a.x 的赋值操作被先执行
a.x 此时可以理解为 b.x;
b.x 最后被赋值 { n: 2 }
a 被赋值 { n: 2 }
因此
a.x undefined

### 为什么普通 for 循环的性能远远高于 forEach 的性能

- forEach 有诸多参数和上下文需要在执行的时候考虑进来
- for 循环则是底层写法，不会产生额外的消耗

### var、let 和 const 区别的实现原理是什么

- var 会直接在栈内存预分配内存空间，实际代码执行的时候再进行变量存储，如果传入的是应引用数据类型，则会在堆内存中开辟一个内存空间存储数据，栈内存存储的是数据的引用，指向堆内存地址。
- let 则不会预分配内存空间，而且在栈内存分配变量时，做一个检查，如果已经有相同变量名存在就会报错。
- const 与 let 一致 且变量不可变更修改，否则报错。

### 以下代码执行结果

```js
function changeObjProperty(o) {
  o.siteUrl = "http://www.baidu.com";
  o = new Object();
  o.siteUrl = "http://www.google.com";
}
let webSite = new Object();
changeObjProperty(webSite);
console.log(webSite.siteUrl);
```

结果 http://www.baidu.com
webSite 属于复合数据类型，函数参数中以地址传递，修改值会影响到原始值，但如果将其完全替换成另一个值，则原来的值不会受到影响

### 以下代码输出结果

```js
function Foo() {
  Foo.a = function () {
    console.log(1);
  };
  this.a = function () {
    console.log(2);
  };
}
Foo.prototype.a = function () {
  console.log(3);
};
Foo.a = function () {
  console.log(4);
};
Foo.a();
let obj = new Foo();
obj.a();
Foo.a();
```

结果： 4, 2, 1

```js
function Foo() {
  Foo.a = function () {
    console.log(1);
  };
  this.a = function () {
    console.log(2);
  };
}
// 以上只是 Foo 的构建方法，没有产生实例，此刻也没有执行

Foo.prototype.a = function () {
  console.log(3);
};
// 现在在 Foo 上挂载了原型方法 a ，方法输出值为 3

Foo.a = function () {
  console.log(4);
};
// 现在在 Foo 上挂载了直接方法 a ，输出值为 4

Foo.a();
// 立刻执行了 Foo 上的 a 方法，也就是刚刚定义的，所以
// # 输出 4

let obj = new Foo();
/* 这里调用了 Foo 的构建方法。Foo 的构建方法主要做了两件事：
1. 将全局的 Foo 上的直接方法 a 替换为一个输出 1 的方法。
2. 在新对象上挂载直接方法 a ，输出值为 2。
*/

obj.a();
// 因为有直接方法 a ，不需要去访问原型链，所以使用的是构建方法里所定义的 this.a，
// # 输出 2

Foo.a();
// 构建方法里已经替换了全局 Foo 上的 a 方法，所以
// # 输出 1
```

### 以下代码打印结果

```js
String("11") == new String("11");
String("11") === new String("11");
```

结果: true， false

- `==` 时做了隐式转换，调用了 toStringf 方法
- 2 者类型不一样，一个是 string，一个是 object

### 以下代码打印结果

```js
var name = "Tom";
(function () {
  if (typeof name == "undefined") {
    var name = "Jack";
    console.log("Goodbye " + name);
  } else {
    console.log("Hello " + name);
  }
})();
```

结果: Goodbye Jack
使用 var 在立即函数执行的时候，会有变量提升，此时匿名函数中 name 字段被定义为 undefined，但是并未赋值。因此走 if 条件，结果 Goodbye Jack

### 1 + "1"

结果: "11"
字符串拼接

### 2 \* "2"

结果: "4"
后面的 2 后台调用 Number()将其转换为数值，执行 \* 操作

### [1, 2] + [2, 1]

结果: "1, 22, 1"
Javascript 中所有对象基本都是先调用 valueOf 方法，如果不是数值，再调用 toString 方法。
所以两个数组对象的 toString 方法相加，值为："1,22,1"

### "a" + + "b"

结果: "aNaN"
后边的“+”将作为一元操作符，如果操作数是字符串，将调用 Number 方法将该操作数转为数值，如果操作数无法转为数值，则为 NaN。

### 以下代码执行结果

```js
function A() {
  this.name = "Tom";
  this.color = ["green", "yellow"];
}
function B() {}
B.prototype = new A();
var b1 = new B();
var b2 = new B();
b1.name = "Lily";
b1.color.push("black");
console.log(b1.name); // Lily
console.log(b2.name); // Tom
console.log(b1.color); // ["green", "yellow", "Lily"]
console.log(b2.color); // ["green", "yellow", "Lily"]
```

### e.target 和 e.currentTarget 区别

- e.target 返回触发事件的元素
- e.currentTarget 返回绑定事件的元素

### 作用域与作用域链

**作用域**
作用域就是代码的执行环境，全局执行环境就是**全局作用域**，函数的执行环境就是**函数作用域**，还有**块级作用域**，它们都是栈内存。
**作用域链**
通常情况下会在当前作用域查找值，如果找不到，则往上查找直至全局作用域，这种被称为作用域链。

### 原型与原型链

**原型**
每一个 javascript 对象(除 null 外)创建的时候，就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型中“继承”属性。

**原型链**
对于对象而言（null 除外）**，每个 JS 对象一定对应一个原型对象，并从原型对象继承属性和方法**。**对象的 `__proto__` 指向构造函数的 `prototype`**，如果在对象中访问的属性不存在，则会层层往上找原型中要访问的属性，知道最顶层的 null，如果还没有找到则返回 `undefined`，而这层链被称为原型链。

### instanceof 原理

`instanceof` 运算符用于测试构造函数的 prototype 属性是否出现在对象原型链中的任何位置。

```js
a instanceof Function;

// a.__proto__ === Function.prototype ?
// a.__proto__.__proto__ === Function.prototype ?
// 直到左边为null 如果还不等，则false，否则true，且return
```

### typeof 原理

`typeof` 用于检测变量数据类型，由解释器内部实现。

**不同的对象在底层都表示为二进制，在 Javascript 中二进制前（低）三位存储其类型信息。**

- 000: 对象
- 010: 浮点数
- 100：字符串
- 110： 布尔
- 1： 整数
- `null`：所有机器码均为 0

**`typeof` 在判断 `null` 的时候就出现问题了，由于 `null` 的所有机器码均为 0，因此直接被当做了对象来看待。**

### new 一个对象执行了什么操作

- 创建一个空对象 obj {}
- 将该对象的 `__proto__` 指向构造函数的原型 `prototype`, 将对象上的 `__proto__` 的 `constructor` 为该构造函数。
- 传入参数，并让构造函数执行，调用时执行 obj 的 this 上下文。
- 如果返回的是对象类型（null 除外）则返回该对象，否则返回 obj。

### es6 箭头函数的理解

- 箭头函数不会创建自己的 this，它只会从自己的作用域链上找父级执行上下文的 this
- 没有 arguments 对象
- 箭头函数是不能通过 `call()`,`apply()`,`bind()`方法改变 this，也不能当做构造函数

### 构造函数和箭头函数的差别

- 箭头函数没有自己的 this
- 箭头函数 arguments 对象
- 箭头函数不能被 new 实例化
- 箭头函数语法上比普通函数更加简洁

### js 加载 `async`/`defer` 区别

- **async**不会按照出现的顺序执行，**先下载完成哪个就先执行哪个**，**defer**会按照出现的顺序执行。
- **async** 脚本加载完成，就会中断 HTML 解析，同时执行脚本。**defer**在脚本下载完成之后，等 HTML 解析完成后每个脚本都会有序执行。
  > 二者都仅适用于外链，规定脚本异步执行
  > 二者的下载不会阻塞页面解析

### &lt;script &gt;与 &lt;script async &gt; 的区别

**script**

- 浏览器会立即加载并执行指定的脚本
- **会阻塞 HTML 文档解析**，并按照它们出现的顺序执行

**script + async**

- 仅适用于外链
- 下载不会阻塞页面解析
- 脚本的加载完成后就马上执行，**脚本执行时会阻塞 HTML 解析**
- 不会按照出现的顺序执行，**先下载完成哪个就先执行哪个**
- DOMContentLoaded 事件的触发并不受 async 脚本加载的影响。

  > async 仅适用于外链，规定脚本异步执行, 执行的时候，有可能页面还没解析完成

### 以下代码执行结果

```js
function Foo() {
  getName = function () {
    console.log(1);
  };
  console.log("this is" + this);
  return this;
}

Foo.getName = function () {
  console.log(2);
};
Foo.prototype.getName = function () {
  console.log(3);
};
var getName = function () {
  console.log(4);
};
function getName() {
  console.log(5);
}

Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();
```

结果

```js
Foo.getName(); // 2
// 构造函数的静态属性（方法）

getName(); // 4
// 函数声明提前 >  变量声明提前，所以var getName覆盖了function getName

Foo().getName();
// this is window
// 1
// 执行Foo（）函数的时候，全局的getName函数被覆盖，所以输出1

getName(); // 1
// 因为 上一步全局的getName函数被覆盖，所以输出1

new Foo.getName(); // 2
// 先执行 Foo.getName 返回一个方法 a，再执行 new a();
// 实例话只能得到一个空属性的实例，Foo.getName 被执行打印 2

new Foo().getName(); // 3
// 相当于执行
// a = new Foo()
// a.getName();

new new Foo().getName(); // 3
// 相当于执行
// a = new Foo();
// b = a.getName()
// new b();
```

> **函数声明提前 > 变量声明提前** 同样的名称会被 变量声明覆盖

### for in 和 for of 的区别

- `for in` 只能遍历 key， `for of` 遍历的是值
- 对于普通对象没有 `iterator` 接口使用 `for of` 会报错
- `for in` 循环不仅遍历数字键名，还会遍历手动添加的其它键，甚至包括原型链上的键。`for of` 则不会这样

### 怎么判断一个对象是不是可迭代的

```js
let o = {};
typeof o[Symbol.iterator] === "function";
```

### 宏任务微任务执行顺序

1. 执行宏任务，直至调用栈被清空
2. 执行宏任务过程遇到微任务，将微任务添加到任务队列中。
3. 主进程代码执行完成之后，执行将微任务添加到调用栈中，执行代码，这个过程需要清空微任务队列。
4. 执行完毕之后可能会执行 `requestAnimationFrame` ，然后渲染浏览器
5. 执行下一轮循环。

### `on` 与 `addEventListener` 的区别

- `on` 是 DOM0 事件处理程序的产物，`addEventListener` 是 DOM 2
- `on` 只能注册一个事件回调，注册多个会被覆盖，`addEventListener`支持多个
- `addEventListener` 支持 dom，window，document 等元素，`on` 只支持 html 元素
- 使用语法存在差异（注册，解绑）

### a.b.c.d 和 a['b']['c']['d']哪个性能更高

- `a.b.c.d` 比 `a['b']['c']['d']` 性能高点，后者还要考虑`[ ]`中是变量的情况。
- 后者 `AST` 会大一些，但在 `AST` 解析上消耗的这点时间基本可以忽略不计

### `class` 的原理

class 本身是 构造函数的语法糖，内部使用 构造函数定义，但不允许直接执行构造函数，通过 Object.defineProperties 针对 构造函数 增加一些属性与值。

### `super` 的原理

`super` 作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
ES6 规定，在子类普通方法中通过 `super` 调用父类的方法时，方法内部的 this 指向当前的子类实例。

### js 判断是否是整数

```js
function isInteger(obj) {
  return typeof obj === "number" && obj % 1 === 0;
} // 会有隐式类型转换问题 '' 也会返回true

Number.isInteger; // 最终解决方案
```

### commonjs 与 esm 的区别

- CommonJS 模块输出的是一个**值的拷贝**，ES6 模块输出的是**值的引用**
  - CommonJS 模块输出的是值的拷贝，即：一旦输出一个值，模块内部的变化就影响不到这个值
  - ES6 JS 引擎对脚本静态分析的时候，遇到模块记载命令 import，就会生成一个只读引用，等到脚本真正执行时，再**根据这个只读引用，到被加载的那个模块里面去取值**。ES6 模块是动态引用，并且不会缓存值，模块里面的那个变量绑定其所在的模块
- CommonJS 模块是**运行时加载**，ES6 模块是**编译时输出接口**
  - 因为 CommonJS 加载的是一个对象（module.exports 属性），该对象只有在脚本运行完才会生成
  - 而 ES6 模块不是对象，他的对外接口是一种静态定义，在代码静态解析阶段就会完成

### 如何让函数不能被 new

**`new.target`** 做判断

```js
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error("本类不能实例化");
    }
  }
}
```

### 以下代码执行结果

```js
let val = 0;

class A {
  set foo(_val) {
    val = _val;
  }
  get foo() {
    return val;
  }
}

class B extends A {}

class C extends A {
  get foo() {
    return val;
  }
}

const b = new B();
console.log(b.foo);
b.foo = 1;
console.log(b.foo);

const c = new C();
console.log(c.foo);
c.foo = 2;
console.log(c.foo);
console.log(b.foo);
```

结果

```js
// 0
// 1
// 1
// 1
// 1
```
