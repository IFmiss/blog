---
title: 【js高级程序】基本引用类型
date: 2020-12-02 07:34:24
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第5章*

### Date
```js
const now = new Date();
```

**Date.parse()**
方法接收一个表示日期的字符串参数，尝试将这个字符串转换为表示该日期的毫秒数。参数类型如下
- “月/日/年”，如"5/23/2019"；
- “月名 日, 年”，如"May 23, 2019"；
- “周几 月名 日 年 时:分:秒 时区”，如"Tue May 23 2019 00:00:00 GMT-0700"；
- ISO 8601 扩展格式“YYYY-MM-DDTHH:mm:ss.sssZ”，如 2019-05-23T00:00:00（只适用于 兼容 ES5 的实现）。

如果传给 Date.parse()的字符串并不表示日期，则该方法会返回 NaN。

**Date.UTC()**
同样返回日期的毫秒表示，但是参数和 `Date.parse` 不同
```js
// GMT 时间 2000 年 1 月 1 日零点
let y2k = new Date(Date.UTC(2000, 0));

// GMT 时间 2005 年 5 月 5 日下午 5 点 55 分 55 秒 
let allFives = new Date(Date.UTC(2005, 4, 5, 17, 55, 55));
```

**Date.now()**
返回当前的时间毫秒数

#### 继承的方法
Date 类型重写了 toLocaleString()、toString()和 valueOf()方法。但与其他类型不同，重写后这些方法的返回值不一样。

`valueOf()` 不返回字符串，返回的是日期的毫秒表示

#### 日期格式化方法
Date 类型有几个专门用于格式化日期的方法，它们都会返回字符串：
- `toDateString`  显示日期中的周几、月、日、年
- `toTimeString`  显示日期中的时、分、秒和时区
- `toLocaleDateString`  显示日期中的周几、月、日、年
- `toLocaleTimeString`  显示日期中的时、分、秒
- `toUTCString`   显示完整的 UTC 日期
```js
let date1 = new Date(2019, 0, 1);
date1.toDateString()    // "Tue Jan 01 2019"
date1.toTimeString()    // "00:00:00 GMT+0800 (中国标准时间)"
date1.toLocaleDateString()    // "2019/1/1"
date1.toLocaleTimeString()    // "上午12:00:00"
date1.toUTCString()   // "Mon, 31 Dec 2018 16:00:00 GMT"
```

### RegExp
ECMAScript 通过 RegExp 类型支持正则表达式。
```code
let expression = /pattern/flags;
```
- 这个正则表达式的 pattern（模式）可以是任何简单或复杂的正则表达式，包括字符类、限定符、 分组、向前查找和反向引用。
- 每个正则表达式可以带零个或多个 flags（标记），用于控制正则表达式 的行为。

flag分类：
- `g`: 全局模式，表示查找字符串的全部内容
- `i`: 忽略大小写
- `m`: 多行模式，表示查找到一行文本末尾时会继续查找。
- `y`: 粘附模式，表示只查找从 lastIndex 开始及之后的字符串。
- `u`: Unicode 模式，启用 Unicode 匹配。
- `s`: dotAll 模式，表示元字符.匹配任何字符（包括\n 或\r）。

```js
// 匹配字符串中的所有"at"
let pattern1 = /at/g;

// 匹配第一个"bat"或"cat"，忽略大小写
let pattern2 = /[bc]at/i;

// 匹配所有以"at"结尾的三字符组合，忽略大小写
let pattern3 = /.at/gi;
```

#### 元字符
与其他语言中的正则表达式类似，所有元字符在模式中也必须转义
```code
( [ { \ ^ $ | ) ] } ? * + .
```
```js
// 匹配第一个"bat"或"cat"，忽略大小写
let pattern1 = /[bc]at/i;

// 匹配第一个"[bc]at"，忽略大小写
let pattern2 = /\[bc\]at/i;

// 匹配所有以"at"结尾的三字符组合，忽略大小写
let pattern3 = /.at/gi;

// 匹配所有".at"，忽略大小写
let pattern4 = /\.at/gi;
```

