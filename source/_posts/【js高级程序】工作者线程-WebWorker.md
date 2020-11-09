---
title: 【js高级程序】工作者线程-WebWorker
date: 2020-11-03 07:46:06
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第27章*

### 工作者线程
#### 简介
JavaScript 环境实际上是运行在托管操作系统中的虚拟环境。在浏览器中每打开一个页面，就会分 配一个它自己的环境。这样，每个页面都有自己的内存、事件循环、DOM，等等。每个页面就相当于 一个沙盒，不会干扰其他页面。对于浏览器来说，同时管理多个环境是非常简单的，因为所有这些环境 都是并行执行的。

使用工作者线程，浏览器可以在原始页面环境之外再分配一个完全独立的二级子环境。**这个子环境 不能与依赖单线程交互的 API（如 DOM）互操作**，但可以与父环境并行执行代码。

#### 工作者线程的类型
1. 专用工作者线程
  专用工作者线程，通常简称为工作者线程、Web Worker 或 Worker，是一种实用的工具，可以让脚 本单独创建一个 JavaScript 线程，以执行委托的任务。专用工作者线程，顾名思义，只能被创建它的页 面使用。
2. 共享工作者线程
  共享工作者线程与专用工作者线程非常相似。主要区别是共享工作者线程可以被多个不同的上下文 使用，包括不同的页面。任何与创建共享工作者线程的脚本同源的脚本，都可以向共享工作者线程发送 消息或从中接收消息。
3. 服务工作者线程
  服务工作者线程与专用工作者线程和共享工作者线程截然不同。它的主要用途是拦截、重定向和修 改页面发出的请求，充当网络请求的仲裁者的角色。

#### WorkerGlobalScope
在网页上，window 对象可以向运行在其中的脚本暴露各种全局变量。在工作者线程内部，没有 window 的概念。这里的全局对象是 WorkerGlobalScope 的实例，通过 self 关键字暴露出来。

### 专用工作者线程
专用工作者线程是最简单的 Web 工作者线程，网页中的脚本可以创建专用工作者线程来执行在页面 线程之外的其他任务。

#### 专用工作者线程的基本概念
可以把专用工作者线程称为后台脚本（background script）。
```js
// testWorker.js 
// importScripts 用于加载外部脚本
importScripts('https://www.daiwei.site/web_next/_next/static/chunks/commons.8fa79bb4db1b3fbf75c8.js');

self.addEventListener('message', function (e) {
  self.postMessage('You said: ' + e.data);    // You said Hello World
}, false);

// main.js
const worker = new Worker('./testWorker.js');
worker.postMessage('Hello World');
worker.addEventListener('error', function (event) {
  console.log(event);   // 监听worker的报错信息
});
console.log('worker', worker);
```
- 文件是在后台加载的，工作者线程的初始化完全独立于 main.js
- 工作者线程本身存在于一个独立的 JavaScript 环境中，因此 main.js 必须以 Worker 对象为代理实 现与工作者线程通信。在上面的例子中，该对象被赋值给了 worker 变量。
- 虽然相应的工作者线程可能还不存在，但该 Worker 对象已在原始环境中可用了。

##### Worker 加载脚本
```js
importScripts('script1.js');

// 加载多个脚本
importScripts('script1.js', 'script2.js');
```
`importScripts()` 方法可以接收任意数量的脚本作为参数。浏览器下载它们的顺序没有限制，**但执行则会严格按照它们在参数列表的顺序进行**。

##### 错误处理
```js
worker.addEventListener('error', function (event) {
  console.log(event);   // 监听worker的报错信息
});
```

##### 关闭 Worker
```js
// 主线程
worker.terminate();

// Worker 线程
self.close();
```

##### 工作者线程安全限制
工作者线程的脚本文件只能从与父页面相同的源加载。从其他源加载工作者线程的脚本文件会导致错误。
> 不能使用非同源脚本创建工作者线程，并不影响执行其他源的脚本。在工作者线程内部，使用 importScripts()可以加载其他源的脚本。

