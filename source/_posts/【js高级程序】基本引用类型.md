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


