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
![style资源](https://www.daiwei.site/static/blog/Content-Security-Policy/style_src.png)
css 本地临时地址 http://localhost:1996/css/app-af63c014edc89c09025e.css 直接被视为具有安全隐患的资源地址从而会被拒绝，而 https://www.daiwei.site/web_next/_next/static/css/styles.33733be0.chunk.css 则可以正常加载

再看这两个iframe
![iframe](https://www.daiwei.site/static/blog/Content-Security-Policy/meta1.png)
上面的加载失败（http://www.daiwei.site）
下面的加载成功 （http://www.daiwei.site）
原因就是 child-src 设置只允许 https 的协议访问

具体报错截图
![iframe_error](https://www.daiwei.site/static/blog/Content-Security-Policy/meta_error.png)

至于 script-src 'self' 表示 指向与要保护的文件所在的源，包括相同的 URL scheme 与端口号。必须有单引号。一些浏览器会特意排除 blob 与 filesystem 。需要设定这两种内容类型的站点可以在 Data 属性中进行设定。

### 服务端配置
```nginx
add_header  Content-Security-Policy "default-src 'self';";
```
这表示视，音频，图片，css，js，等必须是同域名且同协议且同端口号
此时我访问 https://www.daiwei.site; (忽略serviceworker 报错)
![设置default-src 'self'](https://www.daiwei.site/static/blog/Content-Security-Policy/nginx_csp_self.png)
引入google 的字体直接被拒绝，以及从二级域名引入的图片地址也会被拒绝，此时设置；

```nginx
add_header  Content-Security-Policy "default-src 'self' https://*.daiwei.site;
              img-src  'self' https://www.bing.com https://*.daiwei.site;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.daiwei.site;
              font-src 'self' https://*.daiwei.site https://fonts.gstatic.com;
              style-src 'self' https://*.daiwei.site 'unsafe-inline' https://fonts.googleapis.com;";
```
配置之后
![设置csp](https://www.daiwei.site/static/blog/Content-Security-Policy/config_result.jpg)
nginx_conf_result

资源请求头可以看到 `Content-Security-Policy` 的配置信息
res_header_csp
![设置csp](https://www.daiwei.site/static/blog/Content-Security-Policy/res_nginx_conf.png)

### 资源加载配置（具体可查看mdn详解）
- [default-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/default-src): 指令可以为其他 CSP 拉取指令（fetch directives）提供备选项。对于以下列出的指令，假如不存在的话，那么用户代理会查找并应用 default-src 指令的值。
- [child-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/child-src): 定义了Web worker的有效源以及使用诸如和元素加载的嵌套浏览上下文
  - frame
  - iframe
- [connect-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/connect-src): 用于控制允许通过脚本接口加载的链接地址。其中受到影响的API如下:
  - a标签， ping
  - Fetch 请求
  - XMLHttpRequest
  - WebSocket
  - EventSource
- [font-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/font-src): 指令定义了 @font-face 加载字体的有效源规则。
- [frame-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/frame-src): 嵌套浏览上下文使用元素如加载指令指定有效来源 (child-src 也可使用)
  - frame
  - iframe
- [img-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/img-src): 图片以及 favicons 加载指令指定有效来源
  - img
  - favicons
- [manifest-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/manifest-src): HTTP指令指定可以将哪些清单应用于资源
- [media-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/media-src): 用于加载媒体的有效源
  - video
  - audio
- [object-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/object-src): 该HTTP指令指定的有效来源，和元素。
  - object
  - embed
  - applet
- [script-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/script-src): js执行脚本指定有效来源
  - script
- [style-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/style-src): stylesheet样式有效来源
  - link stylesheet
- [worker-src](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/worker-src): 指令指定的有效来源Worker，SharedWorker或ServiceWorker脚本

### 资源配置选项值
##### 'self'
指提供受保护文档的来源，包括相同的URL方案和端口号。您必须包括单引号。一些浏览器特别排除blob和filesystem从源代码指令。需要允许这些内容类型的站点可以使用Data属性指定它们。

##### 'unsafe-eval'
允许使用eval()和类似的方法从字符串创建代码。您必须包括单引号。

##### 'unsafe-hashes'
允许启用特定的内联事件处理程序。如果您只需要允许内联事件处理程序而不是内联 `script` 元素或javascript:URL，则这是比使用unsafe-inline表达式更安全的方法。

##### 'unsafe-inline'
允许使用内联资源，例如内联 `script` 元素，javascript:URL，内联事件处理程序和内联 `style` 元素。单引号是必需的。

##### 'none'
指空集；也就是说，没有URL匹配。单引号是必需的。

##### 'nonce- &lt;base64-value&gt;'
使用加密随机数（使用一次的数字）的特定内联脚本的允许列表。服务器每次发送策略时都必须生成一个唯一的随机数值。提供难以猜测的随机数至关重要，因为绕开资源策略是微不足道的。有关示例，请参见不安全的内联脚本。指定随机数会使现代浏览器忽略'unsafe-inline'，但仍可以为没有随机数支持的旧版浏览器设置该随机数。

##### '&lt;hash-algorithm&gt;-&lt;base64-value&gt;'
脚本或样式的sha256，sha384或sha512哈希。此源的使用由两部分组成，并用破折号隔开：用于创建哈希的加密算法和脚本或样式的base64编码哈希。生成哈希值时，请勿包含 `script` 或 `style` 标记，并注意大小写和空格很重要，包括前导或尾随空格。有关示例，请参见不安全的内联脚本。在CSP 2.0中，这仅适用于内联脚本。script-src对于外部脚本，CSP 3.0允许它。
...

### 注意的点
- 多个值也可以并列，用空格分隔。
- 如果同一个限制选项使用多次，只有第一次会生效。
- `script-src` 和 `object-src` 是必设的，除非设置了 `default-src`。因为攻击者只要能注入脚本，其他限制都可以规避。而object-src必设是因为 Flash 里面可以执行外部脚本。
- `script-src` 不能使用 `unsafe-inline` 关键字（除非伴随一个nonce值），也不能允许设置data:URL。
  ```html
  <img src="x" onerror="evil()">
  <script src="data:text/javascript,evil()"></script>
  ```
- 特别注意 JSONP 的回调函数。
  ```html
  <script src="/path/jsonp?callback=alert(document.domain)//"></script>
  ```

### 参考于

[Locking Down Your Website Scripts with CSP, Hashes, Nonces and Report URI](https://www.troyhunt.com/locking-down-your-website-scripts-with-csp-hashes-nonces-and-report-uri/)

[Content-Security-Policy - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)

[Content Security Policy 入门教程](http://www.ruanyifeng.com/blog/2016/09/csp.html)
