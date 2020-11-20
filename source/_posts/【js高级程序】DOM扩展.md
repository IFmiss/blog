---
title: 【js高级程序】DOM扩展
date: 2020-11-20 08:02:52
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第15章*

### DOM 扩展

#### Selectors API
##### querySelector()
querySelector()方法接收 CSS 选择符参数，返回匹配该模式的第一个后代元素，如果没有匹配 项则返回 null。
```js
document.querySelector("body");
document.querySelector("#myDiv");
```

##### querySelectorAll()
这个方法返回的是一个 NodeList 的静态实例， querySelector的集合

##### matches()
matches()方法（在规范草案中称为 matchesSelector()）接收一个 CSS 选择符参数，如果元素 匹配则该选择符返回 true，否则返回 false。
```js
if (document.body.matches("body.page1")) {
  // true
}
```

#### 元素遍历
背景: IE9 之前的版本不会把元素间的空格当成空白节点，而其他浏览器则会。这样就导致了 childNodes 和 firstChild 等属性上的差异。为了弥补这个差异，同时不影响 DOM 规范，W3C 通过新的 Element Traversal 规范定义了一组新属性。
- `childElementCount` 返回子元素数量（不包含文本节点和注释）
- `firstElementChild` 指向第一个 Element 类型的子元素（Element 版 firstChild）
- `lastElementChild` 指向最后一个 Element 类型的子元素（Element 版 lastChild）；
- `previousElementSibling` 指向前一个Element类型的同胞元素（ Element 版 previousSibling）；
- `nextElementSibling` 指向后一个 Element 类型的同胞元素（Element 版 nextSibling）。

#### HTML5
##### CSS 类扩展
###### getElementsByClassName
getElementsByClassName()是 HTML5 新增的最受欢迎的一个方法，暴露在 document 对象和 所有 HTML 元素上。

###### classList属性
要操作类名，可以通过 className 属性实现添加、删除和替换。但 className 是一个字符串， 所以每次操作之后都需要重新设置这个值才能生效，即使只改动了部分字符串也一样。

新增方法:
- `add(value)`  向类名列表中添加指定的字符串值 value。如果这个值已经存在，则什么也不做。
- `contains(value)` 返回布尔值，表示给定的 value 是否存在。
- `remove(value)`  从类名列表中删除指定的字符串值 value。
- `toggle(value)`  如果类名列表中已经存在指定的 value，则删除；如果不存在，则添加。

```js
// 删除"disabled"类
div.classList.remove("disabled");

// 添加"current"类
div.classList.add("current");

// 切换
div.classList.add("on");
```

##### 焦点管理
###### document.activeElement
HTML5 增加了辅助 DOM 焦点管理的功能。首先是 `document.activeElement`，始终包含当前拥有焦点的 DOM 元素。
> 默认情况下，document.activeElement 在页面刚加载完之后会设置为 document.body。而在 页面完全加载之前，document.activeElement 的值为 null。

###### document.hasFocus()
确定文档是否获得了焦点，就可以帮助确定用户是否在操作页面。

##### HTMLDocument 扩展
###### readyState 属性
HTML5 将这个属性写进了标准。document.readyState 属性有两个可能的值
- `loading`，表示文档正在加载；
- `complete`，表示文档加载完成。

###### compatMode 属性
自从 IE6 提供了以标准或混杂模式渲染页面的能力之后，检测页面渲染模式成为一个必要的需求。 IE 为 document 添加了 compatMode 属性，这个属性唯一的任务是指示浏览器当前处于什么渲染模式。
- 标准模式下 document.compatMode 的值是"CSS1Compat"
- 混杂模式下， document.compatMode 的值是"BackCompat"
```js
if (document.compatMode == "CSS1Compat"){
  console.log("Standards mode");
} else {
  console.log("Quirks mode");
}
```

###### head 属性
作为对 document.body（指向文档的 `body` 元素）的补充，HTML5 增加了 `document.head` 属性，指向文档的 `head` 元素。

##### 字符集属性
HTML5 增加了几个与文档字符集有关的新属性。其中，characterSet 属性表示文档实际使用的 字符集，也可以用来指定新字符集。
```js
console.log(document.characterSet); // "UTF-16"
document.characterSet = "UTF-8";
```

##### 自定义数据属性
HTML5 允许给元素指定非标准的属性，但要使用前缀 data-以便告诉浏览器，这些属性既不包含 与渲染有关的信息，也不包含元素的语义信息。
```html
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```
定义了自定义数据属性后， 可以通过元素的 dataset 属性来访问。 dataset 属性是一个 DOMStringMap 的实例，包含一组键/值对映射。
```js
let div = document.getElementById("myDiv");
// 取得自定义数据属性的值
let appId = div.dataset.appId;  // 12345
div.dataset.appId = 23456
console.log(div.dataset.appId)  // 23456
```

##### 插入标记

