---
title: TypeScript接口，类，函数
date: 2019-03-31 11:19:38
categories: typescript
tags: [js, ts]
---

### 接口(interface)
接口从类型定义来说和type很像，但是两者也有区别和差异

#### interface 和 type的区别
- 都可以描述一个对象或者函数（共同点）
```ts
type User = {
  name: string;
  age: number;
}

interface User {
  name: string;
  age: number;
}
```
- type可以声明基本类型别名，联合类型，元组等类型，而interface则不可以
```ts
type Name = string;

interface InfoA {
  name: string;
  reset(): void;
}

interface InfoB {
  name: string;
  reset(): void;
}

type InfoAll = InfoA | InfoB
type InfoList = [InfoA, InfoB]
```
- interface的声明可以合并，type不可以
```ts
interface Info {
  name: string;
  age: number;
}
interface Info {
  sex: number
}

// Info 会有三个属性类型定义 相当于属性合并
```
反正按照tslint规范来说，最好是用interface

#### 基本用法
```ts
interface User {
  name: string;
  age: number;
  readonly brithday: string;   // brithday 属性不可以被重新赋值
  sex?: number;   // 可选属性
}

function setUser (user: User): void {
  // ....
}
```

### 类(class)
类的定义和es6的class定义相同，不过typescript支持各种类型修饰符以及静态属性等操作
#### 基本定义
```ts
class UserInfo {
  name: string;
  age: number;
  constructor: (name: string; age: number) {
    this.name = name;
    this.age = age;
  }
  disc () {
    return `${this.name}已经${this.age}岁了`
  }
}
const user = new UserInfo ('Dw', 26)
user.name   // Dw
user.disc()   // Dw已经26岁了
```
#### 继承
```ts
class Student extends UserInfo {
  grade: string;
  constructor: (grade: string; name: string; age: number) {
    this.grade = grade
    super()
  }
}
const student = new Student('四年级', 'Dw', 26)
```

#### 公共，私有与受保护的修饰符
```ts
class User {
  private name: string
  constructor(name: string) {
    this.name = name
  }
}
new User('dw').name  // 错误: 'name' 是私有的
```
protected修饰符与private修饰符的行为很相似，但protected成员在派生类中（继承的类中）仍然可以访问

#### 静态属性
```ts
class User {
  static name: string
  getName function (): string {
    return User.name
  }
}
```
static定义的属性不能通过this.name访问，只能通过User.name访问到

### 函数
和JavaScript一样，TypeScript函数可以创建有名字的函数和匿名函数
#### 函数类型
```ts
function add (x: number, y: number): number {
  return x + y
}
```
参数里定义的是参数的类型，括号后面的定义number是这个方法的返回值

#### 可选参数和默认参数
```ts
function bindName (firstName: string, lastName?: string): string {
  if (lastName) {
    return firstName
  }
  return `${firstName} - ${lastName}`
}
```
注意：可选参数必须跟在必须参数后面

#### this参数
```ts
function fn(this: void) {
  // ...
}
```
