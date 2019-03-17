---
title: javascript异步编程
date: 2019-03-17 19:37:11
categories: javascript
tags: js
---

### 背景
js是单线程语言，浏览器只分配给js一个主线程，用来执行任务，异步编程是JavaScript的一种编程方式，用于在不影响主程序去执行其他的操作，如网络请求，文件读写，等等，如果这些操作都是同步执行的话，那么对于用户来说就是一个灾难，毕竟在执行其他操作的时候，后续的代码没法同步执行

### 异步编程的方式
使用不同方式实现🚥的操作模式
- 执行红灯操作3秒
- 之后执行绿灯操作2秒
- 最后执行黄灯1秒
- // 程序结束 //

#### 1. callback 回调
```js
function red (ms) {
  console.log('----- red start -----')
  setTimeout(function () {
    green(2000)
  }, ms)
}

function green (ms) {
  console.log('----- green start -----')
  setTimeout(function () {
    yellow(1000)
  }, ms)
}

function yellow (ms) {
  console.log('----- yellow start -----')
  setTimeout(function () {
    console.log('----- ALL DOWN -----')
  }, ms)
}

red(3000)
```
定义三种方法，第一个方法执行结束执行第二个，再执行第三个，所有的后续操作都是在setTimeout方法的回调中实现的

但是如果我要放在我本身方法的回调里呢？
```js
function red (ms, callback) {
  console.log('----- red start -----')
  setTimeout(function () {
    callback && callback()
  }, ms)
}

function green (ms, callback) {
  console.log('----- green start -----')
  setTimeout(function () {
    callback && callback()
  }, ms)
}

function yellow (ms, callback) {
  console.log('----- yellow start -----')
  setTimeout(function () {
    callback()
  }, ms)
}

red(3000, function () {
  green(2000, function () {
    yellow(1000, function () {
      console.log('----- ALL DOWN -----')
    })
  })
})
```
这种方式表现出回调方法的特性，层层嵌套，然而这也会存在我们都知道的问题，回调地狱

#### 2. 事件监听
#### 3. 发布/订阅
简单的发布订阅者模式
```js
function TestObserver () {
  this.handler = {}
}

TestObserver.prototype.on = function (eventType, handler) {
  const list = Object.keys(this.handler)
  if (!list.includes(eventType)) {
    this.handler[eventType] = []
  }
  this.handler[eventType].push(handler)
  return this
}

TestObserver.prototype.off = function (eventType, handler) {
  const offType = this.handler[eventType]
  if (offType) {
    for (let i = offType.length; i >= 0; i--) {
      if (offType[i] === handler) {
        offType.splice(i, 1)
      }
    }
  }
  return this
}

TestObserver.prototype.emit = function (eventType) {
  const handlerArgs = Array.prototype.slice.call(arguments, 1)
  const handlerType = this.handler[eventType]
  handlerType.forEach(item => {
    item.apply(this, handlerArgs)
  })
  return this
}
```
执行的时候如同第一个方式，代码量大，不以管理
```js
const obs = new TestObserver()
obs.on('red', function (ms) {
  console.log('----- red start -----')
  setTimeout(function () {
    obs.emit('green', 2000)
  }, ms)
})

obs.on('green', function (ms) {
  console.log('----- green start -----')
  setTimeout(function () {
    obs.emit('yellow', 1000)
  }, ms)
})

obs.on('yellow', function (ms) {
  console.log('----- yellow start -----')
  setTimeout(function () {
    console.log('----- ALL DOWN -----')
  }, ms)
})

obs.emit('red', 3000)
```

#### 4. 协程
Thunk + Generator
<!-- 代码未完成 -->
```js
function *toDo () {
  yield console.log('----- red start -----')
  yield console.log('----- green start -----')
  yield console.log('----- yellow start -----')
  yield console.log('----- ALL DOWN -----')
}

function Thunk (fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments)
    return function (callback) {
      args.push(callback)
      return fn.apply(this, args)
    }
  }
}

const timer = function (time, callback) {
  setTimeout(function () {
    callback && callback ()
  }, time)
}

// const light = toDo()
// const timeout = Thunk(timer)
// light.next()
// timeout(3000)(function () {
//   light.next()
// })
// timeout(3000)(function () {
//   light.next()
// })
// timeout(3000)(function () {
//   light.next()
// })
```

#### 5. Promise
es6的到来Promise是最常用的一个新功能
```js
const red = function (ms) {
  console.log('----- red start -----')
  return new Promise (resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const green = function (ms) {
  console.log('----- green start -----')
  return new Promise (resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const yellow = function (ms) {
  console.log('----- yellow start -----')
  return new Promise (resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

red(3000)
.then(() => green(2000))
.then(() => yellow(1000))
.then(() => {
  console.log('----- ALL DOWN -----')
})
```
看起来舒服多了

#### 6. async/await
es7语法
三个灯的方法定义和上面一样，返回一个promise即可
```js
async function toDo () {
  await red(3000)
  await green(2000)
  await yellow(1000)
  console.log('----- ALL DOWN -----')
}
toDo()
```

### 总结
从callback 到 事件/发布订阅 到 协程 到 Promise 再到 async/await
方法越来越简单