---
title: js数据类型转换
date: 2019-10-21 23:40:30
categories: javascript
tags: ['js']
---

JavaScript 数据类型分为基本数据类型和引用数据类型

### 基本数据类型
- `string`
- `boolean`
- `undefined`
- `null`
- `number`
- `symbol` (es6新类型)
- `bigint` (现在处在 ECMAScript 标准化过程中的 第三阶段)

### 引用数据类型
- `function`
- `object`
- `array`

### 数据类型转换
以下是一张来自 `javacript权威指南`中的一张数据转换的图片
![js数据转换](https://www.daiwei.site/static/blog/js数据类型转换/1.png)

我们需要知道数据类型转换有
- 数字
- Bool值
- 字符串

### 值转为数字
Number() 函数, Number函数会将里面的num值转化为number类型,如果无法转化为数字，就会成NaN

#### 原始类型值
```ts
// 字符串：如果不可以被解析为数值，
Number('1as2')  // NaN
Number('1')   // 1

// 布尔值：true 转成 1，false 转成 0
Number(true)    // 1
Number(false)   // 0

Number(null)    // 0
Number(undefined)   // NaN
```
其他转换的方法 parseInt, parseFloat
Number相对于parseInt更为严格(parseInt逐个解析字符，而Number函数整体转换字符串的类型。)比如
```ts
Number('1as2')  // NaN
parseInt('1as2')    // 1
```
#### 对象
如果Number方法的参数是对象时，将返回NaN，除非是包含单个数值的数组。
```ts
Number({})    // NaN
Number({a: 1, b: 2})    // NaN
Number([5])     // 5
Number(['a'])     // NaN
Number(['1'])     // 1
```
Number的参数为对象的时候会走以下的类型转换
- 此时会先调用对象自身的valueOf方法，如果返回的是原始值，则直接作为参数执行Number方法，然后break
- 如果valueOf返回的还是对象的话，则调用对象的toString方法，如果返回原始值类型，则执行Number方法，然后break
- 如果toSting返回的还是对象，则报错

看下面的例子
```ts
const bar = { a : 1 }
const foo = [1]
const stra = ['a1']

// 我们按上面步骤一步一步走
bar.valueOf()     // { a: 1 }    还是对象。所以需要走toString方法
foo.valueOf()     // [1]    同样是对象，也需要再走toString方法
stra.valueOf()    // ['a1']     同上

// valueOf执行之后如果还不是原始值开始走toString
bar.toString()    // '[object Object]'    是原始值，开始执行Number('[object Object]')
foo.toString()    // '1'    是原始值，开始执行Number('1')
stra.toString()   // 'a1'    是原始值，开始执行Number('a1')

// 最后得到的结果分别为
Number('[object Object]')   //  NaN
Number('1')   //    1
Number('a1')    // NaN
```

### 值转为字符
String() 函数，将参数转换成原始的字符串，并返回转换后的值。
#### 原始类型值
```ts
String(1)   // '1'
String(null)    // 'null'
String(false)   // 'false'
String('1')   // '1'
String('undefined')   // 'undefined'
```
#### 对象
String方法的参数如果是对象，返回一个类型字符串；如果是数组，返回该数组的字符串形式。
```ts
String([])    // ''
String([1, 2])    // '1, 2'
String({})    // '[object Object]'
```
String方法的转换规则，与Number方法基本相同，只是互换了valueOf方法和toString方法的执行顺序
- 对象先调用自身的toString方法，如果返回的是原始类型值，直接作为参数执行String方法，然后break
- 如果toString返回的不是原始类型则调用对象的valueOf，如果返回的是原始值，则执行String方法，然后break
- 如果valueOf返回的还是对象，则报错

继续看例子
```ts
const bar = { a : 1 }
const foo = [1]
const stra = ['a1']

// 先执行对象的toString方法
bar.toString()    // '[object Object]'    String('[object Object]')
foo.toString()    // '1'    是原始值，开始执行String('1')
stra.toString()   // 'a1'    是原始值，开始执行String('a1')

// 直接执行结果了
String('[object Object]')   // '[object Object]'
String('1')     // '1'
String('a1')    // 'a1'
```

我们再来试试这个对象，看返回的结果是啥
```ts
var obj = {
  valueOf: function () {
    return 'this is valueOf';
  },
  toString: function () {
    return {};
  }
};

String(obj)   // "this is valueOf"
```
为啥？ obj.toString()被重写返回对象，所以会继续看obj.valueOf，返回的是`'this is valueOf'`，最后就相当于
```ts
String(obj.valueOf())
// 等同于
String('this is valueOf')   // 'this is valueOf'
```

### 值转为布尔值
Boolean函数可以将任意类型转化成布尔值
以下5个值转化结果为false，其他的全部为true
- undefined
- null
- ''(空字符串)
- 0 (包括-0, +0)
-NaN

```ts
Boolean(undefined)    // false
Boolean(null)   // false
Boolean('')   // false
Boolean(0)    // false
Boolean(NaN) // false
Boolean([])   // true
Boolean({})   // true
Boolean(1)   // true
```

### 隐式类型转换
在某些情况下，即使我们不提供显示转换，Javascript也会进行自动类型转换，主要情况有：
- 自动转换为布尔值
- 自动转换为字符串
- 自动转换为数值

### 自动转换为布尔值
JavaScript遇到预期为布尔值的时候会将非布尔值自动转换成布尔值，系统会自定调用 Boolean 函数
除了以下五个值以外，其他的自动转为true
- `undefined`
- `null`
- `-0 ， +0`
- `NaN`
- `''`

<!-- 他们是如何调用内部函数的？
```ts

``` -->
```ts
!undefined    // true
!null         // true
!0            // true
!NaN          // true
!''           // true
```
如果判断元素获取布尔返回值的话
```ts
const a = '1'
a ? true : false    // true
!!a                 // true
```

### 自动转换为字符串
JavaScript 遇到预期为字符串的地方，会将非字符串的值自动转换为原始类型值在转为字符串
```ts
'1' + 1  // '11'
'1' + true  // '1true'
'1' + false   // '1false'
'1' + {}  // '1[object Object]'
'1' + []  // '1'
'1' + function () {}  // '1function () {}'
'1' + undefined   // '1undefined'
'1' + null  // '1null'
```

### 自动转换为数值
JavaScript 遇到预期为数值的地方，会自动将参数转化成数值，系统内部会自动调用Number函数
除了加法运算符（+）有可能把运算子转为字符串，其他运算符都会把运算子自动转成数值。
```ts
'5' - '2' // 3
'5' * '2' // 10
true - 1   // 0
false - 1   // -1
'1' - 1   // 0
'5' * []  // 0
false / '5'   // 0
'abc' - 1   // NaN
null + 1    // 1
undefined + 1   // NaN
```

### 常见面试题
#### Question 1
```ts
[] == false   // true
![] == false    // true
```
第一个结果为`true` 原因是 [] 被转换成 '' 之后被转化成数值 0 返回true
第二个结果同样`true` 前边多了个!，直接被转成bool值取反，[]转bool为true，取反为false，所以结果也相等

#### Qusetion 2
```ts
[] + {}     // '[object Object]'
{} + []     // 0
```
第一个按照正常的js隐式转换逻辑[] 转换为''(空字符串)，{} 转换为 '[object Object]'， 结果为 '[object Object]'
第二个的{}被视为一个代码块，而不是一个javascript对象，所以相当于 +[]，将 []转化为数值，所以结果为 0

参考于：[阮一峰，JavaScript标准教程](http://javascript.ruanyifeng.com/grammar/conversion.html#toc0)

