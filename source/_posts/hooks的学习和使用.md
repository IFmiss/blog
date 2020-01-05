---
title: react hooks的学习和使用
date: 2020-01-05 15:14:03
categories: react
tags: [react, js]
---
react hook 是react 在16.8的react新特性，使用hooks可以在函数组件中实现class组件中的状态和生命周期等一些功能

### 为什么会有Hook 
- 在组件之间复用状态逻辑很难
- 复杂组件变得难以理解(不同生命周期的代码无法被抽象出来，react-hook可以通过自定义hook解决这个问题)
- 难以理解的 class

### Hook 使用规则
- 只在最顶层使用hook，不要在循环、条件或嵌套函数中调用hook
- 只在react函数中调用hook，不要在普通的JavaScript函数中使用hook

### useState
```tsx
import React, {
  useState
} from 'react'

const Test = function (props) {
  const [count, setCount] = useState(0)

  return(
    <span onClick={() => setCount(count + 1)}>add<span>
  )
}
```
可以看到 `useState`函数传递一个唯一的初始值参数，并返回一个数组，数组的第一个值就是这个初始化的参数值，第二个值是一个方法，这个方法可以在内部操作count的值（执行count + 1）并触发rerender
#### `useState`是 `useReducer`封装实现
从preact源码可以看到
```js
export function useState(initialState) {
  // 调用useReducer函数
	return useReducer(invokeOrReturn, initialState);
}

function invokeOrReturn(arg, f) {
	return typeof f === 'function' ? f(arg) : f;
}
```

```js
// 当前hooks的执行顺序指针
let currentIndex;

// 当前的组件的实例
let currentComponent;

options._render = vnode => {
	if (oldBeforeRender) oldBeforeRender(vnode);
  // 当前的组件的实例
	currentComponent = vnode._component;

  // 每次索引在render 的时候会被重置
	currentIndex = 0;

  // 清除副作用 判断有没有写副作用的
  // 并将 _pendingEffects 置空
	if (currentComponent.__hooks) {
		currentComponent.__hooks._pendingEffects.forEach(invokeCleanup);
		currentComponent.__hooks._pendingEffects.forEach(invokeEffect);
		currentComponent.__hooks._pendingEffects = [];
	}
};

function invokeCleanup(hook) {
	if (hook._cleanup) hook._cleanup();   // 执行 useEffect 消除副作用的方法
}

// 在useEffect的时候设置了 state._value = callback;
// 如果有清除 effect的动作，实际上就是 函数return的返回值
function invokeEffect(hook) {
  // 函数return的返回值 也是一个清除副作用的一个方法 如： return () => clearInterval(id);
	const result = hook._value();   // 类似  () => clearInterval(id)
	if (typeof result === 'function') hook._cleanup = result;   // _cleanup 实际上是一个方法，所以可以在 invokeCleanup 执行这个方法
}
```

`getHookState` 方法，是hook组件很重要的一个函数，返回 索引为 index 的 hook的状态
```js
function getHookState(index) {
	if (options._hook) options._hook(currentComponent);

  // currentComponent 挂在hooks 属性 _list， _pendingEffects 并赋值给 hooks
	const hooks =
		currentComponent.__hooks ||
		(currentComponent.__hooks = { _list: [], _pendingEffects: [] });

	if (index >= hooks._list.length) {
		hooks._list.push({});
	}
	return hooks._list[index];
}
```

`useReducer` 方法
```js
export function useReducer(reducer, initialState, init) {
  // getHookState方法 获取 hookState 的状态， 会在 currentComponent.__hooks.list数组里添加一个新的 hook对象 并返回 hooks._list[index] 此时为 {}
  // currentIndex 是一个全局的变量，会记录当前的hook的索引，保证数据不会拿错，而在每一次render之后，currentIndex 会被重置为0
	const hookState = getHookState(currentIndex++);
	if (!hookState._component) {
		hookState._component = currentComponent;

    // 返回的_value 是一个长度为2的数组
		hookState._value = [
			!init ? invokeOrReturn(undefined, initialState) : init(initialState),

			action => {
				const nextValue = reducer(hookState._value[0], action);
				if (hookState._value[0] !== nextValue) {
					hookState._value[0] = nextValue;
					hookState._component.setState({});
				}
			}
		];
	}
	return hookState._value;
}
```
`useState` 返回两个值，按照我刚开始定义count 的state 来说
- 调用useReducer 的方法创建一个 `_list[++cureentIndex]` 的hook内容
- `hookState` 设置 _value 第一个值为 `invokeOrReturn(undefined, 0)`， 返回值是一个 0 的数字
- `hookState` 设置 _value 第二个值为一个方法，获取这个方法的执行结果，和当前的状态对比，如果变化了触发rerender，参数action 可以是值，也可以是一个带有返回值的 function

所以setState还可以这么写
```tsx
<span onClick={() => setCount(count => count + 1)}>add<span>
```

### useEffect
`useEffect` 跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API，而且用法更简单，他可以让我们在函数中进行数据请求，事件绑定等操作
```tsx
import React, {
  useState
} from 'react'

const Test = function (props) {
  const [count, setCount] = useState(0)
  // 第二个参数表示依赖的数据源，数据源变化会触发 useEffect 第一个参数内部的方法
  // 默认不设置的情况下rerender的场景下 effect 都会被调用
  // 为空数组表示该 effect 只会被调用一次
  // 如果为count 初始化的时候会调用一次，然后count变化一次则会调用一次， 数组中的任何一个元素变化都会触发 effect
  useEffect(() => {
    console.log('component did mount')
  }, [count])

  return(
    <div>
      <span>use Effect</span>
      <span>add</span>
    </div>
  )
}
```
以上就实现了一个 类似但不完全相等的 class语法的 componentDidMount 生命周期， 至于原因，可以看一下这篇文章 [https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)

