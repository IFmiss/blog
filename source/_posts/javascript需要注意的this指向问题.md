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
