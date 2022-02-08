---
title: 【js高级程序】工作者线程-SharedWorker
date: 2020-11-09 08:18:18
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第27章*

### 共享工作者线程
**共享工作者线程或共享线程与专用工作者线程类似，但可以被多个可信任的执行上下文访问。** 例如， 同源的两个标签页可以访问同一个共享工作者线程。

#### 创建共享工作者线程
共享工作者线程与专用工作者线程的一个重要区别在于，虽然 Worker()构造函数始终会创建新实 例，而 SharedWorker()则只会在相同的标识不存在的情况下才创建新实例。

```js
// 实例化一个共享工作者线程
// - 全部基于同源调用构造函数
// - 所有脚本解析为相同的 URL
// - 所有线程都有相同的名称
new SharedWorker('./sharedWorker.js');
new SharedWorker('sharedWorker.js');
new SharedWorker('https://www.example.com/sharedWorker.js');
```
脚本字符串都解析到相同的 URL，所以也只会创建一个共享工作者线程

> 共享线程，顾名思义，可以在不同标签页、不同窗口、不同内嵌框架或同源的其他工作者线程之间 共享。

初始化共享线程的脚本只会限制 URL，因此下面的代码会创建两个共享工作者线程，尽管加载了相 同的脚本：
```js
// 实例化一个共享工作者线程
// - 全部基于同源调用构造函数
// - '?'导致了两个不同的 URL
// - 所有线程都有相同的名称
new SharedWorker('./sharedWorker.js');
new SharedWorker('./sharedWorker.js?');
```

#### 使用 SharedWorker 对象
SharedWorker()构造函数返回的 SharedWorker 对象被用作与新创建的共享工作者线程通信的连接点。
SharedWorker 实例化对象有以下属性
- `onerror`  错误监听
- `port` 专门用来跟共享线程通信的 MessagePort。

#### SharedWorkerGlobalScope
继承 `WorkerGlobalScope` 与专用工作者线程一样，共享工 作者线程也可以通过 self 关键字访问该全局上下文。
- `name` 可选的字符串标识符，可以传给 SharedWorker 构造函数。
- `importScripts()` 用于向工作者线程中导入任意数量的脚本。
- `close()` 与 worker.terminate()对应，用于立即终止工作者线程。没有给工作者线程提供 终止前清理的机会；脚本会突然停止。
- `onconnect` 与共享线程建立新连接时， 应将其设置为处理程序。 connect 事件包括 MessagePort 实例的 ports 数组，可用于把消息发送回父上下文。
  - 在通过 worker.port.onmessage 或 worker.port.start()与共享线程建立连接时都会触 发 connect 事件。

```js
// sharedWorker.js
self.addEventListener('connect', function ({ ports }) {
  console.info('datadatadatadata', data);
  const p = ports[0]

  p.onmessage = function (e) {
    console.info('e.data', e.data);
  }
});

// main.js
const sharedWorker = new SharedWorker('./sharedWorker.js')
const worker = sharedWorker.port;
worker.start();
worker.addEventListener('message', (e) => {
  console.log('来自sharedWorker的数据：', e.data)
}, false)
worker.postMessage({test: 123123})
```


