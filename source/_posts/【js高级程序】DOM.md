---
title: 【js高级程序】DOM
date: 2020-11-17 07:21:37
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第14章*

任何 HTML 或 XML 文档都可以用 DOM 表示为一个由节点构成的层级结构。
```html
<html>
  <head>
    <title>Sample Page</title>
  </head>
  <body>
    <p>Hello World!</p>
  </body>
</html>
```
其层级结构为
- Document
  - Element (html)
    - Element (head)
      - Element (title)
        - Text Sample Page
    - Element (body)
      - Element (p)
        - Text Hello world!
        
其中，document 节点表示每个文档的根节点。在这里，根节点的唯一子节点是html元素，我们称之 为文档元素（documentElement）。

> HTML 中的每段标记都可以表示为这个树形结构中的一个节点。元素节点表示 HTML 元素，属性 节点表示属性，文档类型节点表示文档类型，注释节点表示注释。DOM 中总共有 12 种节点类型，这些 类型都继承一种基本类型。

### Node 类型
DOM Level 1 描述了名为 Node 的接口，这个接口是所有 DOM 节点类型都必须实现的。

每个节点都有 nodeType 属性，表示该节点的类型。节点类型由定义在 Node 类型上的 12 个数值 常量表示：

- `Node.ELEMENT_NODE`（1）  元素节点
- `Node.ATTRIBUTE_NODE`（2）   属性节点
- `Node.TEXT_NODE`（3）   文本节点
- `Node.CDATA_SECTION_NODE`（4）  CDATA区段
- `Node.ENTITY_REFERENCE_NODE`（5）   实体应用元素
- `Node.ENTITY_NODE`（6）   实体
- `Node.PROCESSING_INSTRUCTION_NODE`（7）    表示处理指令
- `Node.COMMENT_NODE`（8）   注释节点
- `Node.DOCUMENT_NODE`（9）   最外层的Root element,包括所有其他节点
- `Node.DOCUMENT_TYPE_NODE`（10）   <!DOCTYPE...>
- `Node.DOCUMENT_FRAGMENT_NODE`（11）   文档碎片节点
- `Node.NOTATION_NODE`（12）   DTD中声明的符号节点

##### nodeName 与 nodeValue
nodeName 与 nodeValue 保存着有关节点的信息。这两个属性的值完全取决于节点类型。
使用之前检测节点
```js
if (someNode.nodeType == 1){
  value = someNode.nodeName;  // 会显示元素的标签名
}
```

##### 节点关系
文档中的所有节点都与其他节点有关系。这些关系可以形容为家族关系，相当于把文档树比作家谱。

- childNodes 属性，其中包含一个 NodeList 的实例。NodeList 是一个类数组 对象，用于存储可以按位置存取的有序节点。
  ```js
  let firstChild = someNode.childNodes[0];
  let secondChild = someNode.childNodes.item(1);
  let count = someNode.childNodes.length;
  ```

- parentNode 属性，指向其 DOM 树中的父元素。
- previousSibling 和 nextSibling 可以在这个列表的节点间导航。分别代表前一个 后一个元素
- firstChild 和 lastChild 分别指向 childNodes 中的第一个和最后一个子节点。
> 虽然所有节点类型都继承了 Node，但并非所有节点都有子节点。

##### 操纵节点
因为所有关系指针都是只读的， 所以DOM又提供了一些操纵节点的方法。
- `appendChild` 在 childNodes 列表末尾添加节点
  > 如果把文档中已经存在的节点传给 appendChild()，则这个节点会从之前的位置被转移到新位置。
- `insertBefore` 把节点放到 childNodes 中的特定位置而不是末尾
- `replaceChild` 接收两个参数：要插入的节点和要替换的节点。要替换的节点会被返回并从文档 树中完全移除，要插入的节点会取而代之。
- `removeChild` 接收一个参数，即要移除 的节点。被移除的节点会被返回
- `cloneNode`  会返回与调用它的节点一模一样的节点, 接受一个参数
  - true: 会进行深复制， 即复制节点及其整个子 DOM 树。
  - false: 则只会复制调用该方法的节点。
  > cloneNode()方法不会复制添加到 DOM 节点的 JavaScript 属性，比如事件处理程序。这个方法只复制 HTML 属性，以及可选地复制子节点。

