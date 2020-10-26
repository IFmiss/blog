---
title: 【js高级程序】错误处理与调试
date: 2020-10-23 07:19:29
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第21章*

### 错误处理
#### try/catch 语句
ECMA-262 第 3 版新增了 try/catch 语句，作为在 JavaScript 中处理异常的一种方式。
```js
try {
  // 可能出错的代码
} catch (error) {
  // 出错时要做什么
}
```
> 因此无法捕获异步代码

##### finally 子句
try/catch 语句中可选的 finally 子句始终运行。
> 只要代码中包含了 finally 子句，try 块或 catch 块中的 return 语句就会被忽略，理解这一点很重要。在使用 finally 时一定要仔细确认代码的行为。

##### 错误类型
代码执行过程中会发生各种类型的错误。 每种类型都会对应一个错误发生时抛出的错误对象。 ECMA-262 定义了以下 8 种错误类型：
- `Error` Error 是基类型，其他错误类型继承该类型。浏览器很少会抛出 Error 类型的错误，该类型主要用于开 发者抛出自定义错误。
- `InternalError` InternalError 类型的错误会在底层 JavaScript 引擎抛出异常时由浏览器抛出。例如，递归过多导 致了栈溢出。
- `EvalError` EvalError 类型的错误会在使用 eval()函数发生异常时抛出。
- `RangeError` 错误会在数值越界时抛出。例如，定义数组时如果设置了并不支持的长度
- `SyntaxError` JavaScript 语法错误时发生
- `TypeError` 主要发生在变量不是预期类型，或者访问不存在的方法时。很 多原因可能导致这种错误，尤其是在使用类型特定的操作而变量类型不对时。
- `URIError` 只会在使用 encodeURI()或 decodeURI()但传入了格式错误的 URI 时发生。

#### 抛出错误
与 try/catch 语句对应的一个机制是 throw 操作符，用于在任何时候抛出自定义错误。throw 操 作符必须有一个值，但值的类型不限。下面这些代码都是有效的：
```js
throw 12345;
throw "Hello world!";
throw true;
throw { name: "JavaScript" };
```
可以通过内置的错误类型来模拟浏览器错误。每种错误类型的构造函数都只接收一个参数，就是错 误消息。
```js
throw new Error("Something bad happened.");
throw new SyntaxError("I don't like your syntax."); throw new InternalError("I can't do that, Dave."); throw new TypeError("What type of variable do you take me for?");
```

继承 Error也可以创建自定义的错误类型, 创建自定义错误类型 时，需要提供 name 属性和 message 属性
```js
class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = "CustomError";
    this.message = message;
  }
}
throw new CustomError("My message");
```

#### error 事件
任何没有被 try/catch 语句处理的错误都会在 window 对象上触发 error 事件。
```js
window.onerror = (message, url, line) => {
  console.log(message);
  return false;
};
```
在任何错误发生时，无论是否是浏览器生成的，都会触发 error 事件并执行这个事件处理程序。 然后，浏览器的默认行为就会生效，像往常一样显示这条错误消息。可以返回 false 来阻止浏览器默 认报告错误的行为
> 图片也支持 error 事件。

#### 错误处理策略
- **静态代码分析器** (JSHint、JSLint、Google Closure 和 TypeScript)
- **类型转换错误** 主要原因是使用了会自动改变某个值的数据类型的操作符或语言构造。
  > 使用等于 （==）或不等于（!=）操作符，以及在 if、for 或 while 等流控制语句中使用非布尔值，经常会导致 类型转换错误。
- **数据类型错误** 因为 JavaScript 是松散类型的，所以变量和函数参数都不能保证会使用正确的数据类型。开发者需 要自己检查数据类型，确保不会发生错误。数据类型错误常发生在将意外值传给函数的时候。
- **通信错误** 
  - URL 格式或发送数据的格式不正确。 (encodeURIComponent编码)
  - 服务器响应非预期值，导致访问数据字段无效直接报错

#### 把错误记录到服务器中
使用 Image 对象发送请求主要是从灵活性方面考虑的。
- 所有浏览器都支持 Image 对象，即使不支持 XMLHttpRequest 对象也一样。
- 不受跨域规则限制。通常，接收错误消息的应该是多个服务器中的一个，而 XMLHttpRequest 此时就比较麻烦。
- 记录错误的过程很少出错。大多数 Ajax 通信借助 JavaScript 库的包装来处理。如果这个库本身 出错，而你又要利用它记录错误，那么显然错误消息永远不会发给服务器。

```js
function logError(sev, msg) {
  let img = new Image(),
  encodedSev = encodeURIComponent(sev),
  encodedMsg = encodeURIComponent(msg);
  img.src = 'log.php?sev=${encodedSev}&msg=${encodedMsg}';
}

for (let mod of mods){
  try {
    mod.init();
  } catch (ex) {
    logError("nonfatal", 'Module init failed: ${ex.message}');
  }
}
```
在这个例子中，模块初始化失败就会调用 logError()函数。第一个参数是表示错误严重程度的 "nonfatal"，第二个参数在上下文信息后面追加了 JavaScript 错误消息。记录到服务器的错误消息应 该包含尽量多的上下文信息，以便找出错误的确切原因。

### 调试技术
#### 把消息记录到控制台
所有主流浏览器都有 JavaScript 控制台，该控制台可用于查询 JavaScript 错误。

#### 理解控制台运行时
浏览器控制台是个读取-求值-打印-循环（REPL，read-eval-print-loop），与页面的 JavaScript 运行 时并发。这个运行时就像浏览器对新出现在 DOM 中的 `script` 标签求值一样。在控制台中执行的命 令可以像页面级 JavaScript 一样访问全局和各种 API。控制台中可以执行任意数量的代码，与它可能会 阻塞的任何页面级代码一样。修改、对象和回调都会保留在 DOM 和运行时中。
JavaScript 运行时会限制不同窗口可以访问哪些内容
控制台运行时也会集成开发者工具，提供常规 JavaScript 开发中所没有的上下文调试工具。

#### 使用 JavaScript 调试器
debugger

#### 在页面中打印消息
另一种常见的打印调试消息的方式是把消息写到页面中指定的区域。这个区域可以是所有页面中都 包含的元素，但仅用于调试目的；也可以是在需要时临时创建的元素。
```js
function log(message) {
  const console = document.getElementById("debuginfo");
  if (console === null) {
    console = document.createElement("div");
    console.id = "debuginfo";
    console.style.background = "#dedede";
    console.style.border = "1px solid silver"; console.style.padding = "5px";
    console.style.width = "400px";
    console.style.position = "absolute";
    console.style.right = "0px";
    console.style.top = "0px";
    document.body.appendChild(console);
  }
  console.innerHTML += '<p> ${message}</p>';
}
```

#### 抛出错误
抛出错误是调试代码的很好方式。如果错误消息足够具体，只要看一眼错误就可以确定 原因。好的错误消息包含关于错误原因的确切信息，因此可以减少额外调试的工作量。