#### RegExp 构造函数
正则表达式也可以使用 RegExp 构造函数来 创建，它接收两个参数：模式字符串和（可选的）标记字符串。
```js
// 匹配第一个"bat"或"cat"，忽略大小写
const p1 = /[bc]at/i;

// 跟 pattern1 一样，只不过是用构造函数创建的
const p2 = new RegExp('[bc]at', 'i');
```
> 因为 RegExp 的模式参数是字符串，所以在某些情况下需要二次转义。

|   字面量模式   |      对应字符串     |
|    :----:    |       :----:      |
| `/\[bc\]at/` |   `"\\[bc\\]at"`  |
| `/\.at/`     |   `"\\.at"`       |
|`/\d.\d{1,2}/`|  `"\\d.\\d{1,2}"` |

#### RegExp 实例属性
每个 RegExp 实例都有下列属性，提供有关模式的各方面信息。
- `global` 布尔值，表示是否设置了 g 标记。
- `ignoreCase` 布尔值，表示是否设置了 i 标记。
- `unicode` 布尔值，表示是否设置了 u 标记。
- `sticky` 布尔值，表示是否设置了 y 标记。 
- `lastIndex` 整数，表示在源字符串中下一次搜索的开始位置，始终从 0 开始。 
- `multiline` 布尔值，表示是否设置了 m 标记。 
- `dotAll` 布尔值，表示是否设置了 s 标记。 
- `source` 正则表达式的字面量字符串（不是传给构造函数的模式字符串），没有开头和结尾的 斜杠。 
- `flags` 正则表达式的标记字符串。始终以字面量而非传入构造函数的字符串模式形式返回（没 有前后斜杠）。

```js
let pattern1 = /\[bc\]at/i;
console.log(pattern1.global);   // false
console.log(pattern1.ignoreCase);   // true
console.log(pattern1.multiline);    // false
console.log(pattern1.lastIndex);    // 0
console.log(pattern1.source);   // "\[bc\]at" 
console.log(pattern1.flags);    // "i"
```

#### RegExp 实例方法
1. **exec()**
这个方法只接收一个参数，即要应用模式的字符串。
如果找到了匹配项，则返回包含第一个匹配信息的数组；
如果没找到匹配项，则返回 null。

> 返回的数组虽然是 Array 的实例，但包含两个额外的属性：index 和 input。index 是字符串中匹配模式的起始位置，input 是要查找的字符串。

```js
let text = "mom and dad and baby";
let pattern = /mom( and dad( and baby)?)?/gi;
let matches = pattern.exec(text);
console.log(matches.index); // 0
console.log(matches.input); // "mom and dad and baby"
console.log(matches[0]); // "mom and dad and baby"
console.log(matches[1]); // " and dad and baby" 
console.log(matches[2]); // " and baby"
```
在这个例子中，模式包含两个捕获组：最内部的匹配项" and baby"，以及外部的匹配项" and dad" 或" and dad and baby"。

调用 exec()后找到了一个匹配项。因为整个字符串匹配模式，所以 matchs 数组的 index 属性就是 0。

数组的第一个元素是匹配的整个字符串
第二个元素是匹配第一个捕获组的字符串
第三个元素是匹配第二个捕获组的字符串

> - 如果模式设置了全局标记，则每次调用 exec()方法会返回一个匹配的信息。
> - 如果没有设置全局标 记，则无论对同一个字符串调用多少次 exec()，也只会返回第一个匹配的信息。

2. **test()**
接收一个字符串参数。如果输入的文本与模式匹配，则参数 返回 true，否则返回 false。

> 正则表达式的 valueOf()方法返回正则表达式本身。

#### RegExp 构造函数属性
RegExp 构造函数本身也有几个属性。（在其他语言中，这种属性被称为静态属性。）这些属性适用 于作用域中的所有正则表达式，而且会根据最后执行的正则表达式操作而变化。

