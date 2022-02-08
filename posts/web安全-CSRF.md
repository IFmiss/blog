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
##### cookie 的 SameSite 属性
  - `Strict` 完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie
  - `Lax` 规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外。导航到目标网址的 GET 请求，只包括三种情况：链接，预加载请求
  - `None` Chrome 计划将Lax变为默认设置。这时，网站可以选择显式关闭SameSite属性，将其设为None。不过，前提是必须同时设置Secure属性（Cookie 只能通过 HTTPS 协议发送），否则无效。
    下面设置无效
    ```bash
      Set-Cookie: widget_session=abc123; SameSite=None
    ```
    下面的设置有效。
    ```bash
      Set-Cookie: widget_session=abc123; SameSite=None;Secure;
    ```
##### 验证 HTTP Referer
正常的referer来源是自己的网站，如果第三方网站伪造请求，请求的 referer 和自己的网站来源是不一致的

##### 使用token 验证
使用token验证，服务端以某种策略生辰随机字符串，存在 readis 作为key保存，客户端请求头携带token，服务端通过token在readis查询是否匹配，再执行后续的业务操作，相较于cookie在执行http请求时，token 更安全而且不会被站外作为请求头的字段提交（Local / session storage 不会跨域工作）


[跨站请求伪造—CSRF](https://segmentfault.com/a/1190000021114673)

[Cookie 的 SameSite 属性](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)
