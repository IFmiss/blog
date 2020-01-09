---
title: babel
date: 2020-01-09 23:20:09
categories:
tags:
---

Babel 是一个 JavaScript 编译器

### 作用
- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的特性 @babel/polyfill
- 源码转换

### babel工作流
#### @babel/parser 解析
`@babel/parser` 负责将字符串代码转解析为 `抽象语法树（AST）` 是Babel中使用的JavaScript解析器
```js
const code = `
  const fn = () => {
    alert('hello babel')
  }
`

const parseObj = require("@babel/parser").parse(code)
console.log(parseObj)
```
会生成以下树形结构
<!-- babel-parse-1 -->

具体生成效果可以访问 https://astexplorer.net/ 试一试

@babel/parser
- 默认情况下启用最新的ECMAScript版本
- 支持JSX，Flow，Typescript
- 支持stage-0开始 （从 Babel v7 开始，所有针对处于标准提案阶段的功能所编写的预设（stage preset）都已被弃用）

@babel/parser 暴露两个方法，分别是
#### babelParser.parse(code, [options])
babel代码解析，返回AST抽象语法树

#### babelParser.parseExpression(code, [options])




Plugin 会运行在 Preset 之前。
Plugin 会从前到后顺序执行。
Preset 的顺序则 刚好相反(从后向前)。


preset 的逆向顺序主要是为了保证向后兼容