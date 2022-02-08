---
title: html页面在360极速浏览器兼容模式显示问题解决方法
date: 2016-9-13 12:51:37
categories: html
tags: [小技巧]
---

自己在写一个页面的时候,涉及到一些css3动画的效果,在360极速兼容模式上显示出现问题:
```html
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE10" />
<meta name="renderer" content="webkit|ie-comp|ie-stand">
```
这样就基本上解决了大多在360极速模式上出现的问题!