```js
let text = "this has been a short summer";
let pattern = /(.)hort/g;

if (pattern.test(text)) {
  console.log(RegExp.input); // this has been a short summer
  console.log(RegExp.leftContext); // this has been a
  console.log(RegExp.rightContext); // summer 
  console.log(RegExp.lastMatch); // short 
  console.log(RegExp.lastParen); // s
}
```
- input 属性中包含原始的字符串。
- leftConext 属性包含原始字符串中"short"之前的内容
- rightContext 属性包含"short" 之后的内容。
- lastMatch 属性包含匹配整个正则表达式的上一个字符串，即"short"。
- lastParen 属性包含捕获组的上一次匹配，即"s"。

### 原始值包装类型
为了方便操作原始值，ECMAScript 提供了 3 种特殊的引用类型：Boolean、Number 和 String。
```js
let s1 = "some text";
let s2 = s1.substring(2);
```
具体来说，当第二行访问 s1 时，是以读模式访问的，也就是要从内存中读取变量保存的值。在以读模式访问字符串 值的任何时候，后台都会执行以下 3 步：
- 创建一个 String 类型的实例；
- 调用实例上的特定方法；
- 销毁实例。

可以把这 3 步想象成执行了如下 3 行 ECMAScript 代码：
```js
let s1 = new String("some text");
let s2 = s1.substring(2);
s1 = null;
```

Object 构造函数作为一个工厂方法，能够根据传入值的类型返回相应原始值包装类型的实例。
```js
let obj = new Object("some text");
console.log(obj instanceof String);   // true
```
如果传给 Object 的是字符串，则会创建一个 String 的实例。如果是数值，则会创建 Number 的 实例。布尔值则会得到 Boolean 的实例。

#### Boolean
Boolean 是对应布尔值的引用类型。要创建一个 Boolean 对象，就使用 Boolean 构造函数并传入 true 或 false。
```js
let booleanObject = new Boolean(true);
```
Boolean 的实例会重写 valueOf()方法，返回一个原始值 true 或 false。toString()方法被调 用时也会被覆盖，返回字符串"true"或"false"。

#### Number
Number 是对应数值的引用类型。要创建一个 Number 对象，就使用 Number 构造函数并传入一个 数值。

```js
let numberObject = new Number(10);
```
Number 类型重写了 valueOf()、toLocaleString()和 toString()方 法。
- valueOf()方法返回 Number 对象表示的原始数值，另外两个方法返回数值字符串。
- toString() 方法可选地接收一个表示基数的参数，并返回相应基数形式的数值字符串

除了继承的方法，Number 类型还提供了几个用于将数值格式化为字符串的方法。
- `toFixed()` 方法返回包含指定小数点位数的数值字符串 (四舍五入截断， 不够补0)
- `toExponential()` 返回数字的科学计数法，表示结果中小数的位数
  ```js
  let num = 10;
  console.log(num.toExponential());   // "1e+1"
  console.log(num.toExponential(1));  // "1.0e+1"
  let num = 100;
  console.log(num.toExponential(2));   // "1.00e+2"
  ```
  一般来说，这么小的数不用表示为科学记数法形式。如果想得到数 值最适当的形式，那么可以使用 `toPrecision()`。
- `toPrecision()` 方法会根据情况返回最合理的输出结果，可能是固定长度，也可能是科学记数法形式。
  ```js
  let num = 99;
  console.log(num.toPrecision(1)); // "1e+2"
  console.log(num.toPrecision(2)); // "99"
  console.log(num.toPrecision(3)); // "99.0"
  ```
  本质上，toPrecision()方法会 根据数值和精度来决定调用 toFixed()还是 toExponential()。为了以正确的小数位精确表示数值， 这 3 个方法都会向上或向下舍入。

##### isInteger()方法
ES6 新增了 Number.isInteger()方法，用于辨别一个数值是否保存为整数。
```js
Number.isInteger(1)   // true
Number.isInteger(1.00)    // true
Number.isInteger(1.01)    // false
```

