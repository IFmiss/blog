---
title: webpack4.0 安装 extract-text-webpack-plugin 报错
date: 2018-3-16 11:59:00
categories: 环境配置
tags: [webpack, npm]
---

最近研究webpack相关配置在搭建通用的webpack项目时候用到extract-text-webpack-plugin，npm install extract-text-webpack-plugin –save-dev之后run 这个项目的时候发现服务启动出错，查找原因后发现，由于webpack升级到4.0以后，extract-text-webpack-plugin默认安装的是3.几的版本，于是执行下面命令行

``` npm
npm install extract-text-webpack-plugin@next
```

再次尝试运行项目就可以成功跑起来了
