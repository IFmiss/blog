---
title: web安全-点击劫持
date: 2020-10-14 16:04:12
categories: web安全
tags: [web安全]
---

### 点击劫持
通过覆盖不可见的框架误导受害者点击，比如页面上放置一个frame页面，并设置透明度为0，用户点击按钮的时候（该按钮被攻击者精心准备过，模拟原网页的按钮，诱导用户点击）

### 实现原理
`iframe` 透明嵌入到网页中，诱导用户点击

### 应对方法
#### 针对`iframe`内嵌可以设置 `X-Frame-Options`
X-Frame-Options HTTP 响应头是用来给浏览器指示允许一个页面可否在 &lt;frame&gt;, &lt;iframe&gt; 或者 &lt;object&gt; 中展现的标记。网站可以使用此功能，来确保自己网站的内容没有被嵌套到别人的网站中去，也从而避免了点击劫持 (clickjacking) 的攻击。

```nginx
add_header  x-frame-options  SAMEORIGIN;
```
请求头设置 `SAMEORIGIN`
- `DENY`
不允许在frame中展示，即便是在相同域名的页面中嵌套也不允许
- `SAMEORIGIN`
该页面可以在相同域名页面的frame中展示
- `ALLOW-FROM uri`
指定来源的frame中展示，逗号分割设置多选域名
```nginx
add_header X-Frame-Options "ALLOW-FROM http://w1.daiwei.com/,https://www.daiwei.site";
```
