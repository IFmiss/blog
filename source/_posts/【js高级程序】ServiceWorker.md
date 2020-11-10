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



