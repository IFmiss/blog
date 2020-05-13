---
title: 实现一个Promise!
date: 2020-05-13 23:44:01
categories: js
tags: js
---

手动实现一个Promise 有助于帮助理解promise实现原理

Promise 在es6被实现作为异步处理的解决方案

在实现之前我们先了解一下 Promise 在es6已知的api

- `const p = new Promise`   创建一个Promise
- `p.then`  当 p 中的 `status` 状态 从 `pedding` 到 `resolved` 或 `pedding` 到 `rejected`, 被决议后执行
- `p.catch`  对于 p 的错误处理
- `Promise.resolve(value)`  返回一个由 value 决议的 Promise对象
- `Promise.reject(reason)`  返回一个由 reason 决议的 Promise对象
- `Promise.all(Promise[])`  Promise数组全部成功后 resolve
- `Primise.race(Promise[])`  Primise之间的竞态 只要有一个成功即可 promise则会resolve，否则reject

### 创建一个 Promise class
```ts
enum PROMISE_STATE {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}
type resolveFn = (value?: any) => void
type rejectFn = (reason?: any) => void

class PromiseSf {
  public state: PROMISE_STATE   // promise 状态标示
  public value: any     // promise resolve 返回的值信息
  public reason: any      // promise reject 的原因
  public onFulfilledArrayFn: Array<Function> = []   // 存储异步执行的 resolve 回调 在promise 进入 resolved 后遍历执行
  public onRejectedArrayFn: Array<Function> = []    // 存储 reject 回调，功能同上
  static resolve: (value: any) => PromiseSf       // 静态方法，用于后续实现 Promise.resolve 方法
  static reject: (reason: any) => PromiseSf       // 静态方法，用于后续实现 Promise.reject 方法
}
```
我们创建了一个 Promise 需要的属性信息

```ts
const p = new PromiseSf((resolve, reject) => {
  // ...
})
```
当实例化一个 `promise` 对象时，需要传递一个方法，包含两个参数，`resolve`, `reject` 方法，根据需要调用 resolve 或 reject 方法

此时我们需要写一个立即执行代码
```ts
constructor(fn: (resolve: resolveFn, reject: rejectFn) => void) {
  // 设置 promise 初始状态值 pedding
  this.state = PROMISE_STATE.PENDING
  try {
    // 执行 Promise 初始化内部的代码 这个地方的代码是同步的
    fn(this.resolve.bind(this), this.reject.bind(this))
  } catch (e) {
    this.reject(e)
  }
}
```

### p.resolve
```ts
private resolve(value: any) {
  if (this.state == PROMISE_STATE.PENDING) {
    this.value = value
    this.state = PROMISE_STATE.RESOLVED
    this.onFulfilledArrayFn.forEach(fn => fn(value))
  }
}
```
由于 Promise 只会从 `pedding` 到 `resolved` 或者 `pedding` 到 `rejected` 且更改完成后状态不能再被改变，所以这里只处理 state 为 Pedding 的状态

### p.reject
```ts
private reject(reason: any) {
  if (this.state == PROMISE_STATE.PENDING) {
    this.reason = reason
    this.state = PROMISE_STATE.REJECTED
    this.onRejectedArrayFn.forEach(fn => {fn(reason)})
  }
}
```

### p.then




