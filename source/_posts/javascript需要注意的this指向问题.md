---
title: javascript需要注意的this指向问题
date: 2019-10-15 17:13:35
categories: javascript
tags: ["js"]
---

this 指向是 JavaScript 常见的一个知识点，也是平时经常遇到的问题，包括面试时候也经常会问到

### 全局环境中

在全局环境中，this 指向 windows

```ts
console.log(this); // window
var a = 1;
console.log(window.a); // 1
this.b = 3;
console.log(b); // 3
console.log(window.b); // 3
```

### 对象中方法

此时方法运行的时候绑定的是 obj 对象，this 指向 obj

```ts
function fn() {
  console.log(this.a);
}

var obj = {
  a: 1,
  b: fn,
};

obj.b(); // 1
```

虽然 foo 是 obj 对象的方法，但是在函数 foo 执行的时候，this 是在函数执行的时候绑定的，也就是 foo 函数的作用域的对象也就是 window

```ts
var a = "window.a";
function fn() {
  console.log(this.a);
}

var obj = {
  a: 1,
  b: fn,
  c: () => {
    console.log(this.a);
  },
};
var foo = obj.b;
obj.b(); // 1
foo(); // window.a
obj.c(); // window.a
```

### 构造函数中

构造函数中的 this 指向的是实例化构造函数返回的新的对象

```ts
function Fn() {
  this.a = 1;
}
var foo = new Fn();
foo.a; // 1
```

### call, apply 方式调用函数

call, apply 可以修改调用函数的 this 指向

```ts
function fn() {
  console.log(this);
}

fn.call("test"); // string对象 test
fn.call(null); // window
fn.call({
  a: 1,
}); // { a: 1 }
```

### 定时器

定时器中的 this，指向的是 window

```ts
var a = "window.a";
setTimeout(function () {
  console.log(this); // window
});

const obj = {
  a: 1,
  b: function () {
    setTimeout(function () {
      console.log(this.a);
    }, 400);
  },
};
obj.b(); // window.a
```

### 元素绑定事件

回调函数执行的 this 指向的是当前的元素

```ts
const ele = document.getElementById('btn')
ele.onclick = funciton () {
  console.log(this)     // ele  元素
}
ele.addEventListener('click', function () {
  console.log(this)}    // ele  元素
)
```

### 函数调用的时候绑定 bind

```ts
const ele = document.getElementById('btn')
ele.onclick = funciton () {
  console.log(this)     // window
}.bind(window)
```

以上是 this 指向的出现场景，下面再做一些 this 相关的面试题巩固了解一下

#### 题目一

```ts
this.x = 9; // this refers to global "window" object here in the browser
var module = {
  x: 81,
  getX: function () {
    return this.x;
  },
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX(); // 9
```

因为 this 的指向是在函数执行的时候绑定的，而非函数创建时绑定，所以 retrieveX() === this.retrieveX() === 9, module.getX() === 81

#### 题目二

```ts
function foo() {
  console.log(this.a);
}
var a = 2;
var b = { a: "b.a", foo: foo };
var c = { a: "c.a" };

foo(); // 2
b.foo(); // 'b.a'
console.log(b.foo);
(c.foo = b.foo)(); // 2
c.foo(); // 'c.a'
```

至于为什么`(c.foo = b.foo)() === 2`,我们来解释一下
(c.foo = b.foo)()我们可以这么写

```ts
function foo() {
  console.log(this.a);
}
var a = 2;
var b = { a: "b.a", foo: foo };
var c = { a: "c.a" };

function fn() {
  c.foo = b.foo;
  return c.foo;
}
fn()(); // 2
```

而 fn 执行的方法指向的 this 是 window，结果也就是 2 了

#### 题目三

```ts
var len = 10;
function fn() {
  console.log(this.len);
}

var obj = {
  len: 5,
  getLen: function (fn) {
    console.log(this.len);
    fn();
    arguments[0]();
  },
};
obj.getLen(fn, 1);
// 5
// 10
```

this 永远指向调用他的对象，没错 `getLen`方法里的 this 指向的是 obj 对象，所以拿到的第一个打印信息是 5，但是在该方法内部执行的 fn 有单独的 this 绑定，也就是 window，所以第二个结果为 10

#### 题目四

```ts
var foo = 1;
function fn() {
  this.foo = 2;
  console.log(foo);
}
fn(); // 2
```

fn 执行方法 this 指向的 window，导致 foo 被赋值成 2，打印的就是 2

```ts
var foo = 1;
function fn() {
  this.foo = 2;
  console.log(foo);
}
new fn(); // 1
new fn().foo; // 2   实例化的this指向的不是window 而是 实例化生成的新对象
```

#### 题目五

```ts
var a = {
  name: "zh",
  sayName: function () {
    console.log(`hello, ${this.name}`);
  },
};
var name = "ls";
function sayName() {
  var s = a.sayName;
  s(); // 'hello, ls'
  a.sayName(); // 'hello, zh'
  a.sayName(); // 'hello, zh'
  (b = a.sayName)(); // 'hello, ls'
}

sayName();
```

- 分析
- `s()` this 指向的是全局对象也就是 window.name 也就是 'hello, ls'
- `a.sayName()` 此时执行的是 a 对象下的方法，a.sayName 绑定的对象是 a，a.name 为'zh'，因此结果为'hello, zh'
- `(a.sayName)()` 等价于 a.sayName() 结果和上面一样为'hello, zh'
- `(b = a.sayName)()` 赋值操作再执行 b 方法等价于第一个结果为 'hello, ls'

#### 题目六

```ts
var name = "zh";
var obj = {
  name: "ls",
  sayName: function () {
    console.log(`this.name: ${this.name}`);
  },
  callback: function () {
    var _this = this;
    return function () {
      var sayName = _this.sayName;
      _this.sayName(); // this.name: ls
      sayName(); // this.name: zh
    };
  },
};
obj.callback()();
```

- 分析
  - `obj.callback()` 返回一个函数，此时已经绑定了\_this 的指向，为`obj`对象，然后再执行这个函数
  - `_this.sayName()` 就相当于`obj.sayName()`，所以执行的结果为 'this.name: ls'
  - `sayName()` 在执行的时候当前函数的时候 this 的指向为 window，此时的 sayName 方法中的 this.name 相当于 window.name 也就是'zh'，最后的结果为'this.name: zh'
