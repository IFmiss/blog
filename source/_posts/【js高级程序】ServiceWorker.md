---
title: 【js高级程序】ServiceWorker
date: 2020-11-10 08:08:54
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第27章*

### 服务工作者线程
- 服务工作者线程是一种类似浏览器中代理服务器的线程，可以拦截外出请求和缓存响应
- 可以让网页在没有网络连接的情况下正常使用，因为部分或全部页面可以从服务工作者线程缓存中提供服务。
- 也可以使用 Notifications API、Push API、Background Sync API 和 Channel Messaging API。

> 与共享工作者线程类似，**来自一个域的多个页面共享一个服务工作者线程**。不过，为了使用 Push API 等特性，服务工作者线程也可以在相关的标签页或浏览器关闭后继续等待到来的推送事件。

#### ServiceWorkerContainer
服务工作者线程与专用工作者线程或共享工作者线程的一个区别是没有全局构造函数。服务工作者 线程是通过 ServiceWorkerContainer 来管理的，它的实例保存在 navigator.serviceWorker属性中。
```js
console.info(navigator.serviceWorker));
// ServiceWorkerContainer {controller: null, ready: Promise, oncontrollerchange: null, onmessage: null, onmessageerror: null}
```

#### 创建服务工作者线程
ServiceWorkerContainer 没有通过全局构造函数创建，而是暴露了 register()方法，该方法 以与 Worker()或 SharedWorker()构造函数相同的方式传递脚本 URL：
```js
// emptyServiceWorker.js
// 空服务脚本

// main.js
navigator.serviceWorker.register('./emptyServiceWorker.js')
  .then(console.log, console.error);
```
register()方法返回一个期约，该期约解决为 ServiceWorkerRegistration 对象，或在注册 失败时拒绝。

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./serviceWorker.js');
  });
}
```
> 如果没有 load 事件这个门槛，服务工作者线程的注册就会与页面资源的加载重叠，进而拖慢初始页面渲染的过程。

#### 使用 ServiceWorkerContainer 对象
事件
- `oncontrollerchange` 此事件在获得新激活的 ServiceWorkerRegistration 时触发。
- `onerror` 此事件在关联的服务工作者线程内部抛出错误时触发。
- `onmessage` 此事件在服务脚本向父上下文发送消息时触发。

属性
- `ready` 返回期约，解决为激活的 ServiceWorkerRegistration 对象。该期约不会拒绝。
- `controller` 返回与当前页面关联的激活的 ServiceWorker 对象，如果没有激活的服务工作 者线程则返回 null。

方法
- `register()` 使用接收的 url 和 options 对象创建或更新 ServiceWorkerRegistration。
- `getRegistration()` 返回期约，解决为与提供的作用域匹配的 ServiceWorkerRegistration对象；如果没有匹配的服务工作者线程则返回 undefined。
- `getRegistrations()` 返回期约，解决为与 ServiceWorkerContainer 关联的 Service-WorkerRegistration 对象的数组；如果没有关联的服务工作者线程则返回空数组。
- `startMessage()` 开始传送通过 Client.postMessage()派发的消息。

#### 使用 ServiceWorkerRegistration 对象
ServiceWorkerRegistration 对象表示注册成功的服务工作者线程。该对象可以在 register()返回的解决期约的处理程序中访问到。
```js
navigator.serviceWorker.register('./serviceWorker.js')
  .then((registrationA) => {
    console.log(registrationA);  // ServiceWorkerRegistration
    
    navigator.serviceWorker.register('./serviceWorker2.js')
      .then((registrationB) => {
        console.log(registrationA === registrationB);
      });
  });
