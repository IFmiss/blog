---
title: 【面试题】css
date: 2021-03-30 15:42:03
categories: css
tags: [css, 面试]
---

### BFC

- 定义
  BFC 即 Block Formatting Contexts (块级格式化上下文)
  可理解为单个的独立容器，其样式不会影响到外部元素。

- 如何触发
  - **float 的值不为 none**
  - **overflow 的值不为 visible**
  - **display 为 inline-block, table-cell, table-caption, flex, inline-flex**
  - **position 为 fixed，absolute**

### div 水平垂直居中

- absolute + margin-left ｜ top
- flex
- grid
- absolute + translate
- table-cell
- line-height

### CSS 盒模型

- 标准盒模型 width = content (`box-sizing: content-box`)
- IE 盒模型 width = padding + border + content (`box-sizing: border-box`)

### flex: 0 0 100px 是什么意思

- `flex-grow`
  取值：默认 0，用于决定**项目在有剩余空间的情况下是否放大**，默认不放大；注意，即便设置了固定宽度，也会放大。
- `flex-shrink`
  默认 1，用于决定**项目在空间不足时是否缩小**，默认项目都是 1，**即空间不足时大家一起等比缩小**；注意，即便设置了固定宽度，也会缩小。设置为 0，则即便空间不够，自身也不缩小。
- `flex-basis`
  取值：默认 auto，用于设置项目宽度，默认 auto 时，项目会保持默认宽度，或者以 width 为自身的宽度，**但如果设置了 flex-basis，权重会 width 属性高，因此会覆盖 widtn 属性。**

`flex: 0 0 100px` 则表示项目无论有多大空间，不放大，不缩小，始终保持 100px

### 为什么要使用 transform 而不是 margin-left,right

`transform` 是独立的层，margin 则会导致重绘回流。

**transform 原理**
transform 是通过创建一个 RenderLayers(渲染) 合成层，拥有独立的 `GraphicsLayers`(绘图层)。每一个`GraphicsLayers`都有一个一个 `Graphics Context`, 其对应的 `GraphicsLayers` 会 paint 进 `Graphics Context` 中，合成器会最终负责将由 `Graphics Context` 输出的位图合并成最终的屏幕展示图案。

`transform` 发生在 `Composite Layer` 这一步，他所引起的 paint 也只是发生在单独的 `GraphicsLayer` 中，不会引起整个页面的回流重绘。

### 清除浮动的方式

```html
<div class="parent">
  <div class="float"></div>
  <div class="float"></div>
</div>
```

- 添加一个空 div，利用 css 提高的 clear:both 清除浮动，让父级 div 能自动获取到高度。（也可以基于 parent 添加伪元素设置）
- 父级 div 定义 overflow:hidden
- 手动设置父元素高度
- 利用 BFC，BFC 计算高度时，浮动元素也可以参与计算，因此清除浮动，只需触发一个 BFC 即可。（上面的设置 overflow: hidden 就是）

### 通过 link 引入的 css 会阻塞页面渲染吗？

link 标签不会阻塞 DOM 解析，但会阻塞 DOM 渲染。

浏览器会并行解析 DOM Tree，和 CSSOM Tree，DOM Tree 解析不依赖于 link，但是 render Tree 依赖于前两者，等 Dom Tree， CSSOM Tree 解析完毕之后才能合成 render Tree。

### CSS 预处理带来的好处

- 语法强大，可执行执行嵌套，或循环的一些操作。
- 常用代码使用代码块，节省大量代码。
- 变量，混入提升代码复用性。
- 额外的颜色函数。

> 问题则是编译 css 需要时间。

### inline 的元素能设置宽高、margin 属性吗

inline 元素不能设置宽高，外边距只能设置左- 右，不能设置上下

### CSS 选择器

**`div p`** : 所有`div` 下的所有的 `p` 标签

**`div > p`** : 所有 `div` 下第一层所有的 `p` 标签

**`div + p`** : 所有 `div` 的兄弟 `p` 标签 (必须位于 div 同级别的后方)

**`div ~ p`**: : 所有 `div` 的兄弟 `p` 标签 (必须位于 div 同级别的前方)

**`[title~=flower]`** : 选择 title 属性包含单词 "flower" 的所有元素。**必须是字符快**

- `title="tulip flower ab"` 里面的三个都行，但是 `lower` 就不行

**`[lang|=en]`** : 选择 lang 属性值以 "en" 开头的所有元素。

**`a[href^="https"]`** : 选择 href 属性值以 "https" 开头的所有 a 元素。

**`a[href$=".pdf"]`** : 选择 href 属性值以 "pdf" 结尾的所有 a 元素。

**`a[href*="abc"]`**: 选择其 href 属性值中包含 "abc" 子串的每个 a 元素。
