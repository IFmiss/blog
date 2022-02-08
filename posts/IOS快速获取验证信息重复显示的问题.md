---
title: IOS快速获取验证信息重复显示的问题
date: 2019-03-08 22:49:21
categories: javascript
tags: [小技巧, js]
---

IOS下在获取手机号短信验证码的时候，ios在键盘上会自动显示验证码内容，以达到快速填写的功能，但是正常的input输入框会重复显示
- 
解决方法
```html
<input maxlength="6" type="text">
```
input的maxlength属性设置一个最大值，4 或者 6 等等，验证码多少位值设置为多少
