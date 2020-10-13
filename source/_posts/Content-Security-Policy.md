---
title: Content-Security-Policy
date: 2020-10-14 00:00:57
categories: web安全
tags: [javascript, html]
---

基于 XSS 的解决方案，Content-Security-Policy（CSP 内容安全策略） 可以根本性的解决跨站脚本攻击，由开发者自己定义网页中的（script，style，iframe，font，img 等）资源请求的配置信息，可理解为资源请求的白名单配置

CSP 的主要目标是减少和报告 XSS 攻击 ，XSS 攻击利用了浏览器对于从服务器所获取的内容的信任。恶意脚本在受害者的浏览器中得以运行，因为浏览器信任其内容来源，即使有的时候这些脚本并非来自于它本该来的地方。

### 设置方式
- meta标签设置
- 服务端配置 Content-Security-Policy

### meta 设置
```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'; style-src daiwei.site; child-src https:">
```
这里表示：当前页面只允许加载同域的script 脚本, 不允许加载object 嵌入地址，style样式的引入只允许 daiwei.site 域名下加载

如图
style_src
css 本地临时地址 http://localhost:1996/css/app-af63c014edc89c09025e.css 直接被视为具有安全隐患的资源地址从而会被拒绝，而 https://www.daiwei.site/web_next/_next/static/css/styles.33733be0.chunk.css 则可以正常加载

再看这两个iframe
上面的加载失败（http://www.daiwei.site）
下面的加载成功 （http://www.daiwei.site）
原因就是 child-src 设置只允许 https 的协议访问

具体报错截图
meta_error

至于 script-src 'self' 表示 指向与要保护的文件所在的源，包括相同的 URL scheme 与端口号。必须有单引号。一些浏览器会特意排除 blob 与 filesystem 。需要设定这两种内容类型的站点可以在 Data 属性中进行设定。

### 服务端配置


### 资源加载配置
default-src:
child-src:
connect-src:
font-src:
frame-src:
img-src:
manifest-src
media-src
object-src
script-src
style-src
worker-src

### 资源配置选项值

### 注意的点
多个值也可以并列，用空格分隔。
如果同一个限制选项使用多次，只有第一次会生效。




[https://www.troyhunt.com/locking-down-your-website-scripts-with-csp-hashes-nonces-and-report-uri/](123123)

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/default-src