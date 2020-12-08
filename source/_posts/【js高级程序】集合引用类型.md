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
ECMAScript 数组也是一组有序的数据，但跟其他语言 不同的是，数组中每个槽位可以存储任意类型的数据。这意味着可以创建一个数组，它的第一个元素 是字符串，第二个元素是数值，第三个是对象。ECMAScript 数组也是动态大小的，会随着数据添加而 自动增长。

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
- `of()` 用于将一组参数转换为数组实例。