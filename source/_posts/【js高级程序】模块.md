---
title: 【js高级程序】模块
date: 2020-10-29 08:30:28
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第26章*

JavaScript 是异步加载的解释型语言，所以得到广泛应用的各种模块实现也表现出不同的形态。 这些不同的形态决定了不同的结果，但最终它们都实现了经典的模块模式。


### ES6 之前的模块加载器
在 ES6 原生支持模块之前，使用模块的 JavaScript 代码本质上是希望使用默认没有的语言特性。因 此， 必须按照符合某种规范的模块语法来编写代码， 另外还需要单独的模块工具把这些模块语法与 JavaScript 运行时连接起来。这里的模块语法和连接方式有不同的表现形式，通常需要在浏览器中额外 加载库或者在构建时完成预处理。

#### CommonJS
CommonJS 规范概述了**同步声明依赖的模块定义**。这个规范主要用于在服务器端实现模块化代码组织，但也可用于定义在浏览器中使用的模块依赖。CommonJS 模块语法不能在浏览器中直接运行。

> 一般认为，Node.js的模块系统使用了 CommonJS规范，实际上并不完全正确。Node.js使用了轻微修改版本的 CommonJS，**因为 Node.js 主要在服务器环境下使用，所以不需要考虑网络延迟问题。**

CommonJS 模块定义需要使用 require()指定依赖，而使用 exports 对象定义自己的公共 API
```js
// moduleA

var moduleB = require('./moduleB');

module.exports = {
  stuff: moduleB.doStuff();
};
```
`moduleA` 通过使用模块定义的相对路径来指定自己对 `moduleB` 的依赖。什么是“模块定义”，以及 如何将字符串解析为模块，完全取决于模块系统的实现。

请求模块会加载相应模块， 而把模块赋值给变量也非常常见， 但赋值给变量不是必需的。 调用 require()意味着模块会原封不动地加载进来：
```js
console.log('moduleA');
require('./moduleA'); // "moduleA"
```

无论一个模块在 require()中被引用多少次，**模块永远是单例**。在下面的例子中，moduleA 只会 被打印一次。这是因为无论请求多少次，moduleA 只会被加载一次。
```js
console.log('moduleA');
var a1 = require('./moduleA');
var a2 = require('./moduleA');

console.log(a1 === a2); // true
```
**在 CommonJS 中，模块加载是模块系统执行的同步操作**因此 require()可以像下面这样以编程 方式嵌入在模块中：
```js
if (loadCondition) {
  require('./moduleA');
}
```

#### 异步模块定义（AMD）
CommonJS 以服务器端为目标环境，能够一次性把所有模块都加载到内存，而异步模块定义（AMD， Asynchronous Module Definition）的模块定义系统则以浏览器为目标执行环境，这需要考虑网络延迟的 问题。
AMD 的一般策略是让模块声明自己的依赖，而运行在浏览器中的模块系统会按需获取依赖，并 在依赖加载完成后立即执行依赖它们的模块。
**AMD模块实现的核心是用函数包装模块定义。**
```js
// ID 为'moduleA'的模块定义。moduleA 依赖 moduleB，
// moduleB 会异步加载
define('moduleA', ['moduleB'], function(moduleB) {
  return {
    stuff: moduleB.doStuff();
  }
}
```

#### 通用模块定义 （UMD）
为了统一 CommonJS 和 AMD 生态系统，通用模块定义（UMD，Universal Module Definition）规范 应运而生。

本质上，UMD 定义的模块会在启动时 检测要使用哪个模块系统，然后进行适当配置，并把所有逻辑包装在一个立即调用的函数表达式（IIFE） 中。

```js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD。注册为匿名模块
    define(['moduleB'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node。不支持严格 CommonJS
    // 但可以在 Node 这样支持 module.exports 的
    // 类 CommonJS 环境下使用
    module.exports = factory(require(' moduleB '));
  } else {
    // 浏览器全局上下文（root 是 window）
    root.returnExports = factory(root. moduleB);
  }
}(this, function(moduleB) {
  // 以某种方式使用 moduleB

  // 将返回值作为模块的导出
  // 这个例子返回了一个对象
  // 但是模块也可以返回函数作为导出值
  return {};
})
```

