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

### 配置
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
![css-module显示效果](https://www.daiwei.site/static/blog/css-module/css-module显示效果.png)
编辑结果如下
![css 编译结果](https://www.daiwei.site/static/blog/css-module/css编译结果.png)

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
![localIdentName 生成的结果](https://www.daiwei.site/static/blog/css-module/localIdentName生成的结果.png)
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
> - use '[path][name]__[local]' for development
> - use '[hash:base64]' for production

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

#### mode ("local" | "global" | "pure")
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
还有一些其他的属性，暂时不研究其具体的意义了（主要是不清楚...）
#### hashPrefix `string`
#### getLocalIdent 
#### localIdentRegExp

### 使用
基本的使用方式前面已经展示了，需要在具体研究一下 `css-module` 的使用方法
- 选择器作为变量引入到class名
- 全局作用域
```less
:global {
  .main {
    color: #fff;
    padding: 4px 15px;
    background: rgb(163, 25, 25);
    border-radius: 4px;
  }
  .text {
    color: gray;
    font-size: 16px;
    font-weight: bold;
  }
}
```
这段代码在webpack编译之后和之前没什么区别，会在所有 class 为 `main`, `text` 的元素上生效，此时对于这种类型， `styles.className` 的这种写法是不生效的，因为 styles 对象，是一个空对象
![global的class为空对象](https://www.daiwei.site/static/blog/css-module/global的class为空对象.png)
如果需要引入对象只需要引入对应的 class 字符串即可

- 局部作用域
```less
:local {
  .main {
    color: #fff;
    padding: 4px 15px;
    background: rgb(163, 25, 25);
    border-radius: 4px;
  }
  .text {
    color: gray;
    font-size: 16px;
    font-weight: bold;
  }
}
```
`:local .main` 的使用方式和直接使用 `.main` 实际上是一致的效果，都会生成 `option.localIdentName` 定义的class格式

- class 继承
```less
.main {
  color: #fff;
  padding: 4px 15px;
  background: rgb(163, 25, 25);
  border-radius: 4px;
  &:hover {
    background: blue;
  }
  &::before {
    content: 'hi css module';
    background: green;
  }
}
.text {
  composes: main;
  color: gray;
  font-size: 16px;
  font-weight: bold;
}
```
同样的代码，text 类下通过 `composes: main;` 引入想要继承的类名称，就可以实现属性，以及伪类，伪元素的继承
![className继承](https://www.daiwei.site/static/blog/css-module/className继承.png)
而实际上对应的 class 类的对象信息如下
![class继承对应的对象名称](https://www.daiwei.site/static/blog/css-module/class继承对应的对象名称.png)
`text`属性的第二个 class名称 对应 `main` 的class名称，因为有共同的样式效果

- class 继承（来自外部文件的继承方式）
```less
// auto.less
.auto {
  background: #14f3b0;
  font-size: 14px;
}
```
```less
// index.less
.main {
  color: #fff;
  padding: 4px 15px;
  background: rgb(163, 25, 25);
  border-radius: 4px;
  &:hover {
    background: blue;
  }
  &::before {
    content: 'hi css module';
    background: green;
  }
}
.text {
  composes: auto from './auto.less';
  color: gray;
  font-size: 16px;
  font-weight: bold;
}
```
`text` 元素会引入 auto.less 的 auto类的样式，设置背景色为翠绿色,如下图:
![class继承来自外部文件](https://www.daiwei.site/static/blog/css-module/class继承来自外部文件.png)
此时 this is text 元素的class名称可以看到 `components-Module-auto__auto` 一个来自 components 的 Module文件下的 auto.less 样式文件的 auto 类

- 变量的引入
尝试在 auto.less 中使用变量达到方便维护和开发的效果
```less
@color: #14f3b0;
.auto {
  background: @color;
  font-size: 14px;
}
```
引入的时候发现并没有效果，样式被编译成了
```css
.components-Module-auto__auto--KJeL5 {
    background: @color;
    font-size: 14px;
}
```
`@color` 并没有被转换成对应的色值， 不过css-loader 支持变量定义, 来看代码
```less
@value v-auto-color #14f3b0;
@value s-auto-select auto;
@value m-lg (min-width: 960px);
.s-auto-select {
  background: v-auto-color;
  font-size: 14px;
}
@media m-lg {
  body {
    background: #000;
  }
}
```
官方推荐命名：
v-： 变量
s-： 选择器
m-： 媒体查询

[CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
[webpack/css-loader](https://www.webpackjs.com/loaders/css-loader/)
[css-loader](https://github.com/webpack-contrib/css-loader#modules)
[CSS module 入门](https://segmentfault.com/a/1190000014722978)
