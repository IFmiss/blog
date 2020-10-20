---
title: 【js高级程序】事件流
date: 2020-10-19 08:07:02
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发 第17章*

### 事件流
事件流描述了页面接收事件的顺序

### 事件冒泡
```html
<!DOCTYPE html>
<html>
<head>
  <title>Event Bubbling Example</title>
</head>
<body>
  <div id="myDiv">Click Me</div>
  </body>
</html>
```
在点击页面中的 `div` 元素后，click 事件会以如下顺序发生：
(1) div
(2) body
(3) html
(4) document
也就是说，`div` 元素，即被点击的元素，最先触发 click 事件。然后，click 事件沿 DOM 树一 路向上，在经过的每个节点上依次触发，直至到达 document 对象。

### 事件捕获
事件捕获的意思是最不具体的节 点应该最先收到事件，而最具体的节点应该最后收到事件。事件捕获实际上是为了在事件到达最终目标 前拦截事件。如果前面的例子使用事件捕获，则点击 `div` 元素会以下列顺序触发 click 事件：
(1) document
(2) html
(3) body
(4) div
在事件捕获中，click 事件首先由 `document` 元素捕获，然后沿 DOM 树依次向下传播，直至到达 实际的目标元素 `div`。

### DOM 事件流
DOM2 Events 规范规定事件流分为 3 个阶段：
- 事件捕获
- 到达目标
- 事件冒泡
事件捕获最先发生， 为提前拦截事件提供了可能。然后，实际的目标元素接收到事件。最后一个阶段是冒泡，最迟要在这个 阶段响应事件。

### HTML 事件处理程序
```html
<input type="button" value="Click Me" onclick="console.log('Clicked')"/>
```
```html
<script>
  function showMessage() {
    console.log("Hello world!");
  }
</script>
<input type="button" value="Click Me" onclick="showMessage()"/>
```
问题：
- **运行时机问题，js加载顺序问题**， 在前面的例子中， 如果 showMessage()函数是在页面后面，在按钮中代码的后面定义的，那么当用户在 showMessage()函数 被定义之前点击按钮时，就会发生错误。
- 另一个问题是**对事件处理程序作用域链的扩展在不同浏览器中可能导致不同的结果**。不同 JavaScript 引擎中标识符解析的规则存在差异，因此访问无限定的对象成员可能导致错误。
- **HTML 与 JavaScript 强耦合**。如果需要修改事件处 理程序，则必须在两个地方，即 HTML 和 JavaScript 中，修改代码。

### DOM 事件处理程序
在 JavaScript 中指定事件处理程序的传统方式是把一个函数赋值给（DOM 元素的）一个事件处理程 序属性。这也是在第四代 Web 浏览器中开始支持的事件处理程序赋值方法，直到现在所有现代浏览器 仍然都支持此方法，主要原因是简单。
```js
window.onload = alert.bind(null, 'load success');

let btn = document.getElementById("myBtn");
btn.onclick = function() { console.log("Clicked"); };
```
先从文档中获取按钮，给按钮的事件赋值一个函数，如果需要移除事件，则可以移除该事件的引用
```js
btn.onclick = null
```

### DOM2 事件处理程序
DOM2 Events 为事件处理程序的赋值和移除定义了两个方法：addEventListener()和 remove-

EventListener()。这两个方法暴露在所有 DOM 节点上，它们接收 3 个参数：
- 事件名、
- 事件处理函数
- 和一个布尔值，true 表示在捕获阶段调用事件处理程序，false（默认值）表示在冒泡阶段调用事 件处理程序。

按照之前的注册事件，使用DOM2事件处理
```js
window.addEventListener('load', () => {
  alert('dom2 loaded')
})
```
以上代码为按钮添加了会在事件冒泡阶段触发的 onclick 事件处理程序（因为最后一个参数值为 false）。

**使用 DOM2 方式的主要优势是可以为同一个事件添加多个事件处理程序。**
```js
window.addEventListener('load', () => {
  alert('hello event')
})
window.addEventListener('load', () => {
  alert('dom2 loaded')
})
```
会按照注册的顺序，依次执行event队列中的事件函数，先 `hello event` 再 `dom2 loaded`

**使用removeEventListener移除事件中的某一个方法**
```js
const loadEvent = () => {
  alert('dom2 loaded')
}
window.addEventListener('load', loadEvent)
window.removeEventListener('load', loadEvent)
```
> 若使用`removeEventListener`，必须使用变量保存 事件函数，注册和移除必须指向同一个函数，此时才能再事件队列里移除想要移除的函数（因为可以找到相同的函数）

