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
###### innerHTML 属性
- 在读取 innerHTML 属性时，会返回元素所有后代的 HTML 字符串，包括元素、注释和文本节点。
- 而在写入 innerHTML 时，则会根据提供的字符串值以新的 DOM 子树替代元素中原来包含的所有节点。 

###### outerHTML 属性
- 读取 outerHTML 属性时， 会返回调用它的元素（及所有后代元素）的 HTML 字符串。
- 在写入 outerHTML 属性时，调用它的元素会被传入的 HTML 字符串经解释之后生成的 DOM 子树取代。

###### insertAdjacentHTML()与 insertAdjacentText()
关于插入标签的最后两个新增方法是 insertAdjacentHTML()和 insertAdjacentText()。
第一个参数 必须是下列值中的一个：
- `beforebegin` 插入当前元素前面，作为前一个同胞节点；
- `afterbegin`  插入当前元素内部，作为新的子节点或放在第一个子节点前面；
- `beforeend`   插入当前元素内部，作为新的子节点或放在最后一个子节点后面；
- `afterend`    插入当前元素后面，作为下一个同胞节点。

```html
<!-- beforebegin -->
<p>
  <!-- afterbegin -->
  foo
  <!-- beforeend -->
</p>
<!-- afterend -->
```
> 在使用 innerHTML、 outerHTML 和 insertAdjacentHTML()之前，最好手动删除要被替换的元素上关联的事件处理程序和 JavaScript 对象。

##### scrollIntoView
DOM 规范中没有涉及的一个问题是如何滚动页面中的某个区域。HTML5 选择了标准化 scrollIntoView()。
- `alignToTop`: bool值
  - true： 窗口滚动后元素的顶部与视口顶部对齐。
  - false： 窗口滚动后元素的底部与视口底部对齐。
- `scrollIntoViewOptions` 是一个选项对象。
  - `behavior` 定义过渡动画，可取的值为"smooth"和"auto"，默认为"auto"。
  - `block` 定义垂直方向的对齐，可取的值为"start"、"center"、"end"和"nearest"，默 认为 "start"。
  - `inline` 定义水平方向的对齐，可取的值为"start"、"center"、"end"和"nearest"，默 认为 "nearest"。

#### 专有扩展
##### children 属性
```js
let childCount = element.children.length;
let firstChild = element.children[0];
```

##### contains()方法
contains()方法应该在要搜索的祖先元素上调 用，参数是待确定的目标节点。
```js
console.log(document.documentElement.contains(document.body);
```

##### 插入标记
###### innerText 属性
- innerText 属性对应元素中包含的所有文本内容，无论文本在子树中哪个层级。在用于读取值时， innerText 会按照深度优先的顺序将子树中所有文本节点的值拼接起来。
- 在用于写入值时，innerText 会移除元素的所有后代并插入一个包含该值的文本节点。

###### outerText属性
- outerText 与 innerText 是类似的， 只不过作用范围包含调用它的节点。
- 要读取文本值时， outerText 与 innerText 实际上会返回同样的内容。
