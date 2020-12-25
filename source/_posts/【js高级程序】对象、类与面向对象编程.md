---
title: 【js高级程序】对象、类与面向对象编程
date: 2020-12-25 08:18:07
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第8章*

ECMA-262 将对象定义为一组属性的无序集合。严格来说，这意味着对象就是一组没有特定顺序的值。

### 理解对象
创建自定义对象的通常方式是创建 Object 的一个新实例，然后再给它添加属性和方法
```js
let person = new Object();
person.name = "Nicholas";
person.age = 29;
person.job = "Software Engineer";
person.sayName = function() {
  console.log(this.name);
};
```
字面量创建
```js
let person = {
  name: "Nicholas",
  age: 29,
  job: "Software Engineer",
  sayName() {
    console.log(this.name);
  }
};
```

#### 数据属性
数据属性有 4 个特性描述它们的行为。
- `[[Configurable]]` 
  - 是否可以通过 delete 删除并重新定义
  - 是否可以修改它的特性
  - 是否可以把它改为访问器属性。
  - 默认为 **`true`**
- `[[Enumerable]]`
  - 是否可以通过 `for-in` 返回属性
  - 默认为 **`true`**
- `[[Writable]]`
  - 是否可以被修改
  - 默认为 **`true`**
- `[[Value]]`
  - 包含属性的实际值，即前面提到的那个读取和写入属性值的位置
  - 默认为 **`undefined`**

在像前面例子中那样将属性显式添加到对象之后， [[Configurable]] 、 [[Enumerable]] 和 [[Writable]]都会被设置为 true，而[[Value]]特性会被设置为指定的值。
```js
const person = {
  name: "Nicholas"
}
```
创建一个 `person` 对象 `name` 属性为 `Nicholas`, 可以通过 `Object.getOwnPropertyDescriptors(person)` 查看对象的属性信息
```js
console.log(Object.getOwnPropertyDescriptors(person));
// name:
//   configurable: true
//   enumerable: true
//   value: "Nicholas"
//   writable: true
```

#### 访问器属性
访问器属性不包含数据值。相反，它们包含一个获取`（getter）`函数和一个设置`（setter）`函数，不过这两个函数不是必需的。

- `[[Configurable]]` 
  - 是否可以通过 delete 删除并重新定义
  - 是否可以修改它的特性
  - 是否可以把它改为访问器属性。
  - 默认为 **`true`**
- `[[Enumerable]]`
  - 是否可以通过 `for-in` 返回属性
  - 默认为 **`true`**
- `[[Get]]`
  - 获取函数，在读取属性时调用
  - 默认值为 **`undefined`**
- `[[Set]]`
  - 获取函数，在写入属性时调用
  - 默认值为 **`undefined`**

访问器属性是不能直接定义的，必须使用 Object.defineProperty()。