##### isSafeInteger()判断是否是安全整数
范围从 **Number.MIN_SAFE_INTEGER（2 ** 53 + 1）** 到 **Number.MAX_SAFE_INTEGER（2 ** 53 - 1）**。
```js
console.log(Number.isSafeInteger(-1 * (2 ** 53)));    // false
console.log(Number.isSafeInteger(-1 * (2 ** 53) + 1));  // true

console.log(Number.isSafeInteger(2 ** 53));   // false
console.log(Number.isSafeInteger((2 ** 53) - 1));   // true
```

#### String
String 是对应字符串的引用类型。3 个继承的方法 valueOf()、toLocaleString() 和 toString()都返回对象的原始字符串值。

1. JavaScript 字符
JavaScript 字符串由 16 位码元（code unit）组成。字符串的 length 属性表示字符串包含多少 16 位码元

`charAt()` 返回给定索引位置的字符
```js
let message = "abcde";
console.log(message.charAt(2)); // "c"
```

`charCodeAt()` 返回指定码元的字符编码
```js
let message = "abcde";
console.log(message.charCodeAt(2)); // 99

// 十进制 99 等于十六进制 63
console.log(99 === 0x63);   // true
```

`fromCharCode()` 用于根据给定的 UTF-16 码元创建字符串中的字符。
```js
console.log(String.fromCharCode(0x61, 0x62, 0x63, 0x64, 0x65));   // abcde

// 0x0061 === 97
// 0x0062 === 98
// 0x0063 === 99
// 0x0064 === 100
// 0x0065 === 101

console.log(String.fromCharCode(97, 98, 99, 100, 101));   // "abcde"
```

##### 字符串包含方法
`startsWith(str, startPosition)`: 检查开始于索引 0 的匹配项, startPosition可以手动控制匹配位置

`endsWith(str, endPosition)`: 检查开始于索引 (string.length - substring.length) 的匹配项 endPosition可以手动控制匹配位置
```js
let message = "foobarbaz";
console.log(message.startsWith("foo")); // true 
console.log(message.startsWith("bar")); // false

console.log(message.endsWith("baz"));  // true
console.log(message.endsWith("bar"));  // false
```
接受第二个参数
```js
let message = "foobarbaz";

console.log(message.startsWith("foo")); // true
console.log(message.startsWith("foo", 1)); // false

console.log(message.endsWith("bar"));   // false 
console.log(message.endsWith("bar", 6));    // true
```

##### 字符串迭代与解构
字符串的原型上暴露了一个@@iterator 方法，表示可以迭代字符串的每个字符。
```js
let message = 'abc';
let stringIterator = message[Symbol.iterator]();

console.log(stringIterator.next());  // {value: "a", done: false} 
console.log(stringIterator.next());  // {value: "b", done: false} 
console.log(stringIterator.next());  // {value: "c", done: false} 
console.log(stringIterator.next());  // {value: undefined, done: true} 
```
> for of 基于迭代器实现数据遍历

##### localeCompare()
比较两个字符串

**a.localeCompare(b)**
- `1` b 按字母表顺序排在 a前面
- `0` 相等
- `-1` b排在a后面

### 单例内置对象
#### Global
1. URL 编码方法
`encodeURI()`
`encodeURIComponent()`
用于编码统一资源标识符（URI），以便传给浏览器。 有效的 URI 不能包含某些字符，比如空格。使用 URI 编码方法来编码 URI 可以让浏览器能够理解它们， 同时又以特殊的 UTF-8 编码替换掉所有无效字符。

- `encodeURI()`不会编码属于 URL 组件的特殊字符，比如冒号、斜杠、问号、 井号
- `encodeURIComponent()` 会编码它发现的所有非标准字符
```js
let uri = "https://www.daiwei.site/blog/2?user=戴维";

encodeURI(uri);
// "https://www.daiwei.site/blog/2?user=%E6%88%B4%E7%BB%B4"

encodeURIComponent(uri);
// https%3A%2F%2Fwww.daiwei.site%2Fblog%2F2%3Fuser%3D%E6%88%B4%E7%BB%B4
```
