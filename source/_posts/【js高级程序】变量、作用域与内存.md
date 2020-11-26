---
title: 【js高级程序】变量、作用域与内存
date: 2020-11-26 22:47:48
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第4章*

### 原始值与引用值
**原始值** 就是最简单的数据
> 目前有六种原始值 Undefined、Null、Boolean、Number、String 和 Symbol、BigInt

**引用值** 由多个值构成的对象
引用值是保存在内存中的对象。
JavaScript 不允许直接访问内存位置，因此也就 不能直接操作对象所在的内存空间。在操作对象时，实际上操作的是对该对象的引用(reference)而非 实际的对象本身。为此，保存引用值的变量是按引用(by reference)访问的。

#### 动态属性
原始值和引用值的定义方式很类似，都是创建一个变量，然后给它赋一个值。
