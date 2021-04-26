---
title: 【js高级程序】事件流
date: 2020-10-19 08:07:02
categories: javascript
tags: [js]
---

红宝书学习记录

### _原文整理摘抄自 javascript 高级程序开发(第 4 版) 第 17 章_

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

1. div
2. body
3. html
4. document

也就是说，`div` 元素，即被点击的元素，最先触发 click 事件。然后，click 事件沿 DOM 树一 路向上，在经过的每个节点上依次触发，直至到达 document 对象。

### 事件捕获

事件捕获的意思是最不具体的节 点应该最先收到事件，而最具体的节点应该最后收到事件。事件捕获实际上是为了在事件到达最终目标 前拦截事件。如果前面的例子使用事件捕获，则点击 `div` 元素会以下列顺序触发 click 事件：

1. document
2. html
3. body
4. div

在事件捕获中，click 事件首先由 `document` 元素捕获，然后沿 DOM 树依次向下传播，直至到达 实际的目标元素 `div`。

### DOM 事件流

DOM2 Events 规范规定事件流分为 3 个阶段：

- 事件捕获
- 到达目标
- 事件冒泡
  事件捕获最先发生， 为提前拦截事件提供了可能。然后，实际的目标元素接收到事件。最后一个阶段是冒泡，最迟要在这个 阶段响应事件。

### HTML 事件处理程序

```html
<input type="button" value="Click Me" onclick="console.log('Clicked')" />
```

```html
<script>
  function showMessage() {
    console.log("Hello world!");
  }
</script>
<input type="button" value="Click Me" onclick="showMessage()" />
```

问题：

- **运行时机问题，js 加载顺序问题**， 在前面的例子中， 如果 showMessage()函数是在页面后面，在按钮中代码的后面定义的，那么当用户在 showMessage()函数 被定义之前点击按钮时，就会发生错误。
- 另一个问题是**对事件处理程序作用域链的扩展在不同浏览器中可能导致不同的结果**。不同 JavaScript 引擎中标识符解析的规则存在差异，因此访问无限定的对象成员可能导致错误。
- **HTML 与 JavaScript 强耦合**。如果需要修改事件处 理程序，则必须在两个地方，即 HTML 和 JavaScript 中，修改代码。

### DOM 事件处理程序

在 JavaScript 中指定事件处理程序的传统方式是把一个函数赋值给（DOM 元素的）一个事件处理程 序属性。这也是在第四代 Web 浏览器中开始支持的事件处理程序赋值方法，直到现在所有现代浏览器 仍然都支持此方法，主要原因是简单。

```js
window.onload = alert.bind(null, "load success");

let btn = document.getElementById("myBtn");
btn.onclick = function () {
  console.log("Clicked");
};
```

先从文档中获取按钮，给按钮的事件赋值一个函数，如果需要移除事件，则可以移除该事件的引用

```js
btn.onclick = null;
```

### DOM2 事件处理程序

DOM2 Events 为事件处理程序的赋值和移除定义了两个方法：addEventListener()和 remove-

EventListener()。这两个方法暴露在所有 DOM 节点上，它们接收 3 个参数：

- 事件名、
- 事件处理函数
- 和一个布尔值，true 表示在捕获阶段调用事件处理程序，false（默认值）表示在冒泡阶段调用事 件处理程序。

按照之前的注册事件，使用 DOM2 事件处理

```js
window.addEventListener("load", () => {
  alert("dom2 loaded");
});
```

以上代码为按钮添加了会在事件冒泡阶段触发的 onclick 事件处理程序（因为最后一个参数值为 false）。

**使用 DOM2 方式的主要优势是可以为同一个事件添加多个事件处理程序。**

```js
window.addEventListener("load", () => {
  alert("hello event");
});
window.addEventListener("load", () => {
  alert("dom2 loaded");
});
```

会按照注册的顺序，依次执行 event 队列中的事件函数，先 `hello event` 再 `dom2 loaded`

**使用 removeEventListener 移除事件中的某一个方法**

```js
const loadEvent = () => {
  alert("dom2 loaded");
};
window.addEventListener("load", loadEvent);
window.removeEventListener("load", loadEvent);
```