#### Document
JavaScript 中表示文档节点的类型, 在浏览器中， 文档对象 `document` 是 `HTMLDocument` 的实例（`HTMLDocument` 继承 `Document`）表示整个 HTML 页面
- nodeType 等于 9；
- nodeName 值为"#document"；
- nodeValue 值为 null；
- parentNode 值为 null；
- ownerDocument 值为 null；
- 子节点可以是 DocumentType（最多一个）、Element（最多一个）、ProcessingInstruction 或 Comment 类型。

##### 文档子节点
虽然 DOM 规范规定 Document 节点的子节点可以是 DocumentType、Element、ProcessingInstruction 或 Comment，但也提供了两个访问子节点的快捷方式。

第一个： documentElement 属 性，始终指向 HTML 页面中的 html 元素。
第二个： document 类型另一种可能的子节点是 DocumentType。

##### 文档信息
- `title`  可读可写 文档标题
- `URL`  当前页面的完整 URL (只读)
- `domain`  页面的域名，可读可写，但不能给这个属性设置 URL 中不包含的值
- `referrer`   当前页面的那个页面的 URL(来源地址) (只读)

当页面中包含来自某个不同子域的窗格（ frame ）或内嵌窗格（ iframe ）时， 设置 document.domain 是有用的。因为跨源通信存在安全隐患，所以不同子域的页面间无法通过 JavaScript 通信。此时，在每个页面上把 document.domain 设置为相同的值，这些页面就可以访问对方的 JavaScript 对象了。

##### 定位元素
getElementById
getElementsByTagName
getElementsByName
...

##### 特殊集合
- `document.anchors`  包含文档中所有带 name 属性的 a 元素
- `document.forms`  包含文档中所有 form 元素（与 document.getElementsByTagName("form") 返回的结果相同）。
- `document.images`  包含文档中所有 img 元素（与 document.getElementsByTagName("img") 返回的结果相同）。
- `document.links`  包含文档中所有带 href 属性的 a 元素。

##### 文档写入
- `write(str)`  字符串写入网页中
- `writeln(str)`  字符串写入网页中 + (\n)
  > 在包含 JavaScript 文 件时，记住不能像下面的例子中这样直接包含字符串"&lt;/script&gt;"，因为这个字符串会被解释为脚本块 的结尾，导致后面的代码不能执行， 
  ```js
  document.write("<script type=\"text/javascript\" src=\"file.js\">" +"<\/script>");
  ```
- `open()`和 `close()`方法分别用于打开和关闭网页输出流。

#### Element
- nodeType 等于 1；
- nodeName 值为元素的标签名；
- nodeValue 值为 null；
- parentNode 值为 Document 或 Element 对象；
- 子节点可以是 Element 、 Text 、 Comment 、 ProcessingInstruction 、 CDATASection 、 EntityReference 类型。

##### HTML元素
属性 (以下都是可读可写的)
- `id`，元素在文档中的唯一标识符；
- `title` 包含元素的额外信息，通常以提示条形式展示；
- `lang`，元素内容的语言代码
- `dir`，语言的书写方向（"ltr"表示从左到右，"rtl"表示从右到左）
- `className` 相当于 class 属性，用于指定元素的 CSS 类（因为 class 是 ECMAScript 关键字， 所以不能直接用这个名字）。

##### 属性操作
getAttribute
setAttribute
removeAttribute

##### attributes 属性
attributes 属性包含一个 NamedNodeMap 实例，是一个类似 NodeList 的“实时”集合。元素的每个属性都表示为一个 Attr 节 点，并保存在这个 NamedNodeMap 对象中。
- `getNamedItem(name)`，返回 nodeName 属性等于 name 的节点；
- `removeNamedItem(name)`，删除 nodeName 属性等于 name 的节点；
- `setNamedItem(node)`，向列表中添加 node 节点，以其 nodeName 为索引；
- `item(pos)`，返回索引位置 pos 处的节点。

