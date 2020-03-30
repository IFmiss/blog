---
title: css-module
date: 2020-03-30 00:05:24
categories: css
tags: css
---

### 产生的背景
一个好看的网页 css 样式密不可分，网页中标签的颜色，字体，背景，动画，等等都是用css控制实际的展示效果，通过标签，类名称等不同选择器定义css样式，但久而久之，项目越来越大的时候，不同组件，不同标签之间样式可能会被污染，影响实际展示效果

### 实际项目中出现的问题
- 样式被覆盖
- class 名称过长

### 使用
css module 目前有四种方式集成到项目，具体请看 https://github.com/css-modules/css-modules/blob/master/docs/get-started.md ， 我们主要学习 webpack 中在css-loader的使用

#### 通过 css-loader 配置支持 css module实现
```ts
[
  {
    test: /\.less$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true
        }
      },
      "less-loader",
      {
        loader: 'style-resources-loader',
        options: {
          patterns: path.resolve(__dirname, './../src/styles/val.less')
        }
      }
    ],
  },
]
```
设置 css-loader 的 `options.modules` 为true 配置css module支持

由于我是在 less中使用，且环境是ts的开发环境，所以在不做设置的情况下，通过css-module 的方式引入less文件会报错

```less
// module.less
.main {
  color: #fff;
  padding: 4px 15px;
  background: rgb(163, 25, 25);
  border-radius: 4px;
}
```

```tsx
// module.tsx
import React from 'react'
import styles from './index.less'

console.log(styles) // {main: "zEvk6qCVDzWwH0LgzL_3-"}

export default () => {
  return (
    <span className={styles.main}>hello</span>
  )
}
```
css-module给 span 元素生成一个独一无二的全局 class 名称 `zEvk6qCVDzWwH0LgzL_3-` ，这样就不会受全局样式命名冲突的影响，使用`styles.main` 即可拿到class 名称， 实际的效果如下
<!-- ![parser 解析结果](https://www.daiwei.site/static/blog/babel/babel-parse-1.png) -->
<!-- ![css 编译结果](https://www.daiwei.site/static/blog/babel/babel-parse-1.png) -->

> 注意： 由于我使用的是 ts 开发环境，在以es6 引入的方式引入 less文件的时候，会被提示，index.less不是模块，网上看了一下，顶一下 *.less 模块就可以了，[来自这里](https://stackoverflow.com/questions/57635943/how-do-i-make-import-as-style-from-from-x-less-work)，代码如下
```ts
// global.d.ts
declare module '*.less' {
  const classes: {[key: string]: string};
  export default classes;
}
```

#### localIdentName 生成的class标识符
继续之前的操作，在默认不配置 `localIdentName` 的时候，返回的随机class 名称为: `zEvk6qCVDzWwH0LgzL_3-`， 为了统一风格和可读性，我们定义一种class命名格式
```ts
{
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
    }
  }
},
```
生成的结果
<!-- ![localIdentName 生成的结果](https://www.daiwei.site/static/blog/babel/babel-parse-1.png) -->
结果为： `src-components-Module-index__text--3iAYn`
[path]: src/components/Module
[name]: index
[local]: text
[hash:base64:5]: 3iAYn

- [name] 资源的基本名称
- [path] 资源相对于context查询参数或选项的路径。
- [local] 当前定义的类名称
- [hash:base64:5] base64前5个字符转hash
至于其他的 标识 名，见 https://github.com/webpack/loader-utils#interpolatename

> Recommendations: 
  - use '[path][name]__[local]' for development
  - use '[hash:base64]' for production

#### context 设置上下文
```ts
{
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
      context: path.resolve(__dirname, './../src')
    }
  }
},
```
添加context之后，path的目录就是给予src开始，其结果为 `components-Module-index__text--Tnlj5`
[path]: src/components/Module
[name]: index
[local]: text
[hash:base64:5]: 3iAYn
除去最后的 hash 不管， name，local 没发生变化，变化的只是 path ， path 的 context 发生了变化

#### mode （'local' ｜ 'global'）
```ts
{
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
      context: path.resolve(__dirname, './../src'),
      // Using `local` value has same effect like using `modules: true`
      mode: 'local'
    }
  }
},
```
其他几个尝试了一下并没有什么效果，还需要再研究一下
#### hashPrefix `string`
#### getLocalIdent 
#### localIdentRegExp



[CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
[webpack/css-loader](https://www.webpackjs.com/loaders/css-loader/)
[css-loader](https://github.com/webpack-contrib/css-loader#modules)
[CSS module 入门](https://segmentfault.com/a/1190000014722978)