```
ServiceWorkerRegistration支持事件处理程序: 
- `onupdatefound` 此事件会在服务工作者线程开始安装新版本时触发，表现为 ServiceWorkerRegistration.installing 收到一个新的服务工作者线程。

支持以下通用属性
- `scope` 返回服务工作者线程作用域的完整 URL 路径。 该值源自接收服务脚本的路径和在 register()中提供的作用域。
- `navigationPreload` 返回与注册对象关联的 NavigationPreloadManager 实例。
- `pushManager` 返回与注册对象关联的 pushManager 实例。

以下属性可用于判断服务工作者线程处于生命周期的什 么阶段。
- `installing` 如果有则返回状态为 installing（安装）的服务工作者线程，否则为 null。
- `waiting` waiting 等待 状态 其他同上
- `active` activating 或 active（活动）的服务工作者线程 其他同上

#### 使用 ServiceWorker 对象
ServiceWorker 对象可以通过两种方式获得：通过 ServiceWorkerContainer 对象的 controller 属性和通过 ServiceWorkerRegistration 的 active 属性。

ServiceWorker 支持以下事件处理程序。
- `onstatechange` 此事件会在 ServiceWorker.state 变化时发生。
- `scriptURL` 解析后注册服务工作者线程的 URL。
- `state` 表示服务工作者线程状态的字符串
  - installing
  - installed
  - activating 激活中
  - activated  已激活
  - redundant

#### ServiceWorkerGlobalScope
在服务工作者线程内部，全局上下文是 ServiceWorkerGlobalScope 的实例。
服务工作者线程可以通 过 self 关键字访问该全局上下文。
```js
self.caches;
self.skipWaiting();
```
- `caches` 返回服务工作者线程的 CacheStorage 对象
- `clients` 返回服务工作者线程的 Clients 接口，用于访问底层 Client 对象
- `registration` 返回服务工作者线程的 ServiceWorkerRegistration 对象。
- `skipWaiting()` 强制服务工作者线程进入活动状态；需要跟 Clients.claim()一起使用。
- `fetch()` 在服务工作者线程内发送常规网络请求；用于在服务工作者线程确定有必要发送实 际网络请求（而不是返回缓存值）时

#### event
- `install` 在服务工作者线程进入安装状态时触发, 这是服务工作者线程接收的第一个事件，在线程一开始执行时就会触发。
- `activate` 在服务工作者线程进入激活或已激活状态时触发
- `fetch` 在服务工作者线程截获来自主页面的 fetch()请求时触发。服务工作者线程的 fetch 事件处理程序可以访问 FetchEvent，可以根据需要调整输出。
- `message` 在服务工作者线程通过 postMesssage()获取数据时触发。也可以在 self.onmessage 属性上指定该事件的处理程序。
- `notificationclick` 在系统告诉浏览器用户点击了 ServiceWorkerRegistration.showNotification()生成的通知时触发。
- `notificationclose` 在系统告诉浏览器用户关闭或取消显示了 ServiceWorkerRegistration.showNotification()生成的通知时触发。
- `push` 在服务工作者线程接收到推送消息时触发。
- `pushsubscriptionchange` 在应用控制外的因素（非 JavaScript 显式操作）导致推送订阅状态变化时触发。

#### 服务工作者线程作用域限制
**服务工作者线程只能拦截其作用域内的客户端发送的请求。**
根目录
```js
navigator.serviceWorker.register('/serviceWorker.js', {
  scope: './' // 根目录
}).then((serviceWorkerRegistration) => {
  console.log(serviceWorkerRegistration.scope);
  // https://example.com/
});

// 以下请求都会被拦截：
// fetch('/foo.js');
// fetch('/foo/fooScript.js');
// fetch('/baz/bazScript.js');
```

子目录
```js
navigator.serviceWorker.register('/serviceWorker.js', {
  scope: './foo' // 根目录
}).then((serviceWorkerRegistration) => {
  console.log(serviceWorkerRegistration.scope);
  // https://example.com/
});
// 以下请求都会被拦截：
// fetch('/foo/fooScript.js');

