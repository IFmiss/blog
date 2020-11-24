---
title: 【js高级程序】BOM
date: 2020-11-22 20:38:37
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第12章*

### window 对象
BOM 的核心是 window 对象，表示浏览器的实例。
window 对象在浏览器中有两重身份
- 一个是 ECMAScript 中的 Global 对象
- 另一个就是浏览器窗口的 JavaScript 接口

#### Global 作用域
因为 window 对象被复用为 ECMAScript 的 Global 对象，所**以通过 var 声明的所有全局变量和函 数都会变成 window 对象的属性和方法**。

#### 窗口关系
- top 对象始终指向最上层（最外层）窗口，即浏览器窗口本身。
- parent 对象则始终指向当前窗 口的父窗口。如果当前窗口是最上层窗口，则 parent 等于 top（都等于 window）。
- 还有一个 self 对象，它是终极 window 属性，始终会指向 window。实际上，self 和 window 就 是同一个对象。之所以还要暴露 self，就是为了和 top、parent 保持一致。

#### 窗口位置与像素比
现代浏览器提供了 screenLeft 和 screenTop 属性，用于表示窗口相对于屏幕左侧和顶部的位置 ，返回值的单位是 CSS 像素。
可以使用 moveTo()和 moveBy()方法移动窗口

#### 窗口大小
所有现代浏览器都支持 4 个属性： innerWidth、innerHeight、outerWidth 和 outerHeight。
> outerWidth 和 outerHeight 返回浏 览器窗口自身的大小（不管是在最外层 window 上使用，还是在窗格 frame 中使用）。
> innerWidth 和 innerHeight 返回浏览器窗口中页面视口的大小（不包含浏览器边框和工具栏）。

`document.documentElement.clientWidth` 和 `document.documentElement.clientHeight` 返回页面视口的宽度和高度。

#### 视口位置
使用 scroll()、scrollTo()和 scrollBy()方法滚动页面
```js
// 相对于当前视口向下滚动 100 像素
window.scrollBy(0, 100);

// 滚动到页面左上角
window.scrollTo(0, 0);
```
这几个方法也都接收一个 ScrollToOptions 字典，除了提供偏移值，还可以通过 behavior 属性 告诉浏览器是否平滑滚动。
```js
// 平滑滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'smooth'
});
```

#### 导航与打开新窗口
window.open()方法可以用于导航到指定 URL，也可以用于打开新浏览器窗口。这个方法接收 4 个参数：要加载的 URL、目标窗口、特性字符串和表示新窗口在浏览器历史记录中是否替代当前加载页 面的布尔值。
```js
// 与<a href="http://www.wrox.com" target="topFrame"/>相同
window.open("http://www.wrox.com/", "topFrame");
```
> 第二个参数也可以是一个特殊的窗口名，比如_self、 _parent、_top 或_blank。

**1. 弹出窗口**
如果 window.open()的第二个参数不是已有窗口，则会打开一个新窗口或标签页。
- 特性字符串 (只显示常用的)
  |  设置    |  值   |  值   |
  |  ----   | ----  | ----  |
  | height  | 数值 | 新窗口高度。这个值不能小于 100   |
  | left    | 数值 | 新窗口的 x 轴坐标。不能是负值  |
  | location| 数值 | 表示是否显示地址栏。  |
  | left    | "yes"或"no" | 新窗口的 x 轴坐标。不能是负值  |
  | Menubar | "yes"或"no" | 是否显示菜单栏。 |
  | resizable | "yes"或"no" |表示是否可以拖动改变新窗口大小。|
  | scrollbars |"yes"或"no"|是否可以在内容过长时滚动。|
  | status | "yes"或"no" | 表示是否显示状态栏。|
  | top | 数值 | 新窗口的 y 轴坐标。|
  | toolbar | "yes"或"no" | 表示是否显示工具栏。|
  | width | 数值 | 新窗口的宽度。这个值不能小于 100 |

  > 这些设置需要以逗号分隔的名值对形式出现，其中名值对以等号连接。（特性字符串中不能包含空 格。）
  ```js
    window.open("http://www.wrox.com/",
      "wroxWindow",
      "height=400,width=400,top=10,left=10,resizable=yes");
  ```
