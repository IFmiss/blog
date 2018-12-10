---
title: Vue源码学习
date: 2018-12-10 15:38:43
categories: vue
tags: [vue, 源码]
---

vue是当下最流行的前端框架，简单，易上手，使用场景丰富的特点，从刚学习vue到现在也有一年多了，期间从vue播放器，到个人网站，再到公司的一些vue项目，感觉对于vue的学习和了解也就是一些基本的操作。为了更深入了解vue的实现机制，开始学习和了解vue的源码。这也是基于 `[Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)`的学习
<!-- more -->

### 关于vue
vue: 一款MVVM框架
核心思想： 数据驱动
特点：低耦合，易上手，环境搭建方便

以下是边看 Vue.js 技术揭秘 边总结的一点对于vue认识，只是为了加深对于vue的认识和了解

### New Vue
1. 执行 init 方法 （如果没有new 实例化，会报错）
2. 合并配置
3. 初始化生命周期
4. 初始化events
5. 初始化渲染
6. 初始化data, props, computed, watcher等
在初始化的最后，检测到如果有 el 属性，则调用 vm.$mount 方法挂载 vm，挂载的目标就是把模板渲染成最终的 DOM

### Vue的$mount挂载
1. 判断挂载的元素是否是`body`, `html`
  vue 不允许挂载到body，html上 （提供的元素只能作为挂载点。不同于 Vue 1.x，所有的挂载元素会被 Vue 生成的 DOM 替换。因此不推荐挂载root实例到 <html> 或者 <body> 上。这是官方的解释）
2. 缓存了原型上的 $mount 方法，最后再重新定义该方法
```js
const mount = Vue.prototype.$mount
```
3. 生成render的方法
代码来自: [Vue实例属性之el,template,render](https://blog.csdn.net/hxy19971101/article/details/79948074)
```js
new Vue({
  el: '.app',
  data: {
    info: '这是通过el属性获取挂载元素的outerHTML方式渲染。'
  },
  template: '<div>这是template属性模板渲染。</div>',
  render: function(h){
    return h('div', {}, '这是render属性方式渲染。')
  }
})
```
  - 如果存在render函数，会优先渲染`render`方法里的内容 
  - 如果没有render函数，会先渲染`template`中的内容，且通过 `compileToFunctions` 来生成render方法
  - 如果上面两个都没有，则通过 template = `getOuterHTML(el)` 来设置模版，且通过 `compileToFunctions` 来生成render方法

最后都会调用原先原型上的 $mount 方法挂载。
```js
return mount.call(this, el, hydrating)
```
$mount 方法是定于在Vue.prototype上的方法
$mount 方法实际上会去调用 `mountComponent`
而 `mountComponent` 的核心作用就是
  - 先调用 vm._render 方法先生成虚拟 vNode
  - 再例化一个渲染Watcher
    ```js
      new Watcher(vm, updateComponent, noop, {
        before () {
          if (vm._isMounted) {
            callHook(vm, 'beforeUpdate')    // 如果已经是Mounted的状态， 则执行 beforeUpdate 的钩子函数
          }
        }
      }, true /* isRenderWatcher */)
    ```
  - 在它的回调函数中会调用 updateComponent 方法，最终调用 vm._update 更新 DOM。
    ```js
      if (vm.$vnode == null) {
        vm._isMounted = true
        callHook(vm, 'mounted')
      }
      return vm
    ```
    函数最后判断为根节点的时候设置 vm._isMounted 为 true， 表示这个实例已经挂载了，同时执行 mounted 钩子函数。 这里注意 vm.$vnode 表示 Vue 实例的父虚拟 Node，所以它为 Null 则表示当前是根 Vue 的实例。

### _render
Vue 的 _render 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node