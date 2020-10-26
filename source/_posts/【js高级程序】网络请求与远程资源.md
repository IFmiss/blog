---
title: 【js高级程序】网络请求与远程资源
date: 2020-10-26 07:43:52
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第24章*

### 网络请求与远程资源
2005 年，Jesse James Garrett 撰写了一篇文章，“Ajax—A New Approach to Web Applications”。这篇 文章中描绘了一个被他称作 Ajax（Asynchronous JavaScript+XML，即异步 JavaScript 加 XML）的技术。 这个技术涉及发送服务器请求额外数据而不刷新页面，从而实现更好的用户体验。

把 Ajax 推到历史舞台上的关键技术是 XMLHttpRequest（XHR）对象。

### XMLHttpRequest 对象
所有现代浏览器都通过 XMLHttpRequest 构造函数原生支持 XHR 对象：
```js
const xhr = new XMLHttpRequest();
```

#### 使用 XHR
##### 调用 open()方法，这个方法接收 3 个参数：请求类型（"get"、"post"等 请求 URL，以及表示请求是否异步的布尔值。
```js
xhr.open("get", "example.php", false);
```
> 这里的 URL 是相对于代码所在页面的，当然也可以使用绝对 URL。其次，调用 open()不会实际发送请 求，只是为发送请求做好准备。

##### send()方法接收一个参数，是作为请求体发送的数据。
如果不需要发送请求体，则必须传 null， 因为这个参数在某些浏览器中是必需的。调用 send()之后，请求就会发送到服务器。
```js
xhr.open("get", "example.txt", false);
xhr.send(null);
```

因为这个请求是同步的，所以 JavaScript 代码会等待服务器响应之后再继续执行。收到响应后，XHR 对象的以下属性会被填充上数据。

- `responseText` 作为响应体返回的文本。
- `responseXML` 如果响应的内容类型是"text/xml"或"application/xml"，那就是包含响应 数据的 XML DOM 文档。
- `status` http状态
- `statusText` http 状态描述

收到响应后，第一步要检查 status 属性以确保响应成功返回。一般来说，HTTP 状态码为 2xx 表 示成功。此时，responseText 或 responseXML（如果内容类型正确）属性中会有内容。如果 HTTP 状态码是 304，则表示资源未修改过，是从浏览器缓存中直接拿取的。当然这也意味着响应有效。

```js
xhr.open("get", "example.txt", false);
xhr.send(null);

if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
  alert(xhr.responseText);
} else {
  alert("Request was unsuccessful: " + xhr.status);
}
```

> 虽然可以像前面的例子一样发送同步请求， 但多数情况下最好使用异步请求， 这样可以不阻塞 JavaScript 代码继续执行。XHR 对象有一个 `readyState` 属性，表示当前处在请求/响应过程的哪个阶段。

`readyState` 有如下可能的值
- 0  未初始化（Uninitialized）。尚未调用 open()方法。
- 1  已打开（Open）。已调用 open()方法，尚未调用 send()方法。
- 2  已发送（Sent）。已调用 send()方法，尚未收到响应。
- 3  接收中（Receiving）。已经收到部分响应。
- 4  完成（Complete）。已经收到所有响应，可以使用了。

```js
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText);
    } else {
      alert("Request was unsuccessful: " + xhr.status);
    }
  }
};
xhr.open("get", "example.txt", true);
xhr.send(null);
```
在收到响应之前如果想取消异步请求，可以调用 abort()方法：
```js
xhr.abort();
```

##### HTTP 头部
每个 HTTP 请求和响应都会携带一些头部字段，这些字段可能对开发者有用。XHR 对象会通过一些方法暴露与请求和响应相关的头部字段。
默认情况下，XHR 请求会发送以下头部字段。
- `Accept` 浏览器可以处理的内容类型。
- `Accept-Charset` 浏览器可以显示的字符集。
- `Accept-Encoding` 浏览器可以处理的压缩编码类型。
- `Accept-Language` 浏览器使用的语言。
- `Connection` 浏览器与服务器的连接类型。
- `Cookie` 页面中设置的 Cookie。
- `Host` 发送请求的页面所在的域。
- `Referer` 发送请求的页面的 URI。注意，这个字段在 HTTP 规范中就拼错了，所以考虑到兼容 性也必须将错就错。（正确的拼写应该是 Referrer。）
- `User-Agent` 浏览器的用户代理字符串。

通过 `setRequestHeader` 添加请求头
> 必须在 open()之后、send()之前调用 setRequestHeader()

通过 `getResponseHeader` 从XHR 对象获取响应头, `getAllResponseHeaders` 获取所有响应头部的字符串
```js
let myHeader = xhr.getResponseHeader("MyHeader");
let allHeaders = xhr.getAllResponseHeaders();
```

> POST 请求相比 GET 请求要占用更多资源。从性能方面说，发送相同数量的数据，GET 请求比 POST 请求要快两倍。

##### XMLHttpRequest Level 2
1. 新增 `FormData` 类型

2. 超时 处理
在给 timeout 属性设置了一个 时间且在该时间过后没有收到响应时，XHR 对象就会触发 timeout 事件，调用 ontimeout 事件处理 程序。

3. `overrideMimeType` 用于重写 XHR 响应的 MIME 类型
```js
let xhr = new XMLHttpRequest();
xhr.open("get", "text.php", true);
xhr.overrideMimeType("text/xml");
xhr.send(null)
```
这个例子强制让 XHR 把响应当成 XML 而不是纯文本来处理。为了正确覆盖响应的 MIME 类型， 必须在调用 send()之前调用 overrideMimeType()。

#### 进度事件
Progress Events 是 W3C 的工作草案，定义了客户端服务器端通信。这些事件最初只针对 XHR，现 在也推广到了其他类似的 API。有以下 6 个进度相关的事件。
- `loadstart` 在接收到响应的第一个字节时触发。
- `progress` 在接收响应期间反复触发。
- `error` 在请求出错时触发。
- `abort` 在调用 abort()终止连接时触发。
- `load` 在成功接收完响应时触发。
- `loadend` 在通信完成时，且在 error、abort 或 load 之后触发。

> load 事件在响应接收完成后立即触发，这样就不用检查 readyState 属性 了。onload 事件处理程序会收到一个 event 对象，其 target 属性设置为 XHR 实例，在这个实例上 可以访问所有 XHR 对象属性和方法。不过，并不是所有浏览器都实现了这个事件的 event 对象。考虑 到跨浏览器兼容，还是需要像下面这样使用 XHR 对象变量

> onprogress 事件处理程序都会收到 event 对象，其 target 属性是 XHR 对象，且 包含 3 个额外属性：lengthComputable、position 和 totalSize。其中，lengthComputable 是 一个布尔值，表示进度信息是否可用；position 是接收到的字节数；totalSize 是响应的 ContentLength 头部定义的总字节数。有了这些信息，就可以给用户提供进度条了。

#### 跨源资源共享 CORS
通过 XHR 进行 Ajax 通信的一个主要限制是跨源安全策略。默认情况下，XHR 只能访问与发起请 求的页面在同一个域内的资源。这个安全限制可以防止某些恶意行为。不过，浏览器也需要支持合法跨 源访问的能力。

跨源资源共享（CORS，Cross-Origin Resource Sharing）定义了浏览器与服务器如何实现跨源通信。

对于简单的请求，比如 GET 或 POST 请求，没有自定义头部，而且请求体是 text/plain 类型， 这样的请求在发送时会有一个额外的头部叫 Origin。

```http
Origin: http://www.nczonline.net
```

> `简单请求`
> `非简单请求`



