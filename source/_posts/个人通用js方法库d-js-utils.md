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
d-js-utils主要分为五大模块
- `dom`
  该属性主要时针对dom元素相关的方法，针对于元素的一些操作

- `store`
  该属性主要是对于数据的操作

- `exp`
  该属性是d-js-utlis里的一个属性，此属性包含对于一些字符，或者元素判断是否符合要求

- `utils`
  其他相关js工具代码

- `device`
  设备相关的检测与方法

## 相关地址
[文档地址: https://ifmiss.github.io/d-js-utils/](https://ifmiss.github.io/d-js-utils/)
[项目地址: https://github.com/ifmiss/d-js-utils/](https://github.com/ifmiss/d-js-utils/)

## 快速使用
#### 安装
使用npm安装 `d-js-utils` 依赖
```bash
npm i d-js-utils
```

或者直接引用js
```html
<script src="www.daiwei.org/d-js-utils.js"></script>
<script>
  Dutils.dom.addClass(document.body, 'd-js-utils')
</script>
```

#### 使用
引入`d-js-utils.js`可直接使用其方法
```js
import Dutils from 'd-js-utils'
Dutils.dom.addClass(document.body, 'd-js-utils')
```
