---
title: 关于ruby安装 sass compass报错的问题
date: 2016-11-20 12:03:28
categories: css相关
tags: [css]
---

最近硬盘损坏系统被迫重做,之前所有的代码环境,都得重新配置,其中在安装sass compass需要用到ruby的情况下就一直没办法安装成功,真的三个晚上的研究,终于找到真相了!
之前报错原因如下:
```js
Error fetching https://ruby.taobao.org/:
SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed (https://gems.ruby-china.org/specs.4.8.gz)
```

网上查了下,说是被墙了,解决方法就是,把之前的源给删除掉,用淘宝的源:
```npm
gem sources –remove https://rubygems.org/    // 删除原来的地址
```

```npm
gem sources -a https://ruby.taobao.org/
```

换完了之后我以为这样就可以了, gem install sass还是报错

```js
Error fetching http://ruby.taobao.org/:
bad response Not Found 404 (http://ruby.taobao.org/specs.4.8.gz)
```

找了好久发现:
taobao Gems 源已停止维护，现由 ruby-china 提供镜像服务
最后就是换了一个源地址
```code
gem sources -a https://gems.ruby-china.org/
```
就可以了,就成功了,所以源地址已经更新到 ruby-china 了