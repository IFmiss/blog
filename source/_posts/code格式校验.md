---
title: code格式校验
date: 2020-12-22 13:32:40
categories: 工程化
tags: [工程化]
---

### 代码美化工具 prettier
全局或者本地安装
```code
npm i prettier -g
```
or
```code
npm i prettier --save-dev
```

目录下配置 `prettier.config.js`
```js
module.exports = {
  // 多行时使用尾后逗号，默认为"es5" "none" | "es5" | "all"
  trailingComma: "es5",
  // 缩进宽度
  tabWidth: 2,
  // 是否使用分号，默认为true
  semi: true,
  // 是否使用单引号包裹字符串，默认为false
  singleQuote: true,
  // 列宽，默认为80
  printWidth: 80,
};
```
更多配置见: https://prettier.io/docs/en/options.html

#### prettier vscode
vscode 安装 prettier - code formatter 根据 vscode 配置 `Editor: Format On Save` 为true 支持保存自动格式话代码
> vs code 优先按项目根目录配置进行格式化，没有则使用vs code 安装 prettier 的默认配置

#### prettier script 配置

> prettier 专注格式美化，不做代码质量校验，所以eslint 该用还得用

### eslint 校验