##### worker 对象
- `onerror or dom2 event error` 该事件会在工作者线程中抛出错误时发生。
- `onmessage or dom2 event message` 主线程监听 工作者线程 postMessage数据
- `onmessageerror or dom2 event messageerror` 工作者线程发送MessageEvent 类型的错误事件时会调用指定给该属 性的处理程序。
- `postMessage()` 用于通过异步消息事件向工作者线程发送信息
- `terminate()` 用于立即终止工作者线程。没有为工作者线程提供清理的机会，脚本会突然停止。

##### DedicatedWorkerGlobalScope
继承自 WorkerGlobalScope，所以包含它的所有属性和方法。
扩展了以下属性及发方法
- `name` 可以提供给 Worker 构造函数的一个可选的字符串标识符。
- `postMessage()` 用于从工作者线程内部向父上下文发送消息。
- `close()` 与 worker.terminate()对应的方法，用于立即终止工作者线程。没有为工作者线程提供清理的机会，脚本会突然停止。
- `importScripts()`：用于向工作者线程中导入任意数量的脚本。

##### 专用工作者线程的生命周期
```js
// initializingWorker.js
self.addEventListener('message', ({data}) => console.log(data));

// main.js
const worker = new Worker('./initializingWorker.js');

// Worker 可能仍处于初始化状态
// 但 postMessage()数据可以正常处理
worker.postMessage('foo');
worker.postMessage('bar');
worker.postMessage('baz');

// foo
// bar
// baz
```
创建之后，专用工作者线程就会伴随页面的整个生命期而存在，除非自我终止`（self.close()）` 或通过外部终止`（worker.terminate()）`。即使线程脚本已运行完成，线程的环境仍会存在。只要工作者线程仍存在，与之关联的 Worker 对象就不会被当成垃圾收集掉。

自我终止和外部终止最终都会执行相同的工作者线程终止例程。
```js
// closeWorker.js
self.postMessage('foo');
self.close();
self.postMessage('bar');
setTimeout(() => self.postMessage('baz'), 0);

// main.js
const worker = new Worker('./closeWorker.js');
worker.onmessage = ({data}) => console.log(data);

// foo
// bar
```
虽然调用了 close()，但显然工作者线程的执行并没有立即终止。close() 可以理解为本轮循环的最后一个动作，也就是本轮循环之后才会关闭。

```js
// terminateWorker.js
self.onmessage = ({data}) => console.log(data);

// main.js
const worker = new Worker('./terminateWorker.js');
setTimeout(() => {
  worker.postMessage('foo');
  worker.terminate();
  worker.postMessage('bar');
  setTimeout(() => worker.postMessage('baz'), 0);
}, 1000);

// foo
```
一旦调用了 terminate()，工作者线程的消息队列就会被清理并锁住，这也是只是打印"foo"的原因。

> close()和 terminate()是幂等操作，多次调用没有问题。这两个方法仅仅是将Worker 标记为 teardown，因此多次调用不会有不好的影响。

#### 配置 Worker 选项
- `name` 可以在工作者线程中通过 self.name 读取到的字符串标识符。
- `type` 表示加载脚本的运行方式，可以是"classic"或"module"。"classic"将脚本作为常规脚本来执行，"module"将脚本作为模块来执行。
- `credentials` 在 type 为"module"时，指定如何获取与传输凭证数据相关的工作者线程模块脚本。

#### 在 JavaScript 行内创建工作者线程
工作者线程需要基于脚本文件来创建，但这并不意味着该脚本必须是远程资源。专用工作者线程也 可以通过 Blob 对象 URL 在行内脚本创建。这样可以更快速地初始化工作者线程，因为没有网络延迟。

