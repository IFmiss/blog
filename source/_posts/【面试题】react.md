---
title: 【面试题】react
date: 2021-03-29 18:49:01
categories: react
tags: [react, 面试]
---

### React 项目有哪些细节优化，性能优化

- 资源模块路由懒加载
- 分包策略
- 骨架屏
- Suspence 与 lazy 动态加载
- SSR
- Service worker
- PureComponent + ShouldComponentUpdate
- React.memo
- useMemo, useCallBack
- componentDidCatch
- 保证数据的不可变
- web woker 密集型任务处理
- 不必要的标签使用 React.Fragment

### React 事件绑定原理

React 并不是将 click 绑定在真实 DOM 上，而是绑定在 document（17 版本绑定在 渲染 React 树的根 DOM 节点中）事件委托，当事件（合成事件： SyntheticEvent）冒泡到 document 时，React 将事件内容封装并交由真正的处理函数执行。
这样不仅减少内存消耗，也能在组件挂载销毁是统一订阅和一处事件。

> 通过事件名 + node key 获取事件的 handler 函数

### 为什么 React 17 的绑定是在渲染 React 树的根 DOM 节点中？

- 不同版本的 React 组件嵌套使用时，e.stopPropagation()无法正常工作
- React 嵌入使用其他技术构建的应用程序变得更加容易。

### React 组件通信方式

1. 父 -> 子组件通信

- props

2. 子 -> 父组件通信

- props + callback fn

3. 跨级组件通信

- props
- context
- 状态管理

4. 非嵌套关系组件

- 自定义 event 通信
- redux mobx 等状态管理
- 状态提升

### 说一下 React fiber

Fiber 其实指的是一种数据结构，它可以用一个纯 JS 对象来表示

**Fiber Reconciler** 每执行一段时间，都会将控制权交回给浏览器，可以分段执行
为了达到这个效果，则需要调度器(Scheduler) 来进行任务分配
高优先级的任务可以打断低优先级任务

```js
const fiber = {
  stateNode, // 节点实例
  child, // 子节点
  sibling, // 兄弟节点
  return, // 父节点
  payload, // 挂载的数据
  type, // 节点类型
};
```

**Fiber Reconciler** 在执行过程中，会分为 2 个阶段。

- **reconciliation(协调)**
  这个阶段会执行更新 state 和 props, 调用生命周期, diff, 更新 DOM 的操作。
  在 Diff 计算的时候，会生成一棵 Fiber 树，本质来说是一个链表。得出需要更新的节点信息。这一步是一个渐进的过程，可以被打断。`React`的`nextUnitOfWork`变量会保留对当前`Fiber`节点的引用。以便随时恢复遍历。
- **commit(提交)**
  这个阶段主要：更新 DOM 树、调用组件生命周期函数以及更新 ref 等内部状态。
  将需要更新的节点一次过批量更新，这个过程不能被打断。

### React Diff 算法

- **Tree Diff**
  只针对同级别比对，忽略 DOM 节点的跨层级移动
- **Component Diff**
  如果不是同一类组件，则直接删除，重新创建
- **elelment diff**
  对于同一层级的一组子节点，需要通过唯一 id 进行来区分

> **如果没有 id 来进行区分，一旦有插入动作，会导致插入位置之后的列表全部重新渲染。这也是为什么渲染列表时为什么要使用唯一的 key。**

### setState 是同步还是异步

- react 控制的事件处理函数中，setState 是异步的，如 onClick 等
- setTimeout，Promise 中是同步
- 原生事件下为同步

setTimeout，Promise， 原生事件 不执行事务的 batchUpdates。isBatchingUpdates 则为 false。

### 虚拟 DOM 比 真实 DOM 快？

虚拟 DOM 可以看做 JavaScript 对象树。用 js 描述真实 DOM 信息。虚拟 DOM 通过新老数据变化，对比两棵树的差异，更新视图。

**通过事务处理机制**，将多次 DOM 的修改结果，一次性更新到页面上，从而有效的减少页面渲染次数，减少修改 DOM 的重绘重拍次数，提高渲染性能。

> Virtual DOM 的优势不在于单次的操作，而是在**大量、频繁的数据更新下**，能够对视图进行合理、高效的更新。
> 首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比`innerHTML` 慢
> **因此并不能说 虚拟 DOM 一定比 真实 DOM 操作快**

### 无状态组件？