##### 创建元素
`document.createElement(tagName)`
> 要把元素添加到文档树，可以使用 appendChild()、insertBefore()或 replaceChild()。

##### 元素后代
`childNodes` 属性包含元素所有的子节点，这些子节点可能是其他元素、文本节点、注释或处理指令。

#### Text
Text 节点由 Text 类型表示，包含按字面解释的纯文本，也可能包含转义后的 HTML 字符，但不 含 HTML 代码。
- nodeType 等于 3；
- nodeName 值为"#text"；
- nodeValue 值为节点中包含的文本；
- parentNode 值为 Element 对象；
- 不支持子节点。

```html
<h4>异步模块定义（AMD）</h4>
```
```js
const textNode = document.getElementsByTagName('h4')[1].childNodes[0];
textNode.nodeValue    // 异步模块定义（AMD）
textNode.data   //  异步模块定义（AMD）
```

文本节点暴露了以下操 作文本的方法：
- `appendData(text)`   向节点末尾添加文本 text；
- `deleteData(offset, count)`   从位置 offset 开始删除 count 个字符；
- `insertData(offset, text)`   在位置 offset 插入 text；
- `replaceData(offset, count, text)`   用 text 替换从位置 offset 到 offset + count 的 文本；
- `splitText(offset)`   在位置 offset 将当前文本节点拆分为两个文本节点；
- `substringData(offset, count)`   提取从位置 offset 到 offset + count 的文本。 除了这些方法，还可以通过 length 属性获取文本节点中包含的字符数量。
```js
textNode.appendData(1)    // text node: 异步模块定义（AMD）1
textNode.deleteData(7, 1)   // 异步模块定义（MD）1
textNode.insertData(7, 'A')   // 异步模块定义（AMD）1
textNode.replaceData(7, 3, 'commonjs')    // 异步模块定义（commonjs）1

document.getElementsByTagName('h4')[1].childNodes.length  // 1
textNode.splitText(5)    // return 5以后的所有字符  义（AMD）1
document.getElementsByTagName('h4')[1].childNodes[0]    // 异步模块定
document.getElementsByTagName('h4')[1].childNodes[1]    // 义（AMD）1
document.getElementsByTagName('h4')[1].childNodes.length  // 2

textNode.substringData(2, 3)    //  模块
```

##### 创建文本节点
`document.createTextNode()`
```js
let textNode = document.createTextNode("<strong>Hello</strong> world!");
```

##### 规范化文本节点
**`element.normalize();`** 所有同胞文本节点会被合并为一个文本节点，这个 文本节点的 nodeValue 就等于之前所有同胞节点 nodeValue 拼接在一起得到的字符串。

##### 拆分文本节点
在位置 offset 将当前文本节点拆分为两个文本节点；
```js
let textNode = document.createTextNode("Hello world!"); element.appendChild(textNode);
document.body.appendChild(element);

element.firstChild.splitText(5);  
```

#### Comment 类型
DOM 中的注释通过 Comment 类型表示。

- nodeType 等于 8；
- nodeName 值为"#comment"；
- nodeValue 值为注释的内容；
- parentNode 值为 Document 或 Element 对象；
- 不支持子节点。

Comment 类型与 Text 类型继承同一个基类（CharacterData），因此拥有除 splitText()之外 Text 节点所有的字符串操作方法。

#### CDATASection 类型
CDATASection 类型表示 XML 中特有的 CDATA 区块。CDATASection 类型继承 Text 类型，因 此拥有包括 splitText()在内的所有字符串操作方法。

- nodeType 等于 4；
- nodeName 值为"#cdata-section"；
- nodeValue 值为 CDATA 区块的内容;
- parentNode 值为 Document 或 Element 对象；
- 不支持子节点。

可以通过document.createCDataSection()并传入节点内容来创建 CDATA 区块。

