---
title: 如何减少webpack4打包时长
date: 2019-11-19 16:34:39
categories: 环境配置
tags: [webpack]
---

最近在面试过程中被问到这个题目一种方法都说不出，刚好入职的公司有一个这个类型的分享，自己在这个基础上进行本地尝试，记录一下做个总结

### webpack基本配置
#### test 的 include & exclude
```ts
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /(node_modules)/,
      }
    ]
  }
}
```
`include` 表示精确某个文件或某个目录下的test
`exclude` 表示除某一个文件或者某一个目录不走 babel-loader

### AutoDllPlugin
安装：
```code
npm install --save-dev autodll-webpack-plugin
```
使用：
```ts
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html',
    }),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundles to index.html
      filename: '[name].js',
      entry: {
        vendor: [
          'react',
          'react-dom'
        ]
      }
    })
  ]
}
```
Will Result in:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test</title>
</head>
<body>

  ...

  <script src="dist/vendor.dll.js"></script>
  <script src="dist/main.bundle.js"></script>
</body>
</html>
```
地址：https://github.com/asfktz/autodll-webpack-plugin

### 使用 happypack 插件
happypack 插件是分配系统多进程执行代码构建，来加速代码构建

```code
npm install --save-dev happypack
```

使用方式
```ts
// @file: webpack.config.js
const HappyPack = require('happypack');

exports.module = {
  rules: [
    {
      test: /.js$/,
      // 1) replace your original list of loaders with "happypack/loader":
      // loaders: [ 'babel-loader?presets[]=es2015' ],
      use: 'happypack/loader',
      include: [ /* ... */ ],
      exclude: [ /* ... */ ]
    }
  ]
};

exports.plugins = [
  // 2) create the plugin:
  new HappyPack({
    // 3) re-add the loaders you replaced above in #1:
    loaders: [ 'babel-loader?presets[]=es2015' ]
  })
];
```
地址：https://github.com/amireh/happypack

### 使用 cache-loader
在一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里
```code
npm install --save-dev cache-loader
```
```ts
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['cache-loader', 'babel-loader'],
        include: path.resolve('src'),
      },
    ],
  },
};
```
请注意，保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader，可以在test的loaders之前添加cache-loader
文档地址：https://www.webpackjs.com/loaders/cache-loader/
插件地址：https://github.com/webpack-contrib/cache-loader

### 打包文件资源分析插件 webpack-bundle-analyzer

未完 待续...