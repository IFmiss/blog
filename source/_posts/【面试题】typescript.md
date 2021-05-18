---
title: 【面试题】typescript
date: 2021-03-29 18:50:49
categories: typescript
tags: [typescript, 面试]
---

### 访问修饰符

- `public` 都可以在任何地方进行访问。
- `private` 只能在类定义内部进行访问。
- `protected` 的属性和方法可以从类定义内部访问，也可以从子类中访问。
- `readonly` 属性设置为只读的

### interface 与 type 的区别

- `type` 可以声明基本类型别名，使用交叉类型、联合类型等，`interface` 不行
- `type` 语句中还可以使用 `typeof` 获取实例的 类型进行赋值
  ```js
  type B = typeof div;
  ```
- `interface` 同类型声明可以被合并，而 `type` 不行。

### 范型 pick/Partial/record ...

- [TypeScript 高级特性](https://mp.weixin.qq.com/s/VWggn-5JdbJon6ZzxHPqHw)


### implements 与 extends 的区别
- `implements` 必须要实现定义在父类的所有方法，且不需要定义 super 方法
- `extends` 不需要实现父类的所有方法，且需要 super 做 this 指向的修改

