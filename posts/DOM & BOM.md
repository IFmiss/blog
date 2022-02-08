---
title: DOM & BOM
date: 2019-03-24 11:58:13
categories: javascript
tags: [js, html]
---

### JavaScript组成部分
- ECMAScript 基本语法
- DOM （文档对象模型）
- BOM （浏览器对象模型）

### DOM：文档对象模型
DOM 对于前端来说应该是再熟悉不过了，早期jquery的时代对于DOM的接触已经非常频繁了，文档对象模型是指：页面渲染的标签对象信息（如document，body，p标签等等），包含他们的属性，挂载事件等信息

#### DOM的顶层对象：document

##### document 对象集合
document是文档对象模型的顶层对象，之后则是html 再到 body...，document对象可以使我们对于页面所有的元素进行访问
```js
document.all  // 提供对文档中所有 HTML 元素的访问。
```
以上返回值都是一个虚拟数组

| 集合 | 描述 |
|:-----|:---|
|`all`|提供对文档中所有 HTML 元素的访问。|
|`anchors`|返回对文档中所有 Anchor 对象的引用。|
|`forms`|返回对文档中所有 Form 对象引用。|
|`images`|返回对文档中所有 Image 对象引用。|
|`links`|返回对文档中所有 Area 和 Link 对象引用。|

##### document 对象属性
| 属性 | 描述 |
|:-----|:---|
|`body`|提供对 <body> 元素的直接访问。对于定义了框架集的文档，该属性引用最外层的 <frameset>。|
|[`cookie`](/hexo-blog/关于cookie)|设置或返回与当前文档有关的所有 cookie。|
|`domain`|返回当前文档的域名。|
|`lastModified`|返回文档被最后修改的日期和时间。|
|`links`|返回对文档中所有 Area 和 Link 对象引用。|
|`referrer`|	返回载入当前文档的文档的 URL。|
|`title`|返回当前文档的标题。|
|`URL`|返回当前文档的 URL。|

##### document 对象方法
| 方法 | 描述 |
|:-----|:---|
|`close()`|关闭用 document.open() 方法打开的输出流，并显示选定的数据。|
|`getElementById()`|返回对拥有指定 id 的第一个对象的引用。|
|`getElementsByName()`|返回带有指定名称的对象集合。|
|`write()`|向文档写 HTML 表达式 或 JavaScript 代码。|
|`document.querySelector('p')`|返回所有p标签元素的集合|

#### HTML元素: element 对象
通常我们针对元素操作的时候需要拿到当前元素的节点信息，再给元素执行appendChild，getAttribute，等待增删改查的操作
##### element比较常用的方法和属性
| 方法/属性 | 描述 |
|:-----|:---|
|`element.appendChild()`|向元素添加新的子节点，作为最后一个子节点。|
|`element.childNodes`|返回元素子节点的 NodeList。|
|`element.className`|设置或返回元素的 class 属性。|
|`element.clientHeight`|	返回元素的可见高度。|
|`element.clientWidth`|返回元素的可见宽度。|
|`element.element.getElementsByTagName()`|返回拥有指定标签名的所有子元素的集合。|
|`element.insertBefore()`|在指定的已有的子节点之前插入新节点。|
|...|...|

#### 元素事件: dom event
Event 对象代表事件的状态，比如事件在其中发生的元素、键盘按键的状态、鼠标的位置、鼠标按钮的状态。

事件通常与函数结合使用，函数不会在事件发生前被执行！
##### 事件句柄　(Event Handlers)
| 事件名称 | 何时发生该事件 |
|:-----|:---|
|`onblur`|元素失去焦点。|
|`onchange`|域的内容被改变。|
|`onclick`|当用户点击某个对象时调用的事件句柄。|
|`ondblclick`|当用户双击某个对象时调用的事件句柄。
|
|`onerror`|在加载文档或图像时发生错误。|
|`onload`|一张页面或一幅图像完成加载。|
|`onmousedown`|鼠标按钮被按下。|
|...|...|

