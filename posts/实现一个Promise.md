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
- `Primise.race(Promise[])`  promise之间的竞态 只要有一个成功即可 promise则会resolve，否则reject
- `Primise.allSettled(Promise[])`  所有promise执行完成之后执行，无论成功和失败，都会返回，类似 promise.all 的返回值

promise a+ 基本的规范定义
**Promise States**
  - 2.1.1 When pending, a promise:
    - 2.1.1.1 may transition to either the fulfilled or rejected state.
  - 2.1.2 When fulfilled, a promise:
    - 2.1.2.1 must not transition to any other state.
    - 2.1.2.2 must have a value, which must not change.
  - 2.1.3 When rejected, a promise:
    - 2.1.3.1 must not transition to any other state.
    - 2.1.3.2 must have a reason, which must not change.

总结来看就是
  - 状态只能从 `pedding` 到 `resolved` 或 `pedding` 到 `rejected`，且不可改变
  - resolve 返回一个 value， reject会返回一个 reason

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
  public state: PROMISE_STATE   // promise 状态标识
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
then方法是promise最重要的一个方法，then函数接受两个回调函数， `onFulfilled, onRejected` 分别是成功和失败的回调函数，且then 支持链式调用，返回的是一个新的promise

根据promise a+规范，写一个 `promise.then(onFulfilled, onRejected)`

- 2.2.1 这两个 `onFulfilled` 和 `onRejected` 可选的参数：
  - 2.2.1.1 如果 `onFulfilled` 不是函数，则必须将其忽略。
  - 2.2.1.1 如果 `onRejected` 不是函数，则必须将其忽略。
- 2.2.2 如果 `onFulfilled` 是一个函数：
  - 2.2.2.1 必须在promise实现后调用，以promise的值作为第一个参数。
  - 2.2.2.2 在promise实现之前不能调用它。
  - 2.2.2.3 不能多次调用它。
- 2.2.3 同2.2.2
- 2.2.4 `onFulfilled` 或 `onRejected` 在执行上下文堆栈仅包含平台代码之前不得调用。 (异步执行，setTimeout or MutationObserver...)
- 2.2.5 `onFulfilled` 并且 `onRejected` 必须作为函数调用（即没有this值）
- 2.2.6 then 可能在同一诺言中多次被调用。
- 2.2.7 then必须返回承诺 返回一个新 promise 
  - 2.2.7.1 如果有一个onFulfilled或onRejected返回一个值x，请运行Promise Resolution Procedure [[Resolve]](promise2, x)。
  - 2.2.7.2 如果任何一个onFulfilled或onRejected引发异常e，则promise2必须以拒绝e为理由。
  - 2.2.7.3 如果onFulfilled不是函数且promise1已实现，则promise2必须使用与相同的值来实现promise1。
  - 2.2.7.4 如果onRejected不是功能而promise1被拒绝，则promise2必须以与相同的理由将其拒绝promise1。
- 2.3.1 如果promise和x引用相同的对象，promise则以拒绝TypeError为理由。
- 2.3.2 如果x是一个承诺，则采用其状态[ 3.4 ]：
  - 2.3.2.1 如果x未决，则promise必须保持未决状态，直到x实现或被拒绝。
  - 2.3.2.2 如果/何时x满足，promise则以相同的值满足。
  - 2.3.2.3 如果/何时x被拒绝，promise则以相同的理由拒绝。
- 2.3.3 否则，如果x是对象或函数，
  - 2.3.3.1 我们then是x.then。
  - 2.3.3.2 如果检索属性x.then中抛出的异常的结果e，拒绝promise与e作为的原因。
  - 2.3.3.3 如果then是函数，请使用xas this，第一个参数resolvePromise和第二个参数进行调用rejectPromise，其中：
    - 2.3.3.3.1 如果/何时resolvePromise使用值调用y，请运行[[Resolve]](promise, y)。
    - 2.3.3.3.2 如果/当rejectPromise是带一个理由r，拒绝promise与r。
    - 2.3.3.3.3 如果同时调用resolvePromise和rejectPromise，或者对同一个参数进行了多次调用，则第一个调用优先，其他任何调用都将被忽略。
    - 2.3.3.3.4 如果调用then引发异常e，
      - 2.3.3.3.4.1 如果resolvePromise或rejectPromise已经被调用，则忽略它。
      - 2.3.3.3.4.2 否则，拒绝promise与e作为的原因。
  - 2.3.3.4 如果then不是函数，请promise使用x。
