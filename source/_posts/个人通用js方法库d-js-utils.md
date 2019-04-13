---
title: 个人通用js方法库d-js-utils
date: 2018-12-10 12:56:53
categories: 通用组件或工具
tags: [js]
---

![d-js-utils](个人通用js方法库d-js-utils/bg.png)
从刚开始做前端开发开始，就有想过收集一些通用的js方法，或者平时自己写的觉得不错的一些方法，然后收集起来，方便以后使用，但是刚开始虽然收集了一些通用方法，但是在使用过程中相对比较麻烦，随着npm项目管理以及webpack工具在现在的项目中必不可少，开始寻思收集一些通用的js方法，并发布到npm，等以后什么项目用到了直接npm install 就可以直接使用了，方便，而且也是一个很好的累积过程
<!-- more -->
## 产生的原因
从刚开始做前端开发开始，就有想过收集一些通用的js方法，或者平时自己写的觉得不错的一些方法，然后收集起来，方便以后使用，但是刚开始虽然收集了一些通用方法，但是在使用过程中相对比较麻烦，随着npm项目管理以及webpack工具在现在的项目中必不可少，开始寻思收集一些通用的js方法，并发布到npm，等以后什么项目用到了直接npm install 就可以直接使用了，方便，而且也是一个很好的累积过程

## 关于d-js-utils
该方法一共包含以下属性，每个属性收集了对应的方法内容

- `DomUtils`
  该属性主要时针对dom元素相关的方法，针对于元素的一些操作

- `DeviceUtils`
  设备相关的检测与方法

- `StoreUtils`
  该属性主要是对于数据的操作

- `HttpRequestUtils`
  基于axios请求的封装

- `ExpUtils`
  该属性是d-js-utlis里的一个类，此属性包含对于一些字符，或者元素判断是否符合要求

- `GenericUtils`
  其他相关js工具代码，通用工具类

- `LogUtils`
  日志相关

- `PerformanceUtils`
  浏览器性能相关

- `UrlUtils`
  url地址的一系列操作

- `WeixinUtils`
  微信jssdk相关的方法

- `ImageUtils`
  图片合成相关

## 相关地址
[文档地址: https://ifmiss.github.io/d-js-utils/](https://ifmiss.github.io/d-js-utils/)
[项目地址: https://github.com/ifmiss/d-js-utils/](https://github.com/ifmiss/d-js-utils/)

## 快速使用
#### 安装 （1.1.14及以上的版本）
使用npm安装 `d-utils` 依赖
```bash
npm i @dw/d-utils
```
yarn
```hash
yarn add @dw/d-utils
```
#### 使用
获取所有方法
```js
import Dutils from '@dw/d-utils'
Dutils.DomUtils.addClass(document.body, 'd-utils')
```
按需引入
```js
import { DomUtils, LogUtils } from '@dw/d-utils'
DomUtils.addClass(document.body, 'd-utils')
LogUtils.logInfo('d-utils')
```

直接引用js
```html
<script src="www.daiwei.org/d-utils.js"></script>
<script>
  Dutils.DomUtils.addClass(document.body, 'd-utils')
</script>
```
复制一下代码在控制台打印一下，看会有什么变化
```js
Dutils.DomUtils.cssFilter(document.body, 'grayscale', 1)
```
```js
Dutils.GenericUtils.openFullScreen(document.getElementsByTagName('html')[0])
```
```js
Dutils.GenericUtils.exitFullScreen()
```
