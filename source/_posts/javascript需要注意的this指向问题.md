---
title: javascript需要注意的this指向问题
date: 2019-10-15 17:13:35
categories: javascript
tags: ['js']
---

this指向是JavaScript常见的一个知识点，也是平时经常遇到的问题，包括面试时候也经常会问到

### 全局环境中
在全局环境中，this指向windows
```ts
console.log(this)   // window
var a = 1
console.log(window.a)  // 1
this.b = 3
console.log(b)   // 3
console.log(window.b) // 3
```

### 对象中方法
此时方法运行的时候绑定的是obj对象，this指向obj
```ts
function fn() {
  console.log(this.a)
}

var obj = {
  a: 1,
  b: fn
}

obj.b()   // 1
```

虽然foo是obj对象的方法，但是在函数foo执行的时候，this是在函数执行的时候绑定的，也就是foo函数的作用域的对象也就是window
```ts
var a = 'window.a'
function fn() {
  console.log(this.a)
}

var obj = {
  a: 1,
  b: fn,
  c: () => {
    console.log(this.a)
  }
}
var foo = obj.b
obj.b()   // 1
foo()   // window.a
obj.c()   // window.a
```

### 构造函数中
构造函数中的this指向的是实例化构造函数返回的新的对象
```ts
function Fn () {
  this.a = 1
}
var foo = new Fn()
foo.a   // 1
```

### call, apply方式调用函数
call, apply可以修改调用函数的this指向
```ts
function fn () {
  console.log(this)
}

fn.call('test')   // string对象 test
fn.call(null)     // window
fn.call({
  a: 1
})                // { a: 1 }
```

### 定时器
定时器中的this，指向的是window
```ts
var a = 'window.a'
setTimeout(function() {
  console.log(this)   // window
})

const obj = {
  a: 1,
  b: function () {
    setTimeout(function() {
      console.log(this.a)
    }, 400)
  }
}
obj.b()   // window.a
```

### 元素绑定事件
回调函数执行的this指向的是当前的元素
```ts
const ele = document.getElementById('btn')
ele.onclick = funciton () {
  console.log(this)     // ele  元素
}
ele.addEventListener('click', function () {
  console.log(this)}    // ele  元素
)
```

### 函数调用的时候绑定bind
```ts
const ele = document.getElementById('btn')
ele.onclick = funciton () {
  console.log(this)     // window
}.bind(window)
```

