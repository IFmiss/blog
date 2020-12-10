---
title: 【js高级程序】集合引用类型
date: 2020-12-08 08:18:08
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第6章*

### Object
Object 是 ECMAScript 中最常用的类 型之一。虽然 Object 的实例没有多少功能，但很适合存储和在应用程序间交换数据。

显式地创建 Object 的实例有两种方式:
- new 操作符和 Object 构造函数
  ```js
  let person = new Object();
  person.name = "Nicholas";
  person.age = 29;
  ```
- 另一种方式是使用 **对象字面量（object literal）** 表示法。
  ```js
  let person = {
    name: "Nicholas",
    age: 29
  };
  ```
> **左大括号（{）表示对象字面量开始**，因为它出现在一个表达式上下文（expression context）中。
> 如果出现在语句上下文（statement context）中，比如 if 语句的条件后面，则**表示一个语句块的开始。**

### Array
#### 创建数组
- new Array
  ```js
  let colors = new Array();   // 创建一个长度为0的数组
  let colors = new Array(20);   // 创建一个长度为20的数组，每个索引值为empty
  let names = new Array("Greg"); // 创建一个只包含一个元素，即字符串"Greg"的数组
  ```
- 数组字面量
  ```js
  let colors = ["red", "blue", "green"];
  ```

Array 构造函数还有两个 ES6 新增的用于创建数组的静态方法：from()和 of()。
- `from()` 用于将类数组结构转换为数组实例
  ```js
    // 字符串会被拆分为单字符数组
    console.log(Array.from("Matt")); // ["M", "a", "t", "t"]

    // Array.from()对现有数组执行浅复制
    const a1 = [1, 2, 3, 4];
    const a2 = Array.from(a1);
    a2.push(5);
    console.info(a1);   // [1, 2, 3, 4]
    console.info(a2);   // [1, 2, 3, 4, 5]
  ```
- `of()` 用于将一组参数转换为数组实例。用于替代在 ES6 之前常用的 Array.prototype. slice.call(arguments)
  ```js
    console.log(Array.of(1, 2, 3, 4)); // [1, 2, 3, 4]
  ```

#### 数组空位
使用数组字面量初始化数组时，可以使用一串逗号来创建空位（hole）。
```js
const options = [,,,,,]; // 创建包含 5 个元素的数组
```
> 由于行为不一致和存在性能隐患，因此实践中要避免使用数组空位。如果确实需要空位，则可以显式地用 undefined 值代替。

#### 检测数组
- `value instanceof Array`
- `Array.isArray()`

#### 迭代器方法
- `keys()`  返回数组索引的迭代器
- `values()`  返回数组元素的迭代器
- `entries()`   返回 索引/值对的迭代器
```js
const a = ["foo", "bar", "baz", "qux"];

// 因为这些方法都返回迭代器，所以可以将它们的内容
// 通过 Array.from()直接转换为数组实例
const aKeys = Array.from(a.keys());
const aKeys = Array.from(a.values());
const aKeys = Array.from(a.entries());
```

```js
const a = ["foo", "bar", "baz", "qux"];

// 解构
for (const [idx, element] of a.entries()) {
  alert(idx);
  alert(element);
}
```

#### 复制和填充方法
##### `fill(v, start, end)` 
fill()方法可以向一个已有的数组中插入全部或部分相同的值。
  - start 开始索引用于指定开始填充的位置，它是可选的。如果不提供结束索引，则一直填充到数组末尾。
  - 负值索引从数组末尾开始计算。**也可以将负索引想象成数组长度加上它得到的一个正索引**
```js
const zeroes = [0, 0, 0, 0, 0];
// 用 5 填充整个数组
zeroes.fill(5);   // [5, 5, 5, 5, 5]
zoroes.fill(0);   // [0, 0, 0, 0, 0]

// 用 6 填充索引大于等于 3 的元素
zeroes.fill(6, 3);  // [0, 0, 0, 6, 6]
zoroes.fill(0);

// 用 7 填充索引大于等于 1 且小于 3 的元素
zeroes.fill(7, 1, 3);  // [0, 7, 7, 0, 0]
zoroes.fill(0);

// 用 8 填充索引大于等于 1 且小于 4 的元素 
// (-4 + zeroes.length = 1)
// (-1 + zeroes.length = 4)
zeroes.fill(8, -4, -1);
zeroes.fill(8, -4 + 5, -1 + 5);
// 这两个执行结果一致
```

该方法 `start`, `end` 如下方法传递会被忽略
- 索引过低(即使add length 也达不到正数)
  ```js
  zeroes.fill(1, -10, -6);
  console.log(zeroes);  // [0, 0, 0, 0, 0]
  ```
- 索引过高
  ```js
  zeroes.fill(1, 10, 15);
  console.log(zeroes);  // [0, 0, 0, 0, 0]
  ```
- 索引反向 (index 相反了)
  ```js
  zeroes.fill(2, 4, 2);
  console.log(zeroes);  // [0, 0, 0, 0, 0]
  ```
- 索引部分可用，填充可用部分 
  ```js
  zeroes.fill(4, 3, 10);
  console.log(zeroes);  // [0, 0, 0, 4, 4]
  ```

##### `copyWithin()`
copyWithin()会按照指定范围浅复制数组中的部分内容，然后将它们插入到指 定索引开始的位置。开始索引和结束索引则与 fill()使用同样的计算方法
```js
let ints,
reset = () => ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; reset();

// 从 ints 中复制索引 0 开始的内容，插入到索引 5 开始的位置
// 在源索引或目标索引到达数组边界时停止
ints.copyWithin(5);
console.log(ints); // [0, 1, 2, 3, 4, 0, 1, 2, 3, 4] 
reset();

ints.copyWithin(4);
console.log(ints); // [0, 1, 2, 3, 0, 1, 2, 3, 4, 5] 
reset();

// 从 ints 中复制索引 5 开始的内容，插入到索引 0 开始的位置
ints.copyWithin(0, 5);
console.log(ints); // [5, 6, 7, 8, 9, 5, 6, 7, 8, 9]
reset();

// 从0 开始到3（不包含3）结束的内容
// 插入到索引4开始
ints.copyWithin(4, 0, 3);
console.log(ints); // [0, 1, 2, 3, 0, 1, 2, 7, 8, 9]
reset();

// 支持负索引值，与 fill()相对于数组末尾计算正向索引的过程是一样的
// ints.copyWithin(-4, -7, -3);
ints.copyWithin(6, 3, 7);
console.log(ints); // [0, 1, 2, 3, 4, 5, 3, 4, 5, 6]
reset();
```
该方法 `start`, `end` 如下方法传递会被忽略
- 索引过低，忽略
- 索引过高，忽略
- 索引反向，忽略
- 索引部分可用，复制、填充可用部分

#### 转换方法
- `valueOf()` 返回的还是数组本身
- `toString()` 返回由数组中每个值的等效字符串拼接而成的一个逗号分隔的字符串。
- `toLocaleString()` 在调用数组的 toLocaleString()方法时，会得到一个逗号分隔的数组值的字符串。它与另外两个方法 唯一的区别是， 为了得到最终的字符串， 会调用数组每个值的 toLocaleString() 方法， 而不是 toString()方法。

#### 栈方法
- `push` 接收任意数量的参数，并将它们添加到数组末尾，返回数组的最新长度
- `pop` 移除最后一个元素，并返回数组的最后一项

#### 队列方法
- `shift()` 会删除数 组的第一项并返回它，然后数组长度减1, 使用 shift()和 push()，可以把数组当成队列来使用;
- `unshift()` 在数组开头添加任意多个值，然后返回新的数组长度。

#### 排序方法
- `reverse()` 将数组元素反向排列。
- `sort()` 默认情况下,会按照升序重新排列数组元素(转换为的字符串的诸个字符的Unicode位点进行排序), 为此， sort()会在每一项上调用 String()转型函数，然后比较字符串来决定顺序。

#### 操作方法
- `concat()` 可以在现有数组全部元素基础上创建一个新数组。
- `slice()` 用于创建一个包含原有数组中一个或多个元素的新数组。

#### 搜索和位置方法
- `indexOf()` 从数组前头（第一项） 开始向后搜索,返回要查找的元素在数组中的位置,如果没找到则返回1。
- `lastIndexOf()` 从数组末尾（最后一项）开始向前搜索。返回要查找的元素在数组中的位置,如果没找到则返回1。
- `includes()` 数组是否存在某一个元素

#### 迭代方法
- `every()` 对数组每一项都运行传入的函数，如果对每一项函数都返回true，则这个方法返回true。
- `filter()` 对数组每一项都运行传入的函数，函数返回 true 的项会组成数组之后返回。
- `forEach()` 对数组每一项都运行传入的函数，没有返回值。
- `map()` 对数组每一项都运行传入的函数，返回由每次函数调用的结果构成的数组。
- `some()` 对数组每一项都运行传入的函数，如果有一项函数返回 true，则这个方法返回 true。

#### 归并方法
- `reduce()`
- `reduceRight()`

### 定型数组
定型数组（typed array）是 ECMAScript 新增的结构，目的是提升向原生库传输数据的效率。实际上， JavaScript 并没有“TypedArray”类型，它所指的其实是一种特殊的包含数值类型的数组。

#### ArrayBuffer
ArrayBuffer 是所有定型数组及视图引用的基本单位。
ArrayBuffer()是一个普通的 JavaScript 构造函数，可用于在内存中分配特定数量的字节空间。
```js
const buf = new ArrayBuffer(16);    // 在内存中分配 16 字节
alert(buf.byteLength);    // 16
```
> ArrayBuffer 一经创建就不能再调整大小。不过，可以使用 slice()复制其全部或部分到一个新 实例中

-----   占坑  ------

### Map


