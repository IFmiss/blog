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