- 不依赖自身状态 state。
- 根据外部传入的 props 进行渲染组件，props 变化触发组件渲染。

### 介绍以下 react redux 的工作流

1. `Provider` 组件用来挂载 redux 返回的 store 对象，同时将整个应用作为`Provider`的子组件。
2. `connect` 通过 `context` 获取 `Provider` 中的 store
3. `action` 可以看做一个交互动作,改变应用状态或 view 的更新,都需要通过触发 action 来实现
4. `reducer` 是一个纯函数，返回值只和传入的参数有关，返回新的 state

### 为什么 reducer 是纯函数

reducer 用于返回新的 state，redux 针对新老 state 使用 `===`比较，如果 state 有变化，直接返回新的 state（配合 Object.assign）表示需要重新 render 组件。否则直接返回默认 state。

### redux 不直接操作 store 而是返回新的 state

- 若不创建副本,redux 的所有操作都将指向内存中的同一个 state,我们将无从获取每一次操作前后,state 的具体状态与改变
- state 所有的修改都被集中化处理，且严格按照一个接一个的顺序执行，因此不用担心竞态条件（race condition）的出现。

### Redux 三大原则

- 单一数据源
- State 只读
- 使用纯函数来执行修改

### redux connect 作用？ Provider 作用？

- `connect` 函数就是一个高阶组件，将以下的参数传入函数，以 props 的形式传递方法和值，返回一个新的组件

```js
return connect(mapStateToProps, mapDispatchToProps)(Component);
```

- `Provider` 组件用来挂载 redux 返回的 store 对象，同时将整个应用作为`Provider`的子组件。
  **只有当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染**。

### react Suspense 与 react.lazy

- `Suspense` 组件可以“等待”一些代码加载，并在我们等待时以声明方式指定加载状态
- `React.lazy` 方法可以异步加载组件文件, 不能单独使用，需要配合 `React.suspense`
  > `React.lazy` 使用 `import` 来懒加载组件，import 在 webpack 中最终会调用 `requireEnsure` 方法，动态插入 script 来请求 js 文件

### React 高阶组件，renderProps，Hooks？优劣势？

- **HOC**
  高阶函数，传入无状态组件作为参数，返回一个新组件。
  - **优势：**
    1. 高阶组件就是一个没有副作用的纯函数，各个高阶组件不会互相依赖耦合
    2. 高阶组件并不关心数据使用的方式和原因，而被包裹的组件也不关心数据来自何处。高阶组件的增加不会为原组件增加负担
  - **劣势：**
    1. 属性被写死，无法复用。
    2. 嵌套地狱，难以维护。
    3. 当有多个 HOC 一同使用时，无法直接判断子组件的 props 是哪个 HOC 负责传递的
    4. HOC 可以劫持 props，在不遵守约定的情况下也可能造成冲突。
    5. 静态构建，也就是说生成的是一个新的组件，并不会马上 render，HOC 组件工厂是静态构建一个组件，这类似于重新声明一个组件的部分。也就是说，HOC 工厂函数里面的声明周期函数，也只有在新组件被渲染的时候才会执行。
- **renderProps**
  是一个用于告知组件需要渲染什么内容的函数 prop。

  - **优势：**
    1. 不用担心 prop 的命名问题，在 render 函数中只取需要的 state
    2. 相较于 HOC，不会产生无用的空组件加深层级
    3. 是动态构建的。
  - **劣势：**
    1. 容易导致嵌套地狱

- **Hooks**
  本质是一个数组，在不同时间段按顺序执行数组里的代码，实现 `class` 组件的生命周期以及 `state` 的状态信息
  - **优势：**
    1. 代码量减少
    2. 代码更容易被复用
    3. 避免地狱式嵌套
    4. 让组件更容易理解
  - **劣势：**
    1. `hooks` 是每次渲染都执行的，可以通过依赖参数优化
    2. 闭包，性能问题

### 受控组件和非受控组件

- 双向数据绑定就是受控组件
- 通过 `ref` 从 `dom` 节点上获取数据

### React context 理解？

`Context` 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

组件的 `Context` 由其父节点链上的所有组件通过 `getChildContext` 方法返回的 Context 对象组合而成，因此，组件通过 `Context` 可以访问到其父组件链上的所有节点提供的 Context 属性。

### React 单项数据流的好处

- 数据流方向可跟踪，追查问题快捷
- view 发出 action 不修改原有的 state 而是返回一个新的数据级，可以保存 state 的历史记录

