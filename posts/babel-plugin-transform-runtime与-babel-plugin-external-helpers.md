---
title: '@babel/plugin-transform-runtime与@babel/plugin-external-helpers'
date: 2020-07-09 22:07:37
categories:
tags:
---

### 先来看看 `@babel/preset-env`
作为 babel config 的预设工具， @babel/preset-env 可以根据当前的运行环境，确定所需要的plugin和polyfill
```js
presets: [
  [
    "@babel/preset-env", {
      modules: false,
      useBuiltIns: false
    }
  ],
],
```
主要是这个 `useBuiltIns` 的使用
> 此选项配置如何@babel/preset-env处理polyfills， "usage"| "entry"| false，默认为false。

`usage` 会参考当前运行环境和代码使用到的特性自动做 polyfill，无需其他配置
`entry` 需要手动配置 polyfills 入口，可以配置单个特性的引入，也可以直接手动引入 polyfill（会有多余转换代码引入）
`false` 不引入polyfill

### 再看 `@babel/plugin-transform-runtime`
`@babel/plugin-transform-runtime` 是一个babel插件
1. 会直接引入`@babel/runtime`下的helper的通用函数， 避免在编译后的输出中出现重复。运行时将被编译到您的构建中的问题，依赖 `@babel/runtime`
2. 其次是为代码创建一个沙盒环境，提供了诸如内置插件Promise，Set和Map那些会污染全局范围的特性，防止污染全局作用域

### `@babel/plugin-external-helpers`
用来生成一段代码，包含 babel 所有的 helper 函数，这些函数都放在 `@babel/helpers`，如果 babel 编译的时候检测到某个文件需要这些 helpers，在编译成模块的时候，会放到模块的顶部，如果不设置引入通用的 helper.js 则会导致代码重复，
引入通用js的方式:
1.生成 helpers.js 文件，
```code
node_modules/.bin/babel-external-helpers > helpers.js
```
2.配置babel.config.js
```js
plugins: "plugins": [
  "@babel/plugin-external-helpers"
]
```
3.主入口引入 script.js
```js
require('./helpers.js');
// ...
```

> 如果使用了 transform-runtime，则不需要生成 helpers.js 文件

### 参考于
https://babeljs.io/docs/en/babel-runtime
https://babeljs.io/docs/en/babel-plugin-external-helpers
https://babeljs.io/docs/en/babel-plugin-transform-runtime/

