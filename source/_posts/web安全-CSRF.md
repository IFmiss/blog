---
title: web安全-CSRF
date: 2020-10-14 16:03:01
categories: web安全
tags: [web安全]
---

### CSRF（Cross—Site Request Forgery）跨站点请求伪造

CSRF 和 XSS 一样，存在巨大危害性，XSS 是利用站点对于资源的信用进行安全攻击，CSRF 则是利用信任网站的用户信息在自己的恶意网站上请求A的服务并携带来自A的用户信息（cookie），执行恶意代码

### 攻击方式
- 用户 在 可信用的网站 A 上登陆自己的账号密码，服务端下发cookie作为用户信息识别的方式
- 此时在用户未退出登陆之前，访问网站 B
- B网站加载一个资源请求 如一张带有特殊地址的图片资源
  ```html
    <img src="http://a.com/getMoney?name=dw&from=c" />
  ```
  此时 B网站会发起一个资源请求并携带request 的cookie信息请求网站A的服务，达成自身目的

### 应对方法
- 使用token
- 