### setState 原理

setState 最终会走向 `forceUpdate`，每个类组件都有一个 `updater` 对象用于管理 state 的变化

- setState 传入内容时候，会将值存入 为 true，将当前的 `updater` 的 `pendingState` 中
- 调用 `updater` 的 `emitUpdate` 决定是否立即更新，判断条件简单来说是否有 nextProps 或者 `updateQueue` 的 `isPending` 是否开启
- 如果 `updateQueue` 的`isPending` 为 true，将当前的 `updater` 直接加入 `updateQueue` 中
- 开启 `isPending` 方式可以是自定义方法和生命周期函数等等
- 当这些方法执行完毕更新 `updater`, 调用 `updater` 的 componentUpdate， 判断组件的 `shouldComponentUpdate` 决定是否调用 `forceUpdate` 进行更新。

### React 为什么要删除那几个旧的生命周期？

React16 被废弃的生命周期在 render 之前， fiber 的出现，在调和过程中，可能因为高优先级任务出现而打断现有的任务导致他们被执行多次。

### 为什么 useState 使用的是数组而不是对象？

因为需要索引保证数组的顺序一一执行

### React key 是干嘛用的，为什么要加？

主要用于追踪哪些列表中的元素被修改，被添加，或者被溢出的辅助标志。

React Diff 算法中，React 会借助元素的 key 值来判断该元素是新创建的还是被移动而来的元素，从而减少不必要的元素重渲染。

### React 和 Vue 的区别

- **数据流**
  - vue 双向数据绑定
  - React 提倡单向数据流
- **模板 vs JSX**
  - vue 是 vue 模版
  - react 是 jsx
- **数据变化监听**
  - vue 是 ObjectDefineproperty OR Proxy 实现数据的响应处理。
  - React 默认通过比较引用的方式比较，强调数据的不可变。

### React 性能优化

- `React.PureComponent` 对`props`和`state`进行浅层比较。
- `React.PureComponent` 下使用`shouldComponentUpdate`判断`state`和`props`是否更新。返回`true`更新，返回`false`不更新。
- `React.memo`默认会对`props`进行浅层比较。`React.memo`的第二个参数可以自定义`props`比较, 返回`true`不更新, 和`shouldComponentUpdate`相反。
- 在函数组件之中使用`useCallback`或者`useMemo`避免在更新时变量，方法的重复声明。
- 按需加载
  - 基于路由的按需加载
  - 使用`Suspense`和`lazy`实现组件懒加载
- 批量更新，无论是在`class`组件还是`fc`组件。更新都会合并。但是在`setTimeout`或者`Promise`等异步代码中批量更新会失效。可以使用`react-dom`提供的`unstable_batchedUpdates`手动批量更新。
- 对于在`jsx`中没有使用的状态, `class`组件可以直接使用实例的属性保存，对于`fc`组件可以使用`useRef`。
- 超长列表可以使用虚拟列表技术。实际只渲染部分列表
- 时间分片, 使用`requestAnimationFrame`，或者使用`setTimeout`分割渲染任务，比如从一次性渲染`100000`个列表，使用`requestAnimationFrame`分割成多次渲染。因为`requestAnimationFrame`会在每一次渲染之前执行，使用`requestAnimationFrame`可以分割成多次渲染，每一次渲染`10000`条。

### React 错误边界

目的是某些 UI 崩溃，不至于整个 webapp 崩溃，通过 `componentDidCatch` 监听错误内容

```js
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // 你同样可以将错误日志上报给服务器
  console.group();
  console.log('ErrorBoundary catch a error:');
  console.info('error', error);
  console.info('error info', errorInfo);
  console.groupEnd()
}
```

> ⚠️ 必须是 class 组件。

> ⚠️ 错误边界无法捕获如下场景的错误
> 事件处理
> 异步代码（例如 setTimeout 或 requestAnimationFrame 回调函数）
> 服务端渲染
> 它自身抛出来的错误（并非它的子组件）

### 为什么 react 需要手动引入 `import React from 'react'`

- 本质上来说 JSX 是 React.createElement(component, props, ...children)方法的语法糖。所以我们如果使用了 JSX，我们其实就是在使用 React，所以我们就需要引入 React

### Component 和 PureComponent 的区别

React.PureComponent 与 React.Component 几乎完全相同，**但 React.PureComponent 通过 props 和 state 的浅对比来实现 shouldComponentUpate()**
