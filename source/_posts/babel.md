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
babel 的编译过程大致分为三个阶段：
- 解析 (Parsing): 代码字符解析成抽象语法树
- 转换 (Transformation): 对抽象语法树进行转换操作
- 生成 (Code Generation): 根据变换后的抽象语法书生成代码字符串
![babel](https://www.daiwei.site/static/blog/babel/babel.png)

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
![parser 解析结果](https://www.daiwei.site/static/blog/babel/babel-parse-1.png)

具体生成效果可以访问 https://astexplorer.net/ 试一试

@babel/parser
- 默认情况下启用最新的ECMAScript版本
- 支持JSX，Flow，Typescript
- 支持stage-0开始 （从 Babel v7 开始，所有针对处于标准提案阶段的功能所编写的预设（stage preset）都已被弃用）

@babel/parser 暴露两个方法，分别是
##### babelParser.parse(code, [options])
babel 代码解析，将提供的 code 解析为完整的 ECMAScript 程序， 返回AST抽象语法树

```js
const code = `
  const fn = (text) => {
    return text
  }
`
const parseObj = require("@babel/parser").parse(code)
console.log(parseObj)
```

打印的结果如下
```js
Node {
  type: 'File',
  start: 0,
  end: 46,
  loc: SourceLocation {
    start: Position { line: 1, column: 0 },
    end: Position { line: 5, column: 0 }
  },
  errors: [],
  program: Node {
    type: 'Program',
    start: 0,
    end: 46,
    loc: SourceLocation { start: [Position], end: [Position] },
    sourceType: 'script',
    interpreter: null,
    body: [ [Node] ],
    directives: []
  },
  comments: []
}
```
`parse` 方法执行接受第二个 `option` 对象参数，可以对解析做相关配置
- `allowImportExportEverywhere`: 默认情况下，import 和 export 声明只能出现在代码头部。设置该选项为 true 时，则允许他们在代码的任何地方使用。
- `allowReturnOutsideFunction`: 默认情况下，顶级的 return 语句会引发错误。设置该选项为 true 时，则会接受错误的代码。
- `allowSuperOutsideMethod`: 默认情况下，在类和对象方法之外不允许使用 super。将此设置为true可接受此类代码。
- `errorRecovery`: 默认情况下，Babel 总是在发现一些无效代码时抛出错误。当此选项设置为true时，它将存储解析错误并尝试继续解析无效的输入文件。结果AST将有一个errors属性，表示所有解析错误的数组。注意，即使启用了这个选项，@babel/parser也可能抛出不可恢复的错误。
- `allowUndeclaredExports`: 默认情况下，导出未在当前模块作用域中声明的标识符将引发错误。虽然ECMAScript模块规范要求这种行为，但Babel的解析器无法在插件管道中预期稍后可能插入适当声明的转换，因此，有时必须将此选项设置为true，以防止解析器过早地将添加的未声明导出。
- `createParenthesizedExpressions`: 默认情况下，解析器在表达式节点上设置额外的括号。当此选项设置为true时，将创建括号中的expression AST节点。
- `sourceType`: 表明代码应该解析的模式。可以是 "script"，"module" 或者 "unambiguous" 中任意一个。默认为 "script"。"unambiguous" 将使得 Babylon 尝试根据 ES6 的 import 或者 export 声明来进行推测。具有 ES6 import 和 export 的文件被认为是 "module"，否则被认为是 "script"。
- `sourceFilename`: 将输出的 AST 节点与其源文件名相关联。多用于多个输入文件的 AST 生成代码和 source map 时。
- `startLine`: 默认情况下，解析的第一行代码被视为第 1 行。你可以提供一个行号来作为起始。多用于与其他源工具集成。
- `plugins`: 数组，包含要启用的插件。
- `strictMode`: 默认情况下，只有当存在“use strict”；指令或解析的文件是ECMAScript模块时，ECMAScript代码才会解析为strict。将此选项设置为true将始终以严格模式分析文件。
- `ranges`: 为每个节点添加 ranges 属性: [node.start, node.end]
- `tokens`: 将所有解析的 token 添加到 File 节点的上的 tokens 属性中。


整个 `解析` 过程分为两个步骤
##### 分词 将整个代码字符串分割成语法单元数组
  - 关键词 `const`, `let`, `delete`
  - 标识符 `变量`, `if`, `else`, `true`, `false` 等
  - 运算符 `+`, `-`, `*`, `/`, `>>`, `++`
  - 数字
  - 空格
  - 注释
以下是执行一段 js 解析分词的结果
```js
const str = 'hello babel';
```
```js
[
  {
    "type": "Keyword",
    "value": "const"
  },
  {
    "type": "Identifier",
    "value": "str"
  },
  {
    "type": "Punctuator",
    "value": "="
  },
  {
    "type": "String",
    "value": "'hello babel'"
  },
  {
    "type": "Punctuator",
    "value": ";"
  }
]
```
分词的结果包含一个对象数组，对象中包含 `type` 和 `value` 字段
可以访问 [在线分词工具](https://esprima.org/demo/parse.html#) 测试一下

##### 语法分析
语法分析 分析分词生成的数组，并生成AST

至此，babel在解析的过程就结束了

#### @babel/traverse 转换
在这个阶段，Babel接受得到AST并通过babel-traverse对其进行深度优先遍历，在此过程中对节点进行添加、更新及移除操作。这部分也是Babel插件介入工作的部分。
在进入每个节点时触发 enter 钩子函数，退出每个节点时触发 exit 钩子函数。开发者可在钩子函数中对 AST 进行修改。
```js
const code = `
  const add = (a, b) => {
    return a + b
  }
`
const parseObj = require("@babel/parser").parse(code)

const { default: traverse } = require('@babel/traverse')
const b = traverse(parseObj, {
  enter(path) {
    console.log('======== split =======')
    console.log('type', path.type)
    console.log('enter')
  },
  exit(path) {
    console.log('======== split =======')
    console.log('exit')
  }
})
```

#### @babel/generator 转换
将转换后的抽象语法树（AST Abstract Syntax Tree）转化为Javascript 字符串
```js
const { default: generate } = require('@babel/generator')
const output = generate(parseObj, {
  minified: true
})
console.log('output', output)

// 结果
// output {
//   code: 'const add=(a,b)=>{return a+b};',
//   map: null,
//   rawMappings: null
// }
```

### AST(Abstract Syntax Tree) 抽象语法树
AST 抽象语法树 是一种标准的树结构， 点击这里查看树的对象结构 [tree node objects](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API#Node_objects)

```js
const a = 1
```
解析的AST:
```json
{
  "type": "Program",
  "start": 0,
  "end": 11,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 11,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 11,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 7,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 10,
            "end": 11,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```

### 预设 presets
`presets` 是在 babel 编译的时候预设的功能配置
从 Babel v7 开始，所有针对处于标准提案阶段的功能所编写的预设（stage preset）都已被弃用
```js
const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
      corejs: "2",
    }
  ]
];
```
以上是关于一个 babel preset 的简单配置，配置有以下属性
- targets 对象，具体支持到哪个版本的 （chrome, opera, edge, firefox, safari, ie, ios, android, node, electron等），如果未指定目标，则旁注@babel/preset-env将默认转换所有ECMAScript 2015+代码。
- targets.esmodules 指定此选项时，浏览器字段将被忽略。您可以结合使用此方法，<script type="module"></script>以有条件地为用户提供较小的脚本 请注意：指定esmodules目标时，targets.browsers 字段将被忽略
- spec 默认为false 为此预设中支持它们的任何插件启用更符合规范要求，但可能更慢的转换
- loose 启动宽松模式，配合 webpack 的 loader 使用
- modules 使用何种模块加载机制 "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false，默认为"auto"。
- debug 开启调试模式 true 将使用的目标/插件以及插件数据版本中指定的版本输出到console.log。
- include 包含哪些文件
- exclude 排除哪些文件
- useBuiltIns 此选项配置如何@babel/preset-env处理polyfills， "usage"| "entry"| false，默认为false。

> preset 的顺序 （从后向前)。其逆向顺序主要是为了保证向后兼容

### 插件 plugin
插件系统是babel的另一个配置，插件将转换应用于我们的代码

#### 语法插件
```json
{
  "plugins": [
    "transform-decorators-legacy",
    "transform-class-properties"
  ]
}
```
transform-decorators-legacy然后会运行transform-class-properties。

#### 插件格式
```json
{
  "plugins": [
    "pluginA",
    ["pluginA"],
    ["pluginA", {
      "modules": false
    }]
  ]
}
```
`plugins` 接收一个数组，可以是字符串数组，数组数组（数组内套数组，用于配置其他信息）

> plugin 会运行在 preset 之前，且 plugin 会从前到后顺序执行。

### 写一个babel插件
```js
module.exports = function ({ types: t }) {
  return {
    visitor: {
      BinaryExpression(path) {
        if (path.node.operator !== '===') {
          return
        }
        path.node.left = t.identifier("a")
        path.node.right = t.identifier("b")
      }
    }
  }
}
```

### @babel/core
`babel/core`，集成 `@babel/parser`, `@babel/generator`, `@babel/traverse`, `@babel/helpers`, `@babel/template` 等依赖， 是babel的核心包

### @babel/node
直接在 `node` 环境中，运行ES6的代码

### @babel/types
`@babel/types` 是一款作用于 AST 的类 lodash 库，其封装了大量与 AST 有关的方法，大大降低了转换 AST 的成本。@babel/types 的功能主要有两种：一方面可以用它验证 AST 节点的类型，例如使用 isClassMethod 或 assertClassMethod 方法可以判断 AST 节点是否为 class 中的一个 method；另一方面可以用它构建 AST 节点，例如调用 classMethod 方法，可生成一个新的 classMethod 类型 AST 节点 。

### @babel/template
` @babel/template` 实现了计算机科学中一种被称为准引用（quasiquotes）的概念。说白了，它能直接将字符串代码片段（可在字符串代码中嵌入变量）转换为 AST 节点。例如下面的例子中，@babel/template 可以将一段引入 axios 的声明直接转变为 AST 节点。
```js
import template from "@babel/template";

const ast = template.ast(`
  const axios = require(“axios”);
`);
```

### @babel/polyfill
`@babel/polyfill` 包含 `regenerator-runtime` 和 `core-js` 这个库会模拟一个完全的 ES2015+ 的环境, 这意味着你可以使用 新的内置语法 比如 promise 或者 WeakMap， 静态方法比如Array.from 或 Object.assign, 实例方法 比如 Array.prototype.includes 和 generator 函数

### 参考于

[Babel 插件有啥用](https://zhuanlan.zhihu.com/p/61780633

[jamiebuilds/babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

[https://babeljs.io/](https://babeljs.io/)
