---
layout: posts
title: css3的blur如何消除边缘透明效果
date: 2018-12-03 10:02:47
categories: css相关
tags: [css]
---

我们都知道css3的功能强大之处，大多数也用过blur的属性去模拟ios的磨砂效果，web页面中，ios有自带磨砂效果的css属性，那就是
```css
  backdrop-filter：blur(10px);
```
但是该css属性并不支持ios以外的设备，所以我们能做的只是通过blur来实现类似的显示效果
```css
  filter: blur(10px);
  -webkit-filter: blur(10px);
```
但是
**该属性是有一个问题的，当blur的数值很大的时候，其元素周边会有半透明的效果，底部的背景色会被看到**，前一段时间在做这个效果的时候看到一个解决方法，觉得确实很灵性，代码如下
```scss
// 添加blur模糊效果
// 如果不是绝对定位，父元素需要设置相对定位
// $blur 为模糊的数值
// $height 区域的高度
// $position 为位置 默认50%
@mixin blur($blur, $height: auto, $position: 50%, $scale: 1.5) {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: $position;
	-webkit-filter: blur($blur);
	filter: blur($blur);
	-webkit-transform: scale($scale);
	transform: scale($scale);
	overflow: hidden;
	@if ($height == auto) {
		bottom: 0;
	}
	@else {
		height: $height;
	}
}
```
比如我想让class为test-blur的元素设置背景虚化效果(该元素的夫元素必须要设置超出隐藏)
```scss
.test-blur {
  @include blur(20px);
}
```