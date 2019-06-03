---
title: 手写call，apply，bind方法
date: 2019-06-03 15:54:53
categories: javascript
tags: [js]
---

之前在面试一个前端工作的时候，一个面试官给我一张纸，一支笔让我手写一个bind方法要求能实现和bind一样的效果，当时就一脸懵逼，慢慢熬出大概的思路。之后网上搜了一下对应的方式，自己照着写了一遍理解了一下，很有收获，记录下
<!-- more  -->

bind方法是挂载在Function.prototype的一个方法，这里使用 selfBind 避免冲突
- bind方法返回的是一个可执行的方法
- bind的第一个参数 使用会让this指向对应的对象之中，没有回默认指向 window
- bind的第二个以及以后的参数 则作为调用的方法的参数传入
```ts
// 申明  不然在Function.prototype设置对应方法会报错
interface Function {
  selfCall(...args: any): any;
  selfApply(...args: any): any;
  selfBind(...args: any): any;
}
```

```ts
// call
Function.prototype.selfCall = function (context) {
  // 设置context上下文，如果没有则默认为 window
  const selfContext = context || window
  try {
    // __Self__Call_Fn设置为调用的方法
    selfContext.__Self__Call_Fn = this
    // 获取第二个以及之后的参数
    const arg = [...arguments].slice(1)
    // 执行该方法赋值给 result
    const result = selfContext.__Self__Call_Fn(...arg)
    // 移除 selfContext 上的 __Self__Call_Fn 属性
    delete selfContext.__Self__Call_Fn
    // 返回 result
    return result
  } catch (e) {
    console.log(e)
    delete selfContext.__Self__Call_Fn
  }
}
```

```ts
// apply
Function.prototype.selfApply = function (context) {
  // 设置context上下文，如果没有则默认为 window
  const selfContext = context || window
  try {
    // __Self_Apply_Fn设置为调用的方法
    selfContext.__Self_Apply_Fn = this
    // 获取第二个参数
    const arg = [...arguments][1]
    // 判断第二个参数是否为数组
    if (!Array.isArray(arg)) {
      throw new TypeError('apply 的第二个参数被要求是数组')
    }
    // 执行该方法赋值给 result
    const result = selfContext.__Self_Apply_Fn(...arg)
    // 移除 selfContext 上的 __Self_Apply_Fn 属性
    delete selfContext.__Self_Apply_Fn
    // 返回 result
    return result
  } catch (e) {
    console.log(e)
    delete selfContext.__Self_Apply_Fn
  }
}
```

```ts
// bind 返回一个方法
Function.prototype.selfBind = function (context) {
  // 设置context上下文，如果没有则默认为 window
  const selfContext = context || window
  try {
    // __Self_Bind_Fn 设置为调用的方法
    selfContext.__Self_Bind_Fn = this
    // 获取第二个以及之后的参数
    const arg = [...arguments].slice(1)
    // 返回一个方法
    return function () {
      selfContext.__Self_Bind_Fn(...arg)
    }
  } catch (e) {
    console.log(e)
    delete selfContext.__Self_Bind_Fn
  }
}
```
在使用的时候:
```ts
const Person = {
  name: 'Tom',
  say (self = '1111', a) {
    console.log('Person.say')
    console.log(`我叫${this.name}---${self}---${a}`)
  }
}

const Person1 = {
  name: 'Tom 1',
  firstName: 'd',
  lastName: 'w',
}

const Student = {
  firstName: 'dai',
  lastName: 'wei',
  getName () {
    console.log(`FullName: ${this.firstName} -- ${this.lastName}`)
  }
}

Person.say.selfCall(Person1, 222, '111')                    // 我叫Tom 1---222---111
Person.say.selfCall(Person1, 999)                           // 我叫Tom 1---999---undefined
Student.getName.selfCall(Person1)                           // FullName: d -- w
Person.say.selfApply(Person1, [333, 111, 222])              // 我叫Tom 1---333---111
Person.say.selfApply(Person1, 333, 111, 222)                // 报错  TypeError: apply 的第二个参数被要求是数组
Person.say.selfBind(Person1, 'dwdwdwdwdwdwdw', '111')()     // 我叫Tom 1---dwdwdwdwdwdwdw---111
```
以上！