### 使用 ES6 模块
#### 模块标签及定义
```html
<script type="module" src="path/to/myModule.js"></script>
```

#### 执行顺序
```html
<!-- 第二个执行 -->
<script type="module"></script>

<!-- 第三个执行 -->
<script type="module"></script>

<!-- 第一个执行 -->
<script></script>
```
> 与传统脚本不同，所有模块都会像&lt;script defer&gt;加载的脚本一样按顺序执行。解析到&lt;script type="module"&gt;标签后会立即下载模块文件，但执行会延迟到文档解析完成。无论对嵌入的模块代码， 还是引入的外部模块文件，都是这样。
> &lt;script type="module"&gt;在页面中出现的顺序就是它们执行 的顺序。与&lt;script defer&gt;一样，修改模块标签的位置，无论是在&lt;head&gt;还是在&lt;body&gt;中，只会影 响文件什么时候加载，而不会影响模块什么时候加载。

#### 模块加载
ECMAScript 6 模块的独特之处在于，既可以通过浏览器原生加载，也可以与第三方加载器和构建工 具一起加载。有些浏览器还没有原生支持 ES6 模块，因此可能还需要第三方工具。事实上，很多时候使 用第三方工具可能会更方便。

- 顶级模块加载整个依赖图，且是异步完成
- 浏览器 会解析入口模块，确定依赖，并发送对依赖模块的请求
- 文件通过网络返回后，浏览器就会解析它 们的内容，确定它们的依赖
- 如果这些二级依赖还没有加载，则会发送更多请求。

这个异步递归加载过程会持续到整个应用程序的依赖图都解析完成。解析完依赖图，应用程序就可以正式加载模块了。

#### 模块行为
ECMAScript 6 模块借用了 CommonJS 和 AMD 的很多优秀特性。下面简单列举一些。
- 模块代码只在加载后执行。
- 模块只能加载一次。
- 模块是单例。
- 模块可以定义公共接口，其他模块可以基于这个公共接口观察和交互。
- 模块可以请求加载其他模块。
- 支持循环依赖。

ES6 模块系统也增加了一些新行为。
- ES6 模块默认在严格模式下执行。
- ES6 模块不共享全局命名空间。
- 模块顶级 this 的值是 undefined（常规脚本中是 window）。
- 模块中的 var 声明不会添加到 window 对象。
- ES6 模块是异步加载和执行的。

#### 模块导出
ES6 模块支持两种导出：
- 命名导出
```js
const foo = 'foo';
export { foo };
export const bar = 'bar';
export { foo as myFoo };
```

- 默认导出。
```js
const foo = 'foo';
const bar = 'bar';
export default foo;
export { foo as default };
export { foo as default, bar };
```

> export 关键字用于声明一个值为命名导出。导出语句必须在模块顶级，不能嵌套在某个块中

#### 模块导入
模块可以通过使用 import 关键字使用其他模块导出的值。与 export 类似，import 必须出现在 模块的顶级
```js
import { foo } from './fooModule.js';
import foo from './fooModule.js';
```

#### 模块转移导出
模块导入的值可以直接通过管道转移到导出。此时，也可以将默认导出转换为命名导出，或者相反。 如果想把一个模块的所有命名导出集中在一块，可以像下面这样在 bar.js 中使用*导出：
```js
export * from './foo.js';
export { foo, bar as myBar } from './foo.js';
export { default } from './foo.js';
export { foo as default } from './foo.js';
```

#### 工作者模块
ECMAScript 6 模块与 Worker 实例完全兼容。在实例化时，可以给工作者传入一个指向模块文件的 路径，与传入常规脚本文件一样。Worker 构造函数接收第二个参数，用于说明传入的是模块文件。
```js
// 第二个参数默认为{ type: 'classic' }
const scriptWorker = new Worker('scriptWorker.js');

const moduleWorker = new Worker('moduleWorker.js', { type: 'module' });
```

#### 向后兼容
```html
// 支持模块的浏览器会执行这段脚本
// 不支持模块的浏览器不会执行这段脚本
<script type="module" src="module.js"></script>

// 支持模块的浏览器不会执行这段脚本 //
不支持模块的浏览器会执行这段脚本
<script nomodule src="script.js"></script>
```