> 若使用`removeEventListener`，必须使用变量保存 事件函数，注册和移除必须指向同一个函数，此时才能再事件队列里移除想要移除的函数（因为可以找到相同的函数）

### 事件对象

在 DOM 中发生事件时，所有相关信息都会被收集并存储在一个名为 event 的对象中。这个对象包 含了一些基本信息，比如导致事件的元素、发生的事件类型，以及可能与特定事件相关的任何其他数据。 例如，鼠标操作导致的事件会生成鼠标位置信息，而键盘操作导致的事件会生成与被按下的键有关的信息。所有浏览器都支持这个 event 对象，尽管支持方式不同。

#### DOM 事件对象

在 DOM 合规的浏览器中，event 对象是传给事件处理程序的唯一参数。不管以哪种方式（DOM0 或 DOM2）指定事件处理程序，都会传入这个 event 对象。下面的例子展示了在两种方式下都可以使 用事件对象：

```js
let btn = document.getElementById("myBtn");
btn.onclick = function (event) {
  console.log(event.type); // "click"
};

btn.addEventListener(
  "click",
  (event) => {
    console.log(event.type); // "click"
  },
  false
);
```

在事件处理程序内部，this 对象始终等于 currentTarget 的值，而 target 只包含事件的实际 目标。如果事件处理程序直接添加在了意图的目标，则 this、currentTarget 和 target 的值是一样 的。下面的例子展示了这两个属性都等于 this 的情形：

```js
let btn = document.getElementById("myBtn");
btn.onclick = function (event) {
  console.log(event.currentTarget === this); // true
  console.log(event.target === this); // true
};
```

上面的代码检测了 currentTarget 和 target 的值是否等于 this。因为 click 事件的目标是按钮，所以这 3 个值是相等的。如果这个事件处理程序是添加到按钮的父节点（如 document.body）上， 那么它们的值就不一样了。比如下面的例子在 document.body 上添加了单击处理程序：

```js
document.body.onclick = function (event) {
  console.log(event.currentTarget === document.body); // true
  console.log(this === document.body); // true
  console.log(event.target === document.getElementById("myBtn")); // true
};
```

这种情况下点击按钮，this 和 currentTarget 都等于 document.body，这是因为它是注册事件 处理程序的元素。而 target 属性等于按钮本身，这是因为那才是 click 事件真正的目标。由于按钮本身并没有注册事件处理程序，**因此 click 事件冒泡到 document.body**，从而触发了在它上面注册的 处理程序。

### preventDefault()

用于阻止特定事件的默认动作。比如，链接的默认行为就是在被单击时导 航到 href 属性指定的 URL。如果想阻止这个导航行为，可以在 onclick 事件处理程序中取消。

```js
let link = document.getElementById("myLink");
link.onclick = function (event) {
  event.preventDefault();
  // do anything
};
```

### stopPropagation()

用于立即阻止事件流在 DOM 结构中传播，取消后续的事件捕获或冒泡。
按照之前 body 的冒泡事件来，点击按钮冒泡的代码

```js
document.body.onclick = function (event) {
  console.log(event.currentTarget === document.body); // true
  console.log(this === document.body); // true
  console.log(event.target === document.getElementById("myBtn")); // true
};

const btn = document.getElementById("myBtn");
btn.onclick = function (event) {
  event.stopPropagation();
  // do btn click event
};
```

点击按钮的时候，`document.body` 注册监听，不会由 btn 往上冒泡到 body, 因此代码也不会被执行

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
  const btn = document.getElementById("myBtn");
  btn.onclick = (event) => {
    console.log("btn eventPhase", event.eventPhase);
  }; // document.body eventPhase 3

  document.body.onclick = (event) => {
    console.log("document.body eventPhase", event.eventPhase);
  }; // btn eventPhase 2

  document.body.addEventListener(
    "click",
    (event) => {
      console.log(
        "document.body addEventListener eventPhase",
        event.eventPhase
      );
    },
    true
  ); // document.body addEventListener eventPhase 1