```js
// 创建要执行的 JavaScript 代码字符串
const workerScript = ` self.onmessage = ({data}) => console.log(data); `;

// 基于脚本字符串生成 Blob 对象
const workerScriptBlob = new Blob([workerScript]);

// 基于 Blob 实例创建对象 URL
const workerScriptBlobUrl = URL.createObjectURL(workerScriptBlob);
console.log('workerScriptBlobUrl', workerScriptBlobUrl);

// 基于对象 URL 创建专用工作者线程
const worker = new Worker(workerScriptBlobUrl);

worker.postMessage('blob worker script');

// blob worker script
```

#### 委托任务到子工作者线程
```js
// main.js
const worker = new Worker('./js/worker.js');

// js/worker.js
console.log('worker');
const worker = new Worker('./subworker.js');

// js/subworker.js
console.log('subworker');

// 打印结果
// worker
// subworker
```
> 顶级工作者线程的脚本和子工作者线程的脚本都必须从与主页相同的源加载。

#### 与专用工作者线程通信
- 使用 postMessage()

```js
// testWorker.js
self.addEventListener('message', function (e) {
  self.postMessage('You said: ' + e.data);    // You said Hello World
}, false);

// main.js
const worker = new Worker('./testWorker.js');
worker.postMessage('Hello World');
```

这与在两个窗口 间传递消息非常像。主要区别是没有 targetOrigin的限制，该限制是针对 Window.prototype. postMessage 的， 对 WorkerGlobalScope.prototype.postMessage 或 Worker.prototype. postMessage 没有影响。 这样约定的原因很简单：工作者线程脚本的源被限制为主页的源，因此没有 必要再去过滤了。

- 使用 MessageChannel
```js
// main.js
// 创建 channel 实例
const channel = new MessageChannel();
const factorialWorker = new Worker('./testWorker.js');

// 把`MessagePort`对象发送到工作者线程
// 工作者线程负责处理初始化信道
factorialWorker.postMessage(null, [channel.port1]);
// port1 传入数据
channel.port2.onmessage = ({data}) => console.log('from port1', data);

// 传递给port1 data 为5
channel.port2.postMessage(5);


// testWorker.js
// 在监听器中存储全局 messagePort
let messagePort = null;

function factorial(n) {
  let result = 1;
  while(n) {
    result *= n--;
  }
  return result;
}

self.onmessage = ({ports}) => {
  if (!messagePort) {
    // 存储port[0]
    messagePort = ports[0];
    // 清除自己的 onmessage event
    self.onmessage = null;
    // channel 进行添加监听接受 port2 传入的数据信息
    messagePort.onmessage = ({data}) => {
      // 传递给port2 
      messagePort.postMessage(`${data}! = ${factorial(data)}`);
    }
  }
}

// result: from port1 5! = 120
```

#### BroadcastChannel
**同源脚本**能够通过 BroadcastChannel 相互之间发送和接收消息。这种通道类型的设置比较简单， 不需要像 MessageChannel 那样转移乱糟糟的端口。
```js
// ./testWorker.js
const channel = new BroadcastChannel('worker_channel');
channel.addEventListener('message', (res) => {
  console.log(`heard ${res.data} in worker`)
  channel.postMessage('bar')
});


// main.js
const channel = new BroadcastChannel('worker_channel');
const worker = new Worker('./testWorker.js');

channel.onmessage = ({data}) => {
  console.log(`heard ${data} on page`)
}

setTimeout(() => channel.postMessage('foo'), 1000);

// testWorker.js:26 heard foo in worker
// index.tsx:167 heard bar on page
```
> 这里，页面在通过 BroadcastChannel 发送消息之前会先等 1 秒钟。因为这种信道没有端口所有权的概念，所以如果没有实体监听这个信道，广播的消息就不会有人处理。在这种情况下，如果没有 setTimeout()，则由于初始化工作者线程的延迟，就会导致消息已经发送了，但工作者线程上的消息 处理程序还没有就位。


[Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)


