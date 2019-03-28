---
title: TypeScript初识
date: 2019-03-28 23:22:27
categories: typescript
tags: [js, ts]
---

### 背景
JavaScript是一种弱类型语言，也就是所有的变量命名都是var来定义，es6多了const,和let来定义变量，所有类型的变量都是这几种方式定义，不做类型限制会导致代码在执行的时候会有执行错误如：
```js
let a = 1
a.toFixed()

// 此时如果a被赋值了一个字符串
a = '1'
a.toFixed()    // 此时则会报错 因为String对象下并没有toFixed方法
```
如果使用typescript定义一个变量为number类型，则不会允许字符串替换之前的number变量，所以`很大程度上避免`了这个问题
```ts
let a: number = 1
a.toFixed()

a = '1' // 此时就会提示错误，用户则会知道字符串无法替换，同样，也不存在toFixed方法
```
很大程度上避免是指在开发时候遇到静态数据替换的时候可以避免，当有动态数据赋值的时候，好像还是没法做到限制

以下只是常用的地方的记录

### 变量类型定义
```ts
const ts: number = 1
const ts: string = 2
const ts: any = 3
const ts: boolean = true
const ts: string[] = ['1', '2', '3']
const ts: any[] = ['1', 1, undefind]
const ts: number = [1, 2, 3]
const ts: Array<number> = [1, 2, 3]
enum Type {
  YES,    // 0
  NO      // 1
}
function test (): void {}   // 没有返回值的方法
function test (): number {
  return 1                  // 返回值为1的方法
}
const ts: null = null

// 对象的定义  比如定义一个学生，有性别，名字，年龄
interface IUserInfo {
  name: string; // 中文或者英文
  sex: number;  // 0 1
  age: number;  // 12
}
const user: IUserInfo = {
  name: 'dw',
  age: 26,
  sex: 1
}
```

----------
ps: 记录自己在做项目开发中使用到typescript感受到方便实用的地方

未完待续
