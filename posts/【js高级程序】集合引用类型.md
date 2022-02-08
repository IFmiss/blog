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
作为 ECMAScript 6 的新增特性，Map 是一种新的集合类型，为这门语言带来了真正的键/值存储机制。
```js
const m = new Map();
```
```js
const m1 = new Map([
  ["key1", "val1"],
  ["key2", "val2"],
  ["key3", "val3"]
]);

m1.size;  // 3

// 使用自定义迭代器初始化
const m2 = new Map({
  [Symbol.iterator]: function * () {
    yield ["key1", "val1"],
    yield ["key2", "val2"],
    yield ["key3", "val3"],
  }
})
m2.size;  // 3

m2.get('key1'); // val1
m1.has('key2'); // true
```

- `has` 是否存在对应属性值
- `set` 设置健值对，返回映射实例，因此支持链式调用
- `get` 获取当前属性的对应值
- `delete` 删除一个键值对
- `clear`  清除这个映射实例中的所有键值对

#### 顺序与迭代
与 Object 类型的一个主要差异是，**Map 实例会维护键值对的插入顺序**，因此可以根据插入顺序执行迭代操作。

entries()方法（或者 Symbol.iterator 属性，它引用 entries()）取得这个迭代器
```js
const m = new Map([
  ["key1", "val1"],
  ["key2", "val2"],
  ["key3", "val3"]
]);

alert(m.entries === m[Symbol.iterator]); // true

for (let p of m.entries()) {
  console.info(p);
}
for (let p of m[Symbol.iterator]()) {
  console.info(p);
}

// 一致的结果
// [key1,val1]
// [key2,val2]
// [key3,val3]
```

如果不使用迭代器，而是使用回调方式，则可以调用映射的 forEach(callback, opt_thisArg) 方法并传入回调，依次迭代每个键/值对。
```js
m.forEach((val, key) => alert(`${key} -> ${val}`));
// key1 -> val1
// key2 -> val2
// key3 -> val3
```

#### 选择 Object 还是 Map
**内存占用**: 不同浏览器的情况不同，但给定固定大小的内存，Map 大约可以比 Object 多存储 50%的键/值对
**插入性能**: 向 Object 和 Map 中插入新键/值对的消耗大致相当，不过插入 Map 在所有浏览器中一般会稍微快 一点儿。
**查找速度**: 与插入不同，从大型 Object 和 Map 中查找键/值对的性能差异极小，但如果只包含少量键/值对， 则 Object 有时候速度更快。
**删除性能**: 对大多数浏览器引擎来说，Map 的 delete()操作都比插入和查找更快。 如果代码涉及大量删除操作，那么毫无疑问应该选择 Map。

### WeakMap
ECMAScript 6 新增的“弱映射”（WeakMap）是一种新的集合类型，为这门语言带来了增强的键/ 值对存储机制。

WeakMap 中的“weak”（弱），描述的是 JavaScript 垃圾回收程序对待“弱映射”中键的方式。
```js
const key1 = {id: 1},
  key2 = {id: 2},
  key3 = {id: 3}
// 使用嵌套数组初始化弱映射
const wm1 = new WeakMap([
  [key1, "val1"],
  [key2, "val2"],
  [key3, "val3"]
]);

// 初始化是全有或全无的操作 
// 只要有一个键无效就会抛出错误，导致整个初始化失败
const wm2 = new WeakMap([
  [key1, "val1"],
  ["BADKEY", "val2"],
  [key3, "val3"]
]);
// TypeError: Invalid value used as WeakMap key
typeof wm2;
// ReferenceError: wm2 is not defined
```
初始化之后可以使用 set()再添加键/值对，可以使用 get()和 has()查询，还可以使用 delete() 删除

#### 弱键
WeakMap 中“weak”表示弱映射的键是“弱弱地拿着”的。意思就是，这些键不属于正式的引用，不会阻止垃圾回收。但要注意的是，弱映射中值的引用可**不是**“弱弱地拿着”的。只要键存在，键/值 对就会存在于映射中，并被当作对值的引用，因此就不会被当作垃圾回收。
```js
const wm = new WeakMap();

const container = {
  key: {}
};
wm.set(container.key, "val");
wm.get(container.key);  // val
function removeReference() {
  container.key = null;
}
removeReference();
wm.get(container.key);  // undefined
```
如果调用了 removeReference()，就会摧毁键对象的最后一个引用，垃圾回收程序就可以 把这个键/值对清理掉。