// 以下不会被拦截
// fetch('/foo.js');
// fetch('/baz/bazScript.js');
```

#### 服务工作者线程缓存
**服务工作者线程缓存不自动缓存任何请求。**所有缓存都必须明确指定。
**服务工作者线程缓存没有到期失效的概念。**除非明确删除，否则缓存内容一直有效。
**服务工作者线程缓存必须手动更新和删除。**
**缓存版本必须手动管理。**每次服务工作者线程更新，新服务工作者线程负责提供新的缓存键以 保存新缓存。
**唯一的浏览器强制逐出策略基于服务工作者线程缓存占用的空间。**服务工作者线程负责管理自 己缓存占用的空间。缓存超过浏览器限制时，浏览器会基于最近最少使用（LRU，Least Recently Used）原则为新缓存腾出空间。

##### CacheStorage
CacheStorage 对象是映射到 Cache 对象的字符串键/值存储。CacheStorage 提供的 API 类似于 异步 Map。CacheStorage 的接口通过全局对象的 caches 属性暴露出来。
- caches.open(str) 获取缓存的对应 key 的value信息，没有会新创建
- has(str)  检查缓存 str 是否存在
- delete  删除缓存
- keys   keys的集合
**全部返回 Promise**

```js
caches.open(CACHE_NAME)
.then((cache) => {
  cache.put(event.request, cloneRes)
})
```
- `put(request, response)` 在键（Request 对象或 URL 字符串）和值（Response 对象）
 同时存在时用于添加缓存项。该方法返回期约，在添加成功后会解决。
- `add(request)` 在只有 Request 对象或 URL 时使用此方法发送 fetch()请求，并缓存响应。该方法返回期约，期约在添加成功后会解决。
- `addAll(requests)` 在希望填充全部缓存时使用，比如在服务工作者线程初始化时也初始化缓存。
> 与 Map 类似，Cache 也有 delete()和 keys()方法。这些方法与 Map 上对应方法类似，但都基于期约

检索cache 可以使用以下方法
- `matchAll(request, options)` 
返回期约，期约解决为匹配缓存中 Response 对象的数组。此方法对结构类似的缓存执行批量操作，比如删除所有缓存在/images 目录下的值。

- `match(request, options)`
返回期约，期约解决为匹配缓存中的Response对象，如果没命中缓存则返回。

options 对象的参数
- `cacheName`: 只有 CacheStorage.matchAll()支持。设置为字符串时，只会匹配 Cache 键为指定字符串的缓存值
- `ignoreSearch`：设置为 true 时，在匹配 URL 时忽略查询字符串，包括请求查询和缓存键。例如，https://example.com?foo=bar 会匹配 https://example.com
- `ignoreMethod`：设置为 true 时，在匹配 URL 时忽略请求查询的 HTTP 方法。比如下面的例子展示了 POST 请求匹配 GET 请求：

```js
const request1 = new Request('https://www.foo.com'); 
const response1 = new Response('fooResponse');

