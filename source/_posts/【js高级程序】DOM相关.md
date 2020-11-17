---
title: 【js高级程序】DOM相关
date: 2020-11-17 07:21:37
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第14. 15. 16章*

### DOM

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
      - Element p
        - Text Hello world!
        
其中，document 节点表示每个文档的根节点。在这里，根节点的唯一子节点是html元素，我们称之 为文档元素（documentElement）。

> HTML 中的每段标记都可以表示为这个树形结构中的一个节点。元素节点表示 HTML 元素，属性 节点表示属性，文档类型节点表示文档类型，注释节点表示注释。DOM 中总共有 12 种节点类型，这些 类型都继承一种基本类型。

#### Node 类型
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
???