还可以使用 close()方法像这样关闭新打开的窗口：
```js
const fr = window.open("http://www.wrox.com/");
fr.resizeTo(500, 500);
fr.moveTo(100, 100);
fr.close();
```
**2. 安全限制**
弹出窗口有段时间被在线广告用滥了。很多在线广告会把弹出窗口伪装成系统对话框，诱导用户点击。
浏览器会在用户操作下才允许创建弹窗。在网页加载过程中调用 window.open()没有效果， 而且还可能导致向用户显示错误。弹窗通常可能在鼠标点击或按下键盘中某个键的情况下才能打开。

#### 定时器
- setTimeout()用于指定在一定时间后执行某些代码
- setInterval()用于指定 每隔一段时间执行某些代码
第二个参数是要等待的毫秒数，而不是要执行代码的确切时间。
  > setTimeout()的第二个参数只是告诉 JavaScript 引擎在指定的毫秒数过后 把任务添加到这个队列。如果队列是空的，则会立即执行该代码。如果队列不是空的，则代码必须等待 前面的任务执行完才能执行。
```js
// 设置超时任务
let timeoutId = setTimeout(() => alert("Hello world!"), 1000);

// 取消超时任务
clearTimeout(timeoutId);
```

#### 系统对话框
`alert()` 接收一个参数。如果传给 alert()的参数 不是一个原始字符串，则会调用这个值的 toString()方法将其转换为字符串。

`confirm()` 确认框，有两个按钮：“Cancel”（取消）和“OK”（确定）。
```js
if (confirm("Are you sure?")) {
  alert("I'm so glad you're sure!");
} else {
  alert("I'm sorry to hear you're not sure.");
}
```

`prompt()`  除了 OK 和 Cancel 按钮，提示框还会显示一个文本框，让用户输入内容。
```js
let result = prompt("What is your name? ", ""); 
if (result !== null) {
  alert("Welcome, " + result);
}
```

JavaScript 还可以显示另外两种对话框：find()和 print()。
```js
// 显示打印对话框
window.print();

// 显示查找对话框
window.find();
```

### location 对象
location 是最有用的 BOM 对象之一，提供了当前窗口中加载文档的信息，以及通常的导航功能

#### 查询字符串
`location.search`  返回了从问号开始直到 URL 末尾的所有内容

##### URLSearchParams
`URLSearchParams` 提供了一组标准 API 方法， 通过它们可以检查和修改查询字符串
```js
let qs = "?q=javascript&num=10";
let searchParams = new URLSearchParams(qs);

console.info(searchParams.toString()); // "q=javascript&num=10"
searchParams.has('q');   // true
searchParams.get('q');   // javascript

searchParams.set('page', 3);
console.info(searchParams.toString());  // q=javascript&num=10&page=3

searchParams.delete("q");
console.info(searchParams.toString());  // num=10&page=3
```

#### 操作地址
通过修改 location 对象修改浏览器的地址。
`assign(url)`
```js
location.assign("http://www.wrox.com");
```
这行代码会立即启动导航到新 URL 的操作， 同时在浏览器历史记录中增加一条记录。

> 如果给 location.href 或 window.location 设置一个 URL，也会以同一个 URL 值调用 assign()方法。

**修改 location 对象的属性也会修改当前加载的页面。其中，hash、search、hostname、pathname 和 port 属性被设置为新值之后都会修改当前 URL**
```js
// 假设当前 URL 为 http://www.wrox.com/WileyCDA/

// 把 URL 修改为 http://www.wrox.com/WileyCDA/#section1
location.hash = "#section1";

// 把 URL 修改为 http://www.wrox.com/WileyCDA/?q=javascript
location.search = "?q=javascript";

// 把 URL 修改为 http://www.somewhere.com/WileyCDA/ 
location.hostname = "www.somewhere.com";

// 把 URL 修改为 http://www.somewhere.com/mydir/ 
location.pathname = "mydir";

// 把 URL 修改为 http://www.somewhere.com:8080/WileyCDA/
location.port = 8080;
```
> 除了 hash 之外，只要修改 location 的一个属性，就会导致页面重新加载新 URL。修改 hash 的值会在浏览器历史中增加一条新记录。

如果不希望增加历史记录，可以使用 replace()方法。
```js
location.replace("https://daiwei.site/");
```

最后一个修改地址的方法是 `reload()`
- 不传入参数，如果页面自上次请求以来没有修改过，浏览器可能会 从缓存中加载页面。
- 传入参数 强制从服务器重新加载 `reload(true)`
  ```js
  location.reload();
  location.reload(true);
  ```

#### navigator 对象
现在已经成为客户端标识浏览器的标准。只要浏览器启用 JavaScript，navigator 对象就一定存在。
下表列出了这些接口定义的属性和方法：
=> 具体见 JavaScript高级程序 375 页