### 事件对象
在 DOM 中发生事件时，所有相关信息都会被收集并存储在一个名为 event 的对象中。这个对象包 含了一些基本信息，比如导致事件的元素、发生的事件类型，以及可能与特定事件相关的任何其他数据。 例如，鼠标操作导致的事件会生成鼠标位置信息，而键盘操作导致的事件会生成与被按下的键有关的信息。所有浏览器都支持这个 event 对象，尽管支持方式不同。

#### DOM 事件对象
在 DOM 合规的浏览器中，event 对象是传给事件处理程序的唯一参数。不管以哪种方式（DOM0 或 DOM2）指定事件处理程序，都会传入这个 event 对象。下面的例子展示了在两种方式下都可以使 用事件对象：
```js
let btn = document.getElementById("myBtn");
btn.onclick = function(event) {
  console.log(event.type); // "click"
};

btn.addEventListener("click", (event) => {
  console.log(event.type); // "click"
}, false);
```

在事件处理程序内部，this 对象始终等于 currentTarget 的值，而 target 只包含事件的实际 目标。如果事件处理程序直接添加在了意图的目标，则 this、currentTarget 和 target 的值是一样 的。下面的例子展示了这两个属性都等于 this 的情形：
```js
let btn = document.getElementById("myBtn");
btn.onclick = function(event) {
  console.log(event.currentTarget === this);  // true
  console.log(event.target === this);   // true
};
```
上面的代码检测了 currentTarget 和 target 的值是否等于 this。因为 click 事件的目标是按钮，所以这 3 个值是相等的。如果这个事件处理程序是添加到按钮的父节点（如 document.body）上， 那么它们的值就不一样了。比如下面的例子在 document.body 上添加了单击处理程序：

```js
document.body.onclick = function(event) {
  console.log(event.currentTarget === document.body); // true
  console.log(this === document.body);  // true
  console.log(event.target === document.getElementById("myBtn"));   // true
};
```
这种情况下点击按钮，this 和 currentTarget 都等于 document.body，这是因为它是注册事件 处理程序的元素。而 target 属性等于按钮本身，这是因为那才是 click 事件真正的目标。由于按钮本身并没有注册事件处理程序，**因此 click 事件冒泡到 document.body**，从而触发了在它上面注册的 处理程序。

### preventDefault()
用于阻止特定事件的默认动作。比如，链接的默认行为就是在被单击时导 航到 href 属性指定的 URL。如果想阻止这个导航行为，可以在 onclick 事件处理程序中取消。
```js
let link = document.getElementById("myLink");
link.onclick = function(event) {
  event.preventDefault();
  // do anything
};
```

### stopPropagation()
用于立即阻止事件流在 DOM 结构中传播，取消后续的事件捕获或冒泡。
按照之前body的冒泡事件来，点击按钮冒泡的代码
```js
document.body.onclick = function(event) {
  console.log(event.currentTarget === document.body); // true
  console.log(this === document.body);  // true
  console.log(event.target === document.getElementById("myBtn"));   // true
};

const btn = document.getElementById("myBtn");
btn.onclick = function (event) {
  event.stopPropagation();
  // do btn click event
}
```
点击按钮的时候，`document.body` 注册监听，不会由btn 往上冒泡到 body, 因此代码也不会被执行

### eventPhase
可用于确定事件流当前所处的阶段。
- 1: 事件处理程序在捕获阶段被调用
- 2: 事件处理程序在目标上被调用
- 3: 事件处理程序 在冒泡阶段被调用
> 不过要注意的是，虽然“到达目标”是在冒泡阶段发生的， 但其 eventPhase 仍然等于 2
```html
<body>
  <button id="myBtn">测试事件</button>
</body>
<script>
  const btn = document.getElementById('myBtn');
  btn.onclick = (event) => {
    console.log('btn eventPhase', event.eventPhase)
  } // document.body eventPhase 3

  document.body.onclick = (event) => {
    console.log('document.body eventPhase', event.eventPhase);
  } // btn eventPhase 2

  document.body.addEventListener('click', (event) => {
    console.log('document.body addEventListener eventPhase', event.eventPhase);
  }, true)  // document.body addEventListener eventPhase 1
</script>
```
> 注意 event 对象只在事件处理程序执行期间存在，一旦执行完毕，就会被销毁。