#### 不可迭代键
因为 WeakMap 中的键/值对任何时候都可能被销毁，所以没必要提供迭代其键/值对的能力。

### Set
ECMAScript 6 新增的 Set 是一种新集合类型，为这门语言带来集合数据结构。Set 在很多方面都 像是加强的 Map，这是因为它们的大多数 API 和行为都是共有的。
```js
const s1 = new Set(["val1", "val2", "val3"]);
alert(s1.size);

// 使用自定义迭代器初始化集合
const s2 = new Set({
  [Symbol.iterator]: function*() {
    yield "val1";
    yield "val2";
    yield "val3";
  }
});
alert(s2.size); // 3
```
集合也使用 SameValueZero 操作（ECMAScript 内部定义，无法在语言中使用），基本上相当于使用严格对象相等的标准来检查值的匹配性。
```js
const s = new Set();

const functionVal = function() {};
const symbolVal = Symbol();
const objectVal = new Object();

s.add(functionVal);
s.add(symbolVal);
s.add(objectVal);

console.info(s.has(functionVal))  // true
console.info(s.has(symbolVal))  // true
console.info(s.has(objectVal))  // true

// SameValueZero 检查意味着独立的实例不会冲突
alert(s.has(function() {})); // false
```

add()和 delete()操作是幂等的。delete()返回一个布尔值，表示集合中是否存在要删除的值
```js
const s = new Set();

s.add('foo');
s.size;   // 1
s.add('foo');
s.size;   // 1

s.delete('foo');    // true
s.delete('foo');    // false
```

#### 顺序与迭代
Set 会维护值插入时的顺序，因此支持按顺序迭代。

可以通过 values()方 法及其别名方法 keys()（或者 Symbol.iterator 属性，它引用 values()）取得这个迭代器
```js
const s = new Set(["val1", "val2", "val3"]);
s.values == s[Symbol.iterator]
s.keys == s[Symbol.iterator]
```
因为 values()是默认迭代器，所以可以直接对集合实例使用扩展操作，把集合转换为数组：
```js
const s = new Set(["val1", "val2", "val3"]);
console.log([...s]); // ["val1", "val2", "val3"]
```

### WeakSet
WeakSet 中的“weak”（弱），描述的是 JavaScript 垃圾回收程序对待“弱集合”中值的方式。
```js
const ws = new WeakSet();

const val1 = {id: 1},
  val2 = {id: 2},
  val3 = {id: 3}
const ws1 = new WeakSet([val1, val2, val3]);

// 初始化是全有或全无的操作
// 只要有一个值无效就会抛出错误，导致整个初始化失败
const ws2 = new WeakSet([val1, "BADVAL", val3]);
// TypeError: Invalid value used in WeakSet
typeof ws2;
// ReferenceError: ws2 is not defined
```
初始化之后可以使用 add()再添加新值，可以使用 has()查询，还可以使用 delete()删除

### 小结
JavaScript 中的对象是引用值，可以通过几种内置引用类型创建特定类型的对象。

- 引用类型与传统面向对象编程语言中的类相似，但实现不同。
- Object 类型是一个基础类型，所有引用类型都从它继承了基本的行为。
- Array 类型表示一组有序的值，并提供了操作和转换值的能力。
- 定型数组包含一套不同的引用类型，用于管理数值在内存中的类型。
- Date 类型提供了关于日期和时间的信息，包括当前日期和时间以及计算。
- RegExp 类型是 ECMAScript 支持的正则表达式的接口，提供了大多数基本正则表达式以及一些 高级正则表达式的能力。

JavaScript 比较独特的一点是，函数其实是 Function 类型的实例，这意味着函数也是对象。由于 函数是对象，因此也就具有能够增强自身行为的方法。

因为原始值包装类型的存在，所以 JavaScript 中的原始值可以拥有类似对象的行为。有 3 种原始值 包装类型：Boolean、Number 和 String。它们都具有如下特点。
- 每种包装类型都映射到同名的原始类型。
- 在以读模式访问原始值时，后台会实例化一个原始值包装对象，通过这个对象可以操作数据。
- 涉及原始值的语句只要一执行完毕，包装对象就会立即销毁。

JavaScript 还有两个在一开始执行代码时就存在的内置对象：Global 和 Math。

ECMAScript 6 新增了一批引用类型：Map、WeakMap、Set 和 WeakSet。这些类型为组织应用程序 数据和简化内存管理提供了新能力。