const postRequest1 = new Request('https://www.foo.com', {
  method: 'POST'
});
caches.open('v1')
.then((cache) => {
  cache.put(request1, response1)
    .then(() => cache.match(postRequest1))
    .then(console.log) // undefined
    .then(() => cache.match(postRequest1, {
      ignoreMethod: true
    }))
    .then(console.log); // Response {}
});
// 忽略请求方式成功
```
- `ignoreVary`：匹配的时候考虑 HTTP 的 Vary 头部，该头部指定哪个请求头部导致服务器响应不同的值。ignoreVary 设置为 true 时，在匹配 URL 时忽略 Vary 头部。

##### 最大存储空间
浏览器需要限制缓存占用的磁盘空间，否则无限制存储势必会造成滥用。该存储空间的限制没有任 何规范定义，完全由浏览器供应商的个人喜好决定。
```js
navigator.storage.estimate().then(console.log);
// {
//   quota: 150411345100
//   usage: 0
//   usageDetails: {}
// }
```

#### 理解服务工作者线程的生命周期
1. 已解析（parsed）
调用 navigator.serviceWorker.register()会启动创建服务工作者线程实例的过程。
浏览器获取脚本文件，然后执行一些初始化任务，服务工作者线程的生命周期就开始了。
(1) 确保服务脚本来自相同的源。
(2) 确保在安全上下文中注册服务工作者线程。
(3) 确保服务脚本可以被浏览器 JavaScript 解释器成功解析而不会抛出任何错误。
(4) 捕获服务脚本的快照。下一次浏览器下载到服务脚本，会与这个快照对比差异，并据此决定是 否应该更新服务工作者线程。
2. 安装中（installing）
安装中状态频繁用于填充服务工作者线程的缓存。
3. 已安装（installed）
已安装状态也称为等待中（waiting）状态，意思是服务工作者线程此时没有别的事件要做，只是准 备在得到许可的时候去控制客户端。如果没有活动的服务工作者线程，则新安装的服务工作者线程会跳 到这个状态，并直接进入激活中状态，因为没有必要再等了。
4. 激活中（activating）
激活中状态表示服务工作者线程已经被浏览器选中即将变成可以控制页面的服务工作者线程。
5. 已激活（activated）
已激活状态表示服务工作者线程正在控制一个或多个客户端。
6. 已失效（redundant）
已失效状态表示服务工作者线程已被宣布死亡。不会再有事件发送给它，浏览器随时可能销毁它并 回收它的资源。


#### 通过 updateViaCache 管理服务文件缓存
为了让客户端能控制自己的更新行为，可以通过 updateViaCache 属性设置客户端对待服 务脚本的方式。该属性可以在注册服务工作者线程时定义，可以是如下三个字符串值。
- `imports` 默认值。顶级服务脚本永远不会被缓存，但通过 importScripts()在服务工作者线 程内部导入的文件会按照 Cache-Control 头部设置纳入 HTTP 缓存管理
- `all` 服务脚本没有任何特殊待遇。所有文件都会按照 Cache-Control 头部设置纳入 HTTP 缓 存管理。
- `none` 顶级服务脚本和通过 importScripts()在服务工作者线程内部导入的文件永远都不会被缓存。
```js
navigator.serviceWorker.register('/serviceWorker.js', {
  updateViaCache: 'none'
});
```

#### 服务工作者线程消息
与专用工作者线程和共享工作者线程一样，服务工作者线程也能与客户端通过 postMessage()交 换消息。

#### 拦截 fetch 事件
##### 从网络返回
这个策略就是简单地转发 fetch 事件。
```js
self.onfetch = (fetchEvent) => {
  fetchEvent.respondWith(fetch(fetchEvent.request));
};
```

##### 从缓存返回
这个策略其实就是缓存检查。
```js
self.onfetch = (fetchEvent) => {
  fetchEvent.respondWith(caches.match(fetchEvent.request));
};
```

##### 从网络返回，缓存作后备
这个策略把从网络获取最新的数据作为首选，但如果缓存中有值也会返回缓存的值。如果应用程序 需要尽可能展示最新数据，但在离线的情况下仍要展示一些信息，就可以采用该策略
```js
self.onfetch = (fetchEvent) => {
  fetchEvent.respondWith(
    fetch(fetchEvent.request)
    .catch(() => caches.match(fetchEvent.request))
  );
};
```

##### 从缓存返回，网络作后备
这个策略优先考虑响应速度，但仍会在没有缓存的情况下发送网络请求。这是大多数渐进式 Web 应用程序（PWA，Progressive Web Application）采取的首选策略
```js
self.onfetch = (fetchEvent) => {
  fetchEvent.respondWith(caches.match(fetchEvent.request)
    .then((response) => response || fetch(fetchEvent.request))
  );
};
```

##### 通用后备
应用程序需要考虑缓存和网络都不可用的情况。服务工作者线程可以在安装时缓存后备资源，然后 在缓存和网络都失败时返回它们：
```js
self.onfetch = (fetchEvent) => {
  fetchEvent.respondWith( // 开始执行“从缓存返回，以网络为后备”策略
    caches.match(fetchEvent.request)
    .then((response) => response || fetch(fetchEvent.request))
    .catch(() => caches.match('/fallback.html'))
  );
};
```

#### 推送通知