如果使用参与循环的可循环链的可转换组件来解决承诺，从而[[Resolve]](promise, thenable)最终导致递归性质[[Resolve]](promise, thenable)被再次调用，则遵循上述算法将导致无限递归。鼓励但不是必需的实现，以检测这种递归并promise以提供信息TypeError的理由拒绝

```ts
public then(onFulfilled?: resolveFn, onRejected?: rejectFn): PromiseSf {
  // 设定默认的回调函数 2.2.1  2.2.2
  const onFulfilledFn = typeof onFulfilled == 'function' ? onFulfilled : ((value: any) => value)
  const onRejectedFn = typeof onRejected == 'function' ? onRejected : (reason: any) => { throw reason }

  const nextPromise = new PromiseSf((resolve, reject) => {
    if (this.state == PROMISE_STATE.PENDING) {
      // pendding状态不会立即执行会放到执行队列中，状态变化之后再执行
      this.onFulfilledArrayFn.push(() => {
        // 2.2.4 
        setTimeout(() => {
          try {
            let x = onFulfilledFn(this.value)
            // 2.2.7.1
            this.resolvePromise(nextPromise, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        }, 0)
      })

      this.onRejectedArrayFn.push(() => {
        setTimeout(() => {
          try {
            let x = onRejectedFn(this.reason)
            // 2.2.7.1
            this.resolvePromise(nextPromise, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        }, 0)
      })
    }

    if (this.state == PROMISE_STATE.RESOLVED) {
      setTimeout(() => {
        try {
          let x = onFulfilledFn(this.value)
          // 2.2.7.1
          this.resolvePromise(nextPromise, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      }, 0)
    }

    if (this.state == PROMISE_STATE.REJECTED) {
      setTimeout(() => {
        try {
          let x = onRejectedFn(this.reason)
          // 2.2.7.1
          this.resolvePromise(nextPromise, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      }, 0)
    }
  }
}
```

Promise Resolution Procedure [[Resolve]](promise2, x)。
```ts
private resolvePromise (nextPromise: PromiseSf, x: PromiseSf | any, resolve: resolveFn, reject: rejectFn) {
  // 2.3.1
  if (nextPromise === x) {
    reject(new TypeError('循环引用'))
  }

  // 2.3.3
  if (x && (typeof x == 'object' || typeof x == 'function')) {
    let called = false;
    // 可能是对象或者函数
    try {
      // 2.3.3.1
      const thenable = x.then
      // 2.3.3.3
      if (typeof thenable == 'function') {
        // 2.3.3.3.1
        thenable.call(x, (y: any) => {
          if (called) return
          called = true

          // resolve(r)
          this.resolvePromise(nextPromise, y, resolve, reject)
        }, (e: any) => {
          // 2.3.3.3.3.2
          if (called) return
          called = true
          reject(e)
        })
      } else {
        // 2.3.4
        resolve(x);
      }
    } catch(e) {
      // 2.3.3.2
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // 2.3.4
    resolve(x)
  }
}
```

### p.catch
catch 用于捕获promise reject 的错误状态 返回一个 reason 参数 ，同样的 catch 也会返回新的 promise，因此调用 then 函数，返回一个错误决议
```ts
public catch(catchFn: (e: any) => void) {
  return this.then(undefined, catchFn)
}
```

### p.finally
无论成功失败，都会执行 finally 回调，并且返回一个新的 promise
```ts
public finally(finallyFn: Function) {
  // 返回前一个 value 值
  return this.then((value) => {
    // console.log('value', value)
    return PromiseSf.resolve(finallyFn()).then(() => {
      return value
    })
  }, (err) => {
    return PromiseSf.resolve(finallyFn()).then(() => {
      throw err
    })
  })
}
```