#### DocumentType 类型
DocumentType 类型的节点包含文档的文档类型（doctype）信息

- nodeType 等于 10；
- nodeName 值值为文档类型的名称；
- nodeValue 值为 null;
- parentNode 值为 Document 对象；
- 不支持子节点。

<!DOCTYPE html>
对于这个文档类型，name 属性的值是"html"：表示它是html文档

#### DocumentFragment 类型
在所有节点类型中，DocumentFragment 类型是唯一一个在标记中没有对应表示的类型。**DOM 将 文档片段定义为“轻量级”文档， 能够包含和操作节点， 却没有完整文档那样额外的消耗。**
- nodeType 等于 11； 
- nodeName 值为"#document-fragment"； 
- nodeValue 值为 null；
- parentNode 值为 null； 
- 子节点可以是 Element、ProcessingInstruction、Comment 、Text 、CDATASection 或 EntityReference。

```js
document.createDocumentFragment();
```
文档片段从 Node 类型继承了所有文档类型具备的可以执行 DOM 操作的方法。多次动态append的时候 createDocumentFragment 很好用

> 如果文档中的一个 节点被添加到一个文档片段，则该节点会从文档树中移除，不会再被浏览器渲染。添加到文档片段的新 节点同样不属于文档树，不会被浏览器渲染。可以通过 appendChild()或 insertBefore()方法将文 档片段的内容添加到文档。在把文档片段作为参数传给这些方法时，这个文档片段的所有子节点会被添 加到文档中相应的位置。文档片段本身永远不会被添加到文档树。

```js
let fragment = document.createDocumentFragment();
let ul = document.getElementById("myList");

for (let i = 0; i < 3; ++i) {
  let li = document.createElement("li");
  li.appendChild(document.createTextNode(`Item ${i + 1}`));
  fragment.appendChild(li);
}

ul.appendChild(fragment);
```

#### Attr 类型
元素数据在 DOM 中通过 Attr 类型表示。
- nodeType 等于 2；
- nodeName 值为属性名；
- nodeValue 值为属性值；
- parentNode 值为 null；
- 在 HTML 中不支持子节点； 
- 在 XML 中子节点可以是 Text 或 EntityReference。

属性节点尽管是节点，却不被认为是 DOM 文档树的一部分。Attr 节点很少直接被引用，通常开 发者更喜欢使用 getAttribute()、removeAttribute()和 setAttribute()方法操作属性。

Attr 对象上有 3 个属性：
- `name`    包含属性名（与 nodeName 一样）
- `value`   包含属性值（与 nodeValue 一样）
- `specified`   一个布尔值，表示属性使用的是 默认值还是被指定的值。

可以使用 document.createAttribute()方法创建新的 Attr 节点，参数为属性名。比如，要给 元素添加 align 属性，可以使用下列代码：

```js
let attr = document.createAttribute("align");
attr.value = "left";
element.setAttributeNode(attr);

alert(element.attributes["align"].value); // "left"
alert(element.getAttributeNode("align").value); // "left" 
alert(element.getAttribute("align")); // "left"
```
> 将属性作为节点来访问多数情况下并无必要。 推荐使用 getAttribute() 、
removeAttribute()和 setAttribute()方法操作属性，而不是直接操作属性节点。

### DOM 编程
#### 动态脚本
script元素用于向网页中插入 JavaScript 代码，可以是 src 属性包含的外部文件，也可以是作为该 元素内容的源代码
```js
<script src="foo.js"></script>

// or

let script = document.createElement("script");
script.src = "foo.js";
document.body.appendChild(script);
```
> 通过 innerHTML 属性创建的 `script` 元素永远不会执行。浏览器会尽责地创建 `script` 元素， 以及其中的脚本文本， 但解析器会给这个 `script` 元素打上永不执行的标签。 只要是使用 innerHTML 创建的 `script` 元素，以后也没有办法强制其执行。

#### 动态样式
css 同 js
```js
function loadStyles(url){
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  let head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
}
```

