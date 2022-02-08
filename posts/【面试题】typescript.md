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

### 范型如何设置默认值
```ts
interface Component<S = {}> {
  state: S;
}
```

### 枚举和 object 的区别
- 写法不一致
- 枚举解析的是 key，value； value，key都有
  ```js
  var itemCategory;
  (function (itemCategory) {
    itemCategory[itemCategory["healing"] = 0] = "healing";
    itemCategory[itemCategory["crafting"] = 1] = "crafting";
    itemCategory[itemCategory["armor"] = 2] = "armor";
    itemCategory[itemCategory["weapon"] = 3] = "weapon";
    //...
  })(itemCategory || (itemCategory = {}));
  ```

### window 扩展类型
```ts
declare global {
  interface Window {
   module_name: any;
  }
}
```

### never 与 void
当一个函数返回空值时，它的返回值为 void 类型，但是，当一个函数永不返回时（或者总是抛出错误），它的返回值为 never 类型。

### typescript中，class, abstract class, interface 在tsc 之后会产生代码吗？
`abstract class`: 会产生
`interface`: 不会
`class`: 会，会被打成es5 的构造函数

### `implement Partial<T>`
`Partial<T>` 返回一个包含所有T的子集的type。
请自行实现MyPartial<T>。

```ts
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}
```

### `implement Required<T>`
```ts
type MyRequired<T> = {
  [K in keyof T]-?: T[K];
}
```

### `implement Readonly<T>`
``` ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

type Foo = {
  a: string
}

const a:Foo = {
  a: 'BFE.dev',
}
a.a = 'bigfrontend.dev'
// OK

const b:MyReadonly<Foo> = {
  a: 'BFE.dev'
}
b.a = 'bigfrontend.dev'
// Error
```

### implement Record<K, V>
```ts
type MyRecord<K extends number | string | symbol, V> = {
  [P in K]: V;
}

type Key = 'a' | 'b' | 'c'

const a: Record<Key, string> = {
  a: 'BFE.dev',
  b: 'BFE.dev',
  c: 'BFE.dev'
}
a.a = 'bigfrontend.dev' // OK
a.b = 123 // Error
a.d = 'BFE.dev' // Error
```

### implement Pick<T, K>
```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
}

type A = MyPick<Foo, 'a' | 'b'> // {a: string, b: number}
```

### implement Omit<T, K>
```ts
type MyOmit<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P]
}

type B = MyOmit<Foo, 'c'> // {a: string, b: number}
```

### implement Exclude<T, E>
```ts
type MyExclude<T, E> = T extends E ? never : T;

type C = MyExclude<Foo, 'c' | 'd'>  // 'a' | 'b'
```

### implement Extract<T, U>
```ts
type MyExtract<T, U> = T extends U ? T : never;

type C = MyExtract<Foo, 'b' | 'c' | 'd' | 'e'>  // 'b' | 'c'
```

### implement NonNullable<T>
```ts
type MyNonNullable<T> = Exclude<T, null | undefined>

type Foo = 'a' | 'b' | null | undefined

type A = MyNonNullable<Foo> // 'a' | 'b'
```

### implement Parameters<T>
```ts
type MyParameters<T extends Function> = T extends (...args: infer P) => any ? [...P] : unknown[]
```

### implement ConstructorParameters<T>
```ts
type MyConstructorParameters<T extends new (...args: any) => any>
  = T extends new (...args: infer U) => any ? U : never;
```

### implement ReturnType<T>
```ts
type MyReturnType<T extends Function>
  = T extends (...args: any[]) => infer R ? R : never;
```

### implement InstanceType<T>
```ts
type MyInstanceType<T extends new (...args: any[]) => any>
  = T extends new (...args: any) => infer R ? R : never;
```

### implement ThisParameterType<T>
```ts
type MyThisParameterType<T extends Function>
  = T extends (this: infer P, ...args: any[]) => any ? P : unknown
```

###  implement OmitThisParameter<T>
`Function.prototype.bind()` 返回一个this已经bind过后的`function`。 对于这种情况，可以用 `OmitThisParameter<T>` 来增加 `type` 信息。
请自行实现 `MyOmitThisParameter<T>`。
```ts
function foo(this: {a: string}) {}
foo() // Error

const bar = foo.bind({a: 'BFE.dev'})
bar() // OK

type Foo = (this: {a: string}) => string
type Bar = MyOmitThisParameter<Foo> // () => string
```
答案：
```ts
type MyOmitThisParameter<T extends Function>
  = T extends (this: any, ...args: infer P) => infer R ? (...args: P) => R : T;
```