</script>
```

> 注意 event 对象只在事件处理程序执行期间存在，一旦执行完毕，就会被销毁。

### 事件类型

Web 浏览器中可以发生很多种事件

#### 用户界面事件（UIEvent）: 涉及与 BOM 交互的通用浏览器事件。

`load`, `unload`, `abort`, `error`, `select`, `resize`, `scroll`

> - 一般来说，任何在 `window` 上发生的事件，都可以通过给`body`元素上对应的属性赋值来指定， 这是因为 HTML 中没有 `window` 元素。这实际上是为了保证向后兼容的一个策略，但在所有浏览器中都 能得到很好的支持。
> - 根据 DOM2 Events，`load` 事件应该在 `document` 而非 `window` 上触发。可是为了向后兼容，所有浏览器都在 window 上实现了 `load` 事件。
> - `unload` 最常用于清理引用，以避免内存泄漏。
>   根据 DOM2 Events，`unload` 事件应该在 `body` 而非 window 上触发。可是为了向后兼容，所有浏览器都在 window 上实现了 `unload` 事件。
>   浏览器窗口在最大化和最小化时也会触发 `resize` 事件。

#### 焦点事件（FocusEvent）: 在元素获得和失去焦点时触发。

`blur`, `focusin`, `focusout`, `focus`,
当焦点从页面中的一个元素移到另一个元素上时，会依次发生如下事件。

1. `focuscout` 在失去焦点的元素上触发。
2. `focusin` 在获得焦点的元素上触发。
3. `blur` 在失去焦点的元素上触发。
4. `focus` 在获得焦点的元素上触发。

#### 鼠标事件（MouseEvent）：使用鼠标在页面上执行某些操作时触发。

- `click` 单击鼠标主键（通常是左键）或按键盘回车键时触发
- `dblclick` 双击
- `mousedown` 在用户按下任意鼠标键时触发。
- `mouseenter` 元素外到进入元素触发
- `mouseleave` 元素内到离开元素触发
- `mousemove` 在鼠标光标在元素上移动时反复触发
- `mouseout` 把鼠标光标从一个元素移到另一个元素上时触发
- `mouseover` 把鼠标光标从元素外部移到元素内部时触发
- `mouseup` 在用户释放鼠标键时触发
  > 除了 `mouseenter` 和 `mouseleave`，所有鼠标事件都会冒泡， 都可以被取消，而这会影响浏览器的默认行为。

#### 滚轮事件（WheelEvent）：使用鼠标滚轮（或类似设备）时触发。

- `mousewheel` 滚轮滚动事件

#### 输入事件（InputEvent）：向文档中输入文本时触发。

`keydown` 用户按下键盘上某个键时触发，而且持续按住会重复触发。
`keypress` 用户按下键盘上某个键并产生字符时触发，而且持续按住会重复触发。Esc 键也会 触发这个事件。DOM3 Events 废弃了 keypress 事件，而推荐 `textInput` 事件。
`keyup` 用户释放键盘上某个键时触发。

> - 输入事件只有一个，即 textInput。这个事件是对 keypress 事件的扩展，用于在文本显示给用 户之前更方便地截获文本输入。textInput 会在文本被插入到文本框之前触发。
> - 键盘事件支持与鼠标事件相同的修饰键。shiftKey、ctrlKey、altKey 和 metaKey

顺序：`keydown` => (`textInput` | `keypress`) => 输入框文字显示 => `keyup`

属性在键盘事件中都是可用的。

#### 键盘事件（KeyboardEvent）：使用键盘在页面上执行某些操作时触发。

#### 合成事件（CompositionEvent）：在使用某种 IME（Input Method Editor，输入法编辑器）输入 字符时触发。

合成事件是 DOM3 Events 中新增的，用于处理通常使用 IME 输入时的复杂输入序列。IME 可以让用户输入物理键盘上没有的字符。例如，使用拉丁字母键盘的用户还可以使用 IME 输入日文。IME 通 常需要同时按下多个键才能输入一个字符。合成事件用于检测和控制这种输入。合成事件有以下 3 种：

- compositionstart，在 IME 的文本合成系统打开时触发，表示输入即将开始；
- compositionupdate，在新字符插入输入字段时触发；
- compositionend，在 IME 的文本合成系统关闭时触发，表示恢复正常键盘输入。

除了这些事件类型之外，HTML5 还定义了另一组事件，而浏览器通常在 DOM 和 BOM 上实现专有事 件。

#### contextmenu

允许开发者取消默认的上下文菜单并提供自定义菜单。

#### beforeunload

beforeunload 事件会在 window 上触发，用意是给开发者提供阻止页面被卸载的机会。

#### DOMContentLoaded

window 的 load 事件会在页面完全加载后触发，因为要等待很多外部资源加载完成，所以会花费 较长时间。而 DOMContentLoaded 事件会在 DOM 树构建完成后立即触发，而不用等待图片、JavaScript 文件、CSS 文件或其他资源加载完成。

#### readystatechange

提供文档或元素加载状态的信息，但行为有时候并不稳定。支持 readystatechange 事件的每个 对象都有一个 readyState 属性，该属性具有一个以下列出的可能的字符串值。

- uninitialized：对象存在并尚未初始化。
- loading：对象正在加载数据
- loaded：对象已经加载完数据。
- interactive：对象可以交互，但尚未加载完成。
- complete：对象加载完成。

> 使用 readystatechange 只能尽量模拟 DOMContentLoaded，但做不到分毫不差。load 事件和 readystatechange 事件发生的顺序在不同页面中是不一样的。

#### hashchange

HTML5 增加了 hashchange 事件，用于在 URL 散列值（URL 最后#后面的部分）发生变化时通知 开发者。单页面应该 hash 路由的跳转使用的就是监听 `hashchange`

```js
window.addEventListener("hashchange", (event) => {
  console.log(`Old URL: ${event.oldURL}, New URL: ${event.newURL}`);
});
```

### 设备事件

#### `orientationchange`

苹果公司在移动 Safari 浏览器上创造了 orientationchange 事件，以方便开发者判断用户的设备 是处于垂直模式还是水平模式。
`window.orientation` 有三种值

- 0 垂直模式
- 90 左转水平模式
- -90 右转水平模式
  旋转设备会触发 `orientationchange` 事件

#### `deviceorientation`

deviceorientation 是 DeviceOrientationEvent 规范定义的事件。deviceorientation 事件只反 映设备在空间中的朝向，而不涉及移动相关的信息。

#### `devicemotion`

这个事件用于提示设备实际上在移动， 而不仅仅是改变了朝向。例如，devicemotion 事件可以用来确定设备正在掉落或者正拿在一个行走的 人手里。

### 触摸及手势事件

- `touchstart` 手指放到屏幕上时触发（即使有一个手指已经放在了屏幕上）。
- `touchmove` 手指在屏幕上滑动时连续触发。在这个事件中调用 preventDefault()可以阻止 滚动。
- `touchend` 手指从屏幕上移开时触发
- `touchcancel` 系统停止跟踪触摸时触发。

这些事件都会冒泡，也都可以被取消。尽管触摸事件不属于 DOM 规范，但浏览器仍然以兼容 DOM 的方式实现了它们。因此，每个触摸事件的 event 对象都提供了鼠标事件的公共属性：bubbles 、 cancelable 、 view 、 clientX 、 clientY 、 screenX 、 screenY 、 detail 、 altKey 、 shiftKey 、 ctrlKey 和 metaKey。

#### 手指触屏触发的事件依次为

1. touchstart
2. mouseover
3. mousemove (1 次)
4. mousedown
5. mouseup
6. click
7. touchend

### 内存与性能

#### 事件委托

“过多事件处理程序”的解决方案是使用事件委托。事件委托利用事件冒泡，可以只使用一个事件 处理程序来管理一种类型的事件。

#### 删除事件处理程序

- `removeChild`, `replaceChild` 删除节点，节点的事件处理程序不会被回收
- `innerHTML` 替换元素，被替换的元素如果有事件处理程序，就不会被垃圾收集程序正常清理

> 在替换或者删除的时候设置 `elem.onclick = null`，或者在设置 `removeChild(ele)` 时，设置 `ele = null`用于清除 ele 的引用，这样内存则会被浏览器自动回收