### PromiseSf.resolve
静态方法，返回一个新的 已决议的 promise
```ts
PromiseSf.resolve = (value?: any): PromiseSf => {
  // value 是 promise 直接返回
  if (value instanceof PromiseSf) {
    return value
  }
  return new PromiseSf((resolve, reject) => {
    // 如果 then able
    if (value && value.then && typeof value.then == 'function') {
      setTimeout(() => {
        // 执行 then 方法
        value.then(resolve, reject)
      }, 0)
    } else {
      // 直接resolve
      resolve(value)
    }
  })
}
```

### PromiseSf.reject
返回一个 失败决议 的Promise
```ts
PromiseSf.reject = (reason: any): PromiseSf => {
  return new PromiseSf((undefined, reject) => {
    reject(reason)
  })
}
```

### PromiseSf.all
Promise数组全部成功后 resolve 一个res数组 
```ts
PromiseSf.all = (promiseLists: Array<PromiseSf | any>): PromiseSf => {
  return new PromiseSf((resolve, reject) => {
    // 记录数量
    let index = 0
    // 记录返回值数组
    let resolveArr: any[] = []
    while (promiseLists.length == 0) {
      resolve([])
      return
    }
    
    function dealWidthPromise (index: number, value: any) {
      resolveArr[index] = value
      index ++
      // 如果结束 则返回结果
      if (index == promiseLists.length) {
        resolve(resolveArr)
      }
    }

    for (let i = 0; i < promiseLists.length; i++) {
      // 处理每一个 Promise then 函数里记录数组和数量
      PromiseSf.resolve(promiseLists[i]).then((value) => {
        dealWidthPromise(i, value)
      }, (err) => {
        // 否则直接 reject 且 return
        reject(err)
        return
      })
    }
  })
}
```

### Promise.race
Promise数组中一个失败或者成功直接结束 执行resolve 或者 reject
```ts
PromiseSf.race = (promiseLists: Array<PromiseSf | any>): PromiseSf => {
  // 循环执行 resolve 
  return new PromiseSf((resovle, reject) => {
    for (let i = 0; i < promiseLists.length; i++) {
      // 成功则 resolve
      PromiseSf.resolve(promiseLists[i]).then((value) => {
        resovle(value)
        return
      }).catch((err) => {
        // 否则reject 
        reject(err)
        return
      })
    }
  })
}
```

### Promise.allSettled
所有promise执行完成之后执行，无论成功和失败，都会返回，类似 promise.all 的返回值
只是返回值有所不同
- resolve 的话 
```ts
type PromiseSettledResolve = {
  status: 'fulfilled',
  value: any;
}
```
- reject
```ts
type PromiseSettledReject = {
  status: 'rejected',
  reason: any;
}
```
返回结果是 `Array<PromiseSettledResolve | PromiseSettledReject>`

```ts
PromiseSf.allSettled = (promiseLists: Array<PromiseSf | any>): PromiseSf => {
  return new PromiseSf((resolve, reject) => {
    let index = 0
    let resolveArr: Array<PromiseSettledResolve | PromiseSettledReject> = []

    function dealWithAllSettled (type: PromiseSettledStatus, valueOrReason: any) {
      index++
      if (type == 'fulfilled') {
        resolveArr.push({
          status: type,
          value: valueOrReason
        })
      } else {
        resolveArr.push({
          status: type,
          reason: valueOrReason
        })
      }

      if (index == promiseLists.length) {
        resolve(resolveArr)
      }
    }

    for (let i = 0; i < promiseLists.length; i++) {
      PromiseSf.resolve(promiseLists[i]).then((res) => {
        dealWithAllSettled('fulfilled', res)
      }, (err) => {
        dealWithAllSettled('rejected', err)
      })
    }
  })
}
```

参考于：

[Promise a+](https://promisesaplus.com/)

[只会用？一起来手写一个合乎规范的Promise](https://www.jianshu.com/p/c633a22f9e8c)

[Promise的源码实现](https://segmentfault.com/a/1190000018428848)

[史上最最最详细的手写Promise教程](https://www.cnblogs.com/sugar-tomato/p/11353546.html)

