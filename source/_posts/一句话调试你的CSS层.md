---
title: 一句话调试你的CSS层
date: 2017-10-12 12:08:46
categories: javascript
tags: [小技巧]
---

这是我在网上看到的一篇文章这段代码是谷歌“名猿”Addy Osmani放出来的
```js
[].forEach.call($$("*"),function(a){  a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16) });    //选取所有的元素，给每个元素加个边框(随机色)
```
执行所有的dom元素添加一个随机的outline