#### 清除依赖
`useEffect` 有提供在组件销毁之前需要被清除的话则需要 useEffect 的清除副作用的功能，方法则是在第一个函数执行，返回一个函数，这个函数则会在组件卸载之前被清除
代码如下
```js
const Test = function (props) {
  useEffect(() => {
    const id = setInterval(() => {
      console.log('hi react hook')
    }, 1000)

    return () => clearInterval(id)
  }, [])

  return (
    <div>this is test</div>
  )
}
```

再来看preact源码
```js
export function useEffect(callback, args) {
  // 同样在组件内部注册hook，生成新的_hook对象，返回_list数据信息
  // 这里调用了 argsChanged 方法
	const state = getHookState(currentIndex++);
	if (argsChanged(state._args, args)) {   // 依赖参数 的值发生变化则，执行重新设  effect hook 的callback 和依赖
		state._value = callback;    // effect的第一个参数函数
		state._args = args;   // 依赖参数

		currentComponent.__hooks._pendingEffects.push(state);
	}
}

// 判断依赖的值是否有发生变化
// oldArgs是 undefined 返回true，需要一直更新
// 或者 新的参数值一一匹配是否有变化
function argsChanged(oldArgs, newArgs) {
	return !oldArgs || newArgs.some((arg, index) => arg !== oldArgs[index]);
}
```

### useLayoutEffect
`useLayoutEffect` 和useEffect使用方式一样，但是useLayout会在 dom变更之后同步调用effect, useLayout会阻塞视图更新
来看一张图：
<!-- [](./) -->
#### useLayoutEffect 相比 useEffect 的区别
- 执行顺序，useLayoutEffect 在 render 之前， useEffect 在 render 之后执行内部函数
- 加载机制，useLayoutEffect 同步阻塞页面加载，useEffect 是异步执行

使用方式和 `useEffect`相同，可以看 preact 源码查看
```js
let afterPaintEffects = [];   // 这里和cureentIndex类似，定义全局变量
let prevRaf;     // 上一次 options.requestAnimationFrame 
const RAF_TIMEOUT = 100;
// diff之后的钩子函数
// preact的diff是同步的，是宏任务 在重绘之前更新
options.diffed = vnode => {
	if (oldAfterDiff) oldAfterDiff(vnode);

	const c = vnode._component;
	if (!c) return;

	const hooks = c.__hooks;
	if (hooks) {
		if (hooks._pendingEffects.length) {
			afterPaint(afterPaintEffects.push(c));
		}
	}
};

// diff完成之后调用 处理effect 的callback
function afterPaint(newQueueLength) {
  // newQueueLength === 1 保证了afterPaint内的afterNextFrame(flushAfterPaintEffects)只执行一遍
	if (newQueueLength === 1 || prevRaf !== options.requestAnimationFrame) {
		prevRaf = options.requestAnimationFrame;

		// 执行 afterNextFrame(flushAfterPaintEffects)
		(prevRaf || afterNextFrame)(flushAfterPaintEffects);
	}
}

// 在下一帧 重绘之前 执行 callback => flushAfterPaintEffects
// 如果100ms 内requestAnimationFrame没有执行完 直接执行 done
function afterNextFrame(callback) {
	const done = () => {
		clearTimeout(timeout);
		cancelAnimationFrame(raf);
		setTimeout(callback);
	};
	const timeout = setTimeout(done, RAF_TIMEOUT);

	let raf;
  // 下一次重绘之前更新动画帧所调用 done
	if (typeof window !== 'undefined') {
		raf = requestAnimationFrame(done);
	}
}

function flushAfterPaintEffects() {
	afterPaintEffects.some(component => {
		if (component._parentDom) {
      // 清理上一次的_pendingEffects
			component.__hooks._pendingEffects.forEach(invokeCleanup);
      // 执行当前_pendingEffects
			component.__hooks._pendingEffects.forEach(invokeEffect);
			component.__hooks._pendingEffects = [];
		}
	});
	afterPaintEffects = [];
}
```
```js
// useLayoutEffect 代码
export function useLayoutEffect(callback, args) {
	/** @type {import('./internal').EffectHookState} */
	const state = getHookState(currentIndex++);
	if (argsChanged(state._args, args)) {
		state._value = callback;
		state._args = args;

		currentComponent._renderCallbacks.push(state);
	}
}

let oldBeforeUnmount = options.unmount;
// 组件卸载之前执行的函数，会清空 effect
options.unmount = vnode => {
  // 如果!!oldBeforeUnmount 直接执行 oldBeforeUnmount 方法
	if (oldBeforeUnmount) oldBeforeUnmount(vnode);

	const c = vnode._component;
	if (!c) return;

	const hooks = c.__hooks;
	if (hooks) {
    // 清除（就是执行） effect return出来的方法
		hooks._list.forEach(hook => hook._cleanup && hook._cleanup());
	}
};

let oldCommit = options._commit;
// 初始或者更新 render 结束之后执行
options._commit = (vnode, commitQueue) => {
	commitQueue.some(component => {
    // 清除useLayoutEffect 的effect  (执行)
		component._renderCallbacks.forEach(invokeCleanup);

    // 设置state._value = callback 作为下一次清除的函数
		component._renderCallbacks = component._renderCallbacks.filter(cb =>
			cb._value ? invokeEffect(cb) : true
		);
	});

	if (oldCommit) oldCommit(vnode, commitQueue);
};
```

### useContext
### useReducer
### useMemo
### useCallBack
### useRef
### useImperativeHandle
### useDebugValue

### 自定义hook