#### MutationObserver
MutationObserver 接口，可以在 DOM 被修改时异步执行回调。使 用 MutationObserver 可以观察整个文档、DOM 树的一部分，或某个元素。此外还可以观察元素属性、子节点、文本，或者前三者任意组合的变化。

##### 基本用法
MutationObserver 的实例要通过调用 MutationObserver 构造函数并传入一个回调函数来创建：
```js
let observer = new MutationObserver(() => console.log('DOM was mutated!'));
```

###### observe()方法
新创建的 MutationObserver 实例不会关联 DOM 的任何部分。要把这个 observer 与 DOM 关 联起来，需要使用 observe()方法。
接收两个必需的参数：要观察其变化的 DOM 节点，以及 一个 MutationObserverInit 对象。
```js
let observer = new MutationObserver(
  () => console.log('<body> attributes changed')
);

observer.observe(document.body, {
  attributes: true
});
```
执行以上代码后， `body` 元素上任何属性发生变化都会被这个 `MutationObserver` 实例发现，然 后就会异步执行注册的回调函数。

###### 回调与 MutationRecord
每个回调都会收到一个 MutationRecord 实例的数组。

###### disconnect 方法
要提前终止执行回调，可以调用 disconnect()方法。
```js
observer.disconnect();
```
> 要想让已经加入任务队列的回调执行，可以使用 setTimeout()让已经入列的回调执行完毕再调用 disconnect()

###### 复用 MutationObserver（MutationRecord 的 target）
多次调用 observe()方法，可以复用一个 MutationObserver 对象观察多个不同的目标节点。此 时，MutationRecord 的 target 属性可以标识发生变化事件的目标节点。
```js
let observer = new MutationObserver(
  (mutationRecords) => console.log(mutationRecords.map((x) => x.target))
);

// 向页面主体添加两个子节点
let childA = document.createElement('div'),
childB = document.createElement('span');

document.body.appendChild(childA);
document.body.appendChild(childB);

// 观察两个子节点
observer.observe(childA, { attributes: true });
observer.observe(childB, { attributes: true });

// 修改两个子节点的属性
childA.setAttribute('foo', 'bar');
childB.setAttribute('foo', 'bar');

// [<div>, <span>]
```

###### 重用 MutationObserver
调用 disconnect()并不会结束 MutationObserver 的生命。还可以重新使用这个观察者，再将 它关联到新的目标节点。

##### MutationObserverInit 与观察范围
粗略地讲，观察者可以观察的事 件包括属性变化、文本变化和子节点变化。

###### 观察属性
要为属性变化注册回调， 需要在 MutationObserverInit 对象中将 attributes 属性设置为 true

attributes 设置为 true 的默认行为是观察所有属性，但不会在 MutationRecord 对象中记 录原来的属性值。如果想观察某个或某几个属性，可以使用 attributeFilter 属性来设置白名单，即 一个属性名字符串数组：
```js
observer.observe(document.body, { attributeFilter: ['foo'] });

// 添加白名单属性
document.body.setAttribute('foo', 'bar');

// 添加被排除的属性
document.body.setAttribute('baz', 'qux');

// 只有 foo 属性的变化被记录了
// [MutationRecord]
```

###### 观察字符数据
MutationObserver 可以观察文本节点（如 Text、Comment 或 ProcessingInstruction 节点） 中字符的添加、删除和修改。 要为字符数据注册回调
需要在 MutationObserverInit 对象中将 characterData 属性设置为 true，
```js
observer.observe(document.body.firstChild, { characterData: true });

// 赋值为相同的字符串
document.body.firstChild.textContent = 'foo';

// 赋值为新字符串
document.body.firstChild.textContent = 'bar';

// 通过节点设置函数赋值
document.body.firstChild.textContent = 'baz';


// 以上变化都被记录下来了
// [MutationRecord, MutationRecord, MutationRecord]
```

将 characterData 属性设置为 true 的默认行为不会在 MutationRecord 对象中记录原来的字符 数据。如果想在变化记录中保存原来的字符数据，可以将 characterDataOldValue 属性设置为 true