### 检测插件
检测浏览器是否安装了某个插件是开发中常见的需求。除 IE10 及更低版本外的浏览器，都可以通 过 plugins 数组来确定。
每个数组包含以下属性
- `name`: 名称
- `description`: 介绍
- `filename`: 文件名
- `length`: 由当前插件处理的 MIME 类型数量。

### 注册处理程序
`registerProtocolHandler()` 方法用于注册为某种特定类型信息应用程序
```js
navigator.registerProtocolHandler(
  "mailto",  // 处理的协议（如"mailto"或 "ftp"）、
  "http://www.somemailclient.com?cmd=%s", // 负责处理请求的 URL，%s 表示原始的请求
  "Some Mail Client"  // 应用名称
);
```

### screen 对象
这个对 象中保存的纯粹是客户端能力信息，也就是浏览器窗口外面的客户端显示器的信息，比如像素宽度和像 素高度。
|  属性 | 说明 |
| ---- | ---- |
| availHeight | 屏幕像素高度减去系统组件高度（只读）|
| availLeft | 没有被系统组件占用的屏幕的最左侧像素（只读）|
| availTop | 没有被系统组件占用的屏幕的最顶端像素（只读）|
| availWidth | 屏幕像素宽度减去系统组件宽度（只读）|
| colorDepth | 表示屏幕颜色的位数；多数系统是 32（只读）|
| height | 屏幕像素高度|
| left | 当前屏幕左边的像素距离|
| pixelDepth | 屏幕的位深（只读）|
| top | 当前屏幕顶端的像素距离 |
| width | 屏幕像素宽度 |
| orientation | 返回 Screen Orientation API 中屏幕的朝向 |

### history 对象
表示当前窗口首次使用以来用户的导航历史记录。

#### 导航 `go()`
`go()` 方法可以在用户历史记录中沿任何方向导航，可以前进也可以后退。
这个参数可以是一个整数，**表示前进或后退多少步**。负值表示在历史记录中后退（类似点击浏览器的“后 退”按钮），而正值表示在历史记录中前进（类似点击浏览器的“前进”按钮）。

`go()` 有两个简写方法：`back()`和 `forward()`。顾名思义，这两个方法模拟了浏览器的后退按钮和 前进按钮
```js
// 后退一页
history.back();

// 前进一页
history.forward();
```

history 对象还有一个 length 属性，表示历史记录中有多个条目。
对于窗口或标签页中加载的第一个页面，history.length 等于 1。
```js
if (history.length == 1){
  // 这是用户窗口中的第一个页面
}
```

**history 对象通常被用于创建“后退”和“前进”按钮，以及确定页面是不是用户历史记录中的第 一条记录。**

> 对于 2009 年以来发布的主流浏览器，这包括改变 URL 的散列值（因此，把 location.hash 设置为一个新值会在这些浏览器的历史记录中增加一条记录）。这个行为常被单页应用程序框架用来模拟前进和后退，这样做是为了不会因导航而触发页面刷新。

#### 历史状态管理
`hashchange`  会在页面 URL 的散列变化时被触发，开发者可以在此时执行某些操作。
`history.pushState()`。这个方法接收 3 个参数：一个 state 对象、一个新状态的标题和一个（可选的）相对 URL。因为 pushState()会创建新的历史记录，所以也会相应地启用“后退”按钮。此时单击“后退” 按钮，就会触发 window 对象上的 `popstate` 事件。
```js
let stateObject = {foo:"bar"};
history.pushState(stateObject, "My title", "baz.html");
```
`popstate` 单击后退按钮或调用history.go(), back, forward方法

history.state 获取当前的状态对象(`{foo:"bar"}`)， 也可以使用 replaceState() 并传入与 pushState()同样的前两个参数来更新状态。**更新状态不会创建新历史记录，只会覆盖当前状态**：
```js
history.replaceState({newFoo: "newBar"}, "New title");
history.state; // {newFoo: "newBar"}
```

> 调用history.pushState()或者history.replaceState()不会触发popstate事件. popstate事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在JavaScript中调用history.back()、history.forward()、history.go()方法)，此外，a 标签的锚点也会触发该事件.

> 要确保通过 pushState()创建的每个“假”URL 背后都对应着服务器上一个真实的物理 URL。否则，单击“刷新”按钮会导致 404 错误。所有单页应用程序（SPA，Single Page Application）框架都必须通过服务器或客户端的某些配置解决这个问题。nginx 转发 try file 所有路由都执行index.html
