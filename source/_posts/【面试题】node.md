---
title: 【面试题】node
date: 2021-03-29 18:50:57
categories: node
tags: [node, 面试]
---

### node 事件循环

Node 10 及以前:

![Node 事件循环](./【面试题】node/libuv.png)
Libuv 是一个高性能的，事件驱动的异步 I/O 库，它本身是由 C 语言编写的，具有很高的可移植性。
**事件循环的 7 个主要阶段**
**times：** setTimeout setInterval 回调
**I/O callbacks：** 处理异步事件的回调，比如网络 I/O，比如文件读取 I/O。当这些 I/O 动作都**结束**的时候，在这个阶段会触发它们的回调。（上一轮循环的回调）
**idle, prepare：** 这个阶段内部做一些动作，仅 node 内部使用
**I/O poll 阶段：** 获取新的 I/O 事件，适当的条件下 node 将阻塞在这里
**check：** 执行 setImmediate() 回调
**close callback：** 关闭 I/O 的动作，比如文件描述符的关闭，socket 断开，等等等

> process.nextTick 的操作，会在每一轮事件循环的最后执行

- 执行全局 Script 的同步代码
- 执行 microtask 微任务，先执行所有 Next Tick Queue 中的所有任务
- 在执行 Other Microtask Queue 中的所有任务
- 执行完成之后开始执行 macrotask 宏任务，共 6 个阶段，每个阶段红任务执行完成之后，再执行 步骤 2 ，然后继续执行下一个阶段的宏任务，再执行 步骤 2。
- 如：Times Queue -> 步骤 2 -> I/O Queue -> 步骤 2 -> Check Queue -> 步骤 2 -> Close Callback -> 步骤 2 -> Times Queue -> ...
- 这就是 Node 的 Event Loop

Node 11 以后:
类似浏览器事件循环