```js
observer.observe(document.body.firstChild, { characterDataOldValue: true });
```

> 设置元素文本内容的标准方式是 textContent 属性。Element 类也定义了 innerText 属性，与 textContent 类似。 但 innerText 的定义不严谨，浏览器间的实现也存在兼容性问题，因此不建议再使用了。

###### 观察子节点
要观察子节点，需要在 MutationObserverInit 对象中将 childList 属性设置为 true。

```js
observer.observe(document.body, { childList: true });
```

###### 观察子树
默认情况下，MutationObserver 将观察的范围限定为一个元素及其子节点的变化。可以把观察 的范围扩展到这个元素的子树（所有后代节点），这需要在 MutationObserverInit 对象中将 subtree 属性设置为 true。
```js
observer.observe(document.body, { attributes: true, subtree: true });
```

##### 异步回调与记录队列
MutationObserver 接口是出于性能考虑而设计的，其核心是异步回调与记录队列模型。
为了在 大量变化事件发生时不影响性能，每次变化的信息（由观察者实例决定）会保存在 MutationRecord 实例中，然后添加到记录队列。
这个队列对每个 MutationObserver 实例都是唯一的，是所有 DOM 变化事件的有序列表。

###### 记录队列
每次 MutationRecord 被添加到 MutationObserver 的记录队列时，**仅当之前没有已排期的微任 务回调时（队列中微任务长度为 0），才会将观察者注册的回调**（在初始化 MutationObserver 时传入） **作为微任务调度到任务队列上**。这样可以保证记录队列的内容不会被回调处理两次。
不过在回调的微任务异步执行期间，有可能又会发生更多变化事件。因此被调用的**回调会接收到一 个 MutationRecord 实例的数组，顺序为它们进入记录队列的顺序**。回调要负责处理这个数组的每一 个实例，因为函数退出之后这些实现就不存在了。回调执行后，这些 MutationRecord 就用不着了， 因此记录队列会被清空，其内容会被丢弃。

###### takeRecords()方法
调用 MutationObserver 实例的 takeRecords()方法可以清空记录队列，取出并返回其中的所 有 MutationRecord 实例。
```js
let observer = new MutationObserver(
  (mutationRecords) => console.log(mutationRecords)
);

observer.observe(document.body, { attributes: true });

document.body.className = 'foo';
document.body.className = 'bar';
document.body.className = 'baz';

console.log(observer.takeRecords());  // [MutationRecord, MutationRecord, MutationRecord]
console.log(observer.takeRecords());  // []
```
这在希望断开与观察目标的联系，但又希望处理由于调用 disconnect()而被抛弃的记录队列中的 MutationRecord 实例时比较有用。

##### 性能、内存与垃圾回收
**将变化回调委托给微任务来执行可以保证事件同步触发，同时避免随之而来的混乱。为 MutationObserver 而实现的记录队列，可以保证即使变化事件被爆发式地触发，也不会显著地拖慢浏览器。**
###### 1. MutationObserver 的引用
MutationObserver 实例与目标节点之间的引用关系是非对称的。MutationObserver 拥有对要 观察的目标节点的弱引用。因为是弱引用，所以不会妨碍垃圾回收程序回收目标节点。
然而，目标节点却拥有对 MutationObserver 的强引用。如果目标节点从 DOM 中被移除，随后 被垃圾回收，则关联的 MutationObserver 也会被垃圾回收。

###### 2. MutationRecord 的引用
记录队列中的每个 MutationRecord 实例至少包含对已有 DOM 节点的一个引用。如果变化是 childList 类型，则会包含多个节点的引用。记录队列和回调处理的默认行为是耗尽这个队列，处理 每个 MutationRecord，然后让它们超出作用域并被垃圾回收。
有时候可能需要保存某个观察者的完整变化记录。保存这些 MutationRecord 实例，也就会保存 它们引用的节点，因而会妨碍这些节点被回收。如果需要尽快地释放内存，建议从每个 MutationRecord 中抽取出最有用的信息，然后保存到一个新对象中，最后抛弃 MutationRecord。