### BOM: 浏览器对象模型
- BOM主要用于管理窗口与窗口之间的通讯，因此其核心对象是window；
-  BOM由一系列相关的对象构成，并且每个对象都提供了很多方法与属性；
#### BOM顶层的对象： window
window对象是js中的顶级对象，所有定义在全局作用域中的变量、函数都会变成window对象的属性和方法，在调用的时候可以省略window。
```js
localStorage
window.localStorage

location.href
window.location.href
```
##### window对象属性或者方法
| 属性/方法 | 描述 |
|:-----|:---|
|`history`|对 History 对象的只读引用。请参数 History 对象。|
|`innerheight`|返回窗口的文档显示区的高度。|
|`innerwidth`|返回窗口的文档显示区的宽度。|
|`location`|用于窗口或框架的 Location 对象。|
|`alert()`|	显示带有一段消息和一个确认按钮的警告框。|
|`setTimeout()`|在指定的毫秒数后调用函数或计算表达式。|
|`clearInterval()	`|取消由 setInterval() 设置的 timeout。|
|`resizeTo()`|把窗口的大小调整到指定的宽度和高度。|
|`scrollTo()`|把内容滚动到指定的坐标。|
|...|...|

#### Navigator 对象
Navigator 对象包含有关浏览器的信息。
##### Navigator 对象属性或者方法
| 属性/方法 | 描述 |
|:-----|:---|
|`appCodeName`|返回浏览器的代码名。|
|`appName`|返回浏览器的名称。|
|`appVersion`|返回浏览器的平台和版本信息。|
|`onLine`|返回指明系统是否处于脱机模式的布尔值。|
|`platform`|返回运行浏览器的操作系统平台。|
|`userAgent	`|返回由客户机发送服务器的 user-agent 头部的值。|
|`javaEnabled()`|规定浏览器是否启用 Java。|
|`taintEnabled()`|规定浏览器是否启用数据污点 (data tainting)。|
|...|...|

#### Screen 对象
Screen 对象包含有关客户端显示屏幕的信息。
##### Screen 对象属性
| 属性 | 描述 |
|:-----|:---|
|`availHeight`|返回显示屏幕的高度 (除 Windows 任务栏之外)。|
|`availWidth`|返回显示屏幕的宽度 (除 Windows 任务栏之外)。|
|`height`|返回显示屏幕的高度。|
|`width`|返回显示器屏幕的宽度。|
|`updateInterval`|设置或返回屏幕的刷新率。|
|...|...|

#### History 对象
History 对象包含用户（在浏览器窗口中）访问过的 URL。History 对象是 window 对象的一部分，可通过 window.history 属性对其进行访问。
##### History 对象属性
| 属性/方法 | 描述 |
|:-----|:---|
|`length`|返回浏览器历史列表中的 URL 数量。|
|`back()`|加载 history 列表中的前一个 URL。|
|`forward()`|加载 history 列表中的下一个 URL。|
|`go()`|加载 history 列表中的某个具体页面。|

#### Location 对象
Location 对象包含有关当前 URL 的信息。可通过 window.location 属性来访问。
##### Location 对象属性
| 属性/方法 | 描述 |
|:-----|:---|
|`hash`|设置或返回从井号 (#) 开始的 URL（锚）。|
|`host`|设置或返端口号|
|`hostname`|设置或返回当前 URL 的主机名。|
|`href`|设置或返回完整的 URL。|
|`pathname`|设置或返回当前 URL 的路径部分。|
|`port`|设置或返回当前 URL 的端口号。|
|`protocol`|设置或返回当前 URL 的协议。|
|`search`|设置或返回从问号 (?) 开始的 URL（查询部分）。|
|`assign()`|加载新的文档。|
|`reload()`|重新加载当前文档。|
|`replace()`|用新的文档替换当前文档。|

### 总结
- BOM是浏览器对象模型，用来获取或设置浏览器的属性、行为，例如：新建窗口、获取屏幕分辨率、浏览器版本号等。
- DOM是文档对象模型，用来获取或设置文档中标签的属性，例如获取或者设置input表单的value值。
