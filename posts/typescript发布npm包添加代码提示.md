---
title: typescript发布npm包添加代码提示
date: 2019-04-13 22:26:56
categories: typescript
tags: [ts, js]
---

最近在更新d-utils代码的时候将代码语言换成了typescript，目的有两个，一就是本来就打算重新更新一下这个代码，二就是之前的代码在导入代码之后无法支持代码的自动提示，对于我来说是无法接受的，于是使用ts重新更新了一下

1.0.96版本是没有提示的
1.1.15之后是支持代码提示的

实现方式：
```json
{
  "name": "@dw/d-utils",
  "version": "1.1.19",
  "description": "d-utils",
  "main": "./lib/index.js",
  "typings": "types/index.d.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --mode production && tsc",
    "build:btp": "webpack --mode production && tsc && npm publish --access=public",
    "build:tsc": "tsc",
    "dev": "webpack-dev-server --mode development --progress --colors",
    "watch": "webpack --progress --colors --watch",
    "publish": "npm publish --access=public"
  },
  "files": [
    "lib/",
    "types/",
    "README.md"
  ],
  // ...
}
```
tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es6", 
    "module": "commonjs",
    "removeComments": false,
    "declaration": true,
    "outDir": "./lib",
    "declarationDir": "./types",
    "baseUrl": "./",
    "jsx": "react",
    "allowJs": false,
    "lib": [
      "dom",
      "es2015"
    ],
    "sourceMap": false,
    "noImplicitAny": false
  },
  "files": [
    "./src/lib/index.ts"
  ],
  "include": [
    "src/lib/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

直接使用typescript的编译方式，`npm run build:tsc` 执行tsc命令
`files`的属性设置为 src/lib/index.ts  编译的文件是index.ts
`declaration`设置为true 生成d.ts文件
`declarationDir`生成的d.ts文件地址
`typings`引用d.ts文件声明地址
这之后会在lib目录下生成ts编译的文件，在types目录下生成d.ts文件
之后发布只发布 `/lib`, `/types`, `README.md` 文件
这样在发布之后是下载代码的时候，import导入的代码，是可以支持动态提示的

但是tsc编译的代码并没有支持代码压缩

所以可以在tsc编译之后再压缩一下，或者压缩玩了之后再获取tsc的types文件就行了
所以可以执行 
```code
npm run build:tsc
```
或者
```code
npm run build
```
一键发布
```code
npm run build:btp
```

over!
