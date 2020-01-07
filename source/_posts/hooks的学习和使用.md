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
可以看到 `useState`函数传递一个唯一的初始值参数，并返回一个数组，数组的第一个值就是这个初始化的参数值，第二个值是一个方法，这个方法可以在内部操作count的值（执行count + 1）并触发`re-render`
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
- `hookState` 设置 _value 第二个值为一个方法，获取这个方法的执行结果，和当前的状态对比，如果变化了触发`re-render`，参数action 可以是值，也可以是一个带有返回值的 function

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
  // 默认不设置的情况下re-render的场景下 effect 都会被调用
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
// useLayoutEffect 代码 和useEffect代码逻辑相似
export function useLayoutEffect(callback, args) {
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
`useContext` 接受一个上下文对象，并返回当前上下文的值（provider.props.value），而这个值是由调用组件的value属性决定的，看代码

#### StoreContext.ts  创建一个上下文
```ts
// StoreContext.ts
// StoreContext 定义 两个值 name, value
import React, {
	createContext
} from 'react'

// 定义类型
interface IStoreContextProps {
	name: string;
	value: string;
	changeName?: () => void;
}

const context = createContext<IStoreContextProps>({
	name: '',
	value: ''			// 可以设置默认值
})
export default context
```

#### 顶层元素
```tsx
import React from 'react'
import StoreContext from './StoreContext'
import Child from './Child'

const Parent = function () {
	const changeName = () => {
		// ...
	}
	return (
		<StoreContext.Provider value={{
														 name: 'react',
														 value: 'react-hook-study',
														 changeName
													 }}>
			<Child/>
		</StoreContext.Provider>
	)
}
```

#### 子元素，子子元素..., 获取context值
```tsx
import React, {
	useContext
} from 'react'
import StoreContext from './StoreContext'

const Child = function () {
	const { name, value, changeName } = useContext(StoreContext)
	return (
		<div>
			<div>{name}</div>
			<div>{value}</div>
			<div onClick={changeName}>点击我执行</div>
		</div>
	)
}
```
Child在父元素没有传递属性的情况下获取数据和执行方法

#### React.createContext
这是react在16.3出得一个api特性，https://zhuanlan.zhihu.com/p/34038469 这篇文章详细讲述了 React.createContext 工作原理
https://codesandbox.io/s/lvwlqo887
https://github.com/jamiebuilds/create-react-context/blob/master/src/implementation.js

#### 继续看 preact 源码
create-context.js 是 preact 创建context的方法 
```js
import { enqueueRender } from './component';

export let i = 0;			// 记录索引，保证取得context都是正确的

export function createContext(defaultValue) {
	// 上下文初始化
	const ctx = {};

	const context = {
		// 唯一的id
		_id: '__cC' + i++,
		// 记录默认的初始化值
		_defaultValue: defaultValue,

		// context中申明 Consumer 方法
		Consumer(props, context) {
			return props.children(context);
		},
		// 申明 Provider
		Provider(props) {
			// 判断是否初始化。为初始化执行初始化操作
			if (!this.getChildContext) {
				const subs = [];
				this.getChildContext = () => {
					// 当前 '__cC' + i++, 的value值指向 定义的这个Provider函数  并返回 ctx
					ctx[context._id] = this;
					return ctx;
				};

				// Provider 组件 对 shouldComponentUpdate 做处理
				this.shouldComponentUpdate = _props => {
					// 如果当前的props.value 不等于 next 的props.value
					if (props.value !== _props.value) {
						subs.some(c => {
							// 组件的 context 属性 设置 _props.value 的值
							c.context = _props.value;
							// 调用enqueueRender进行组件更新
							enqueueRender(c);
						});
					}
				};
				// 注册组件，且在组件 componentWillUnmount 销毁组件
				this.sub = c => {
					// 将组件推入 sub 队列
					subs.push(c);
					let old = c.componentWillUnmount;
					c.componentWillUnmount = () => {
						// 组件被销毁的时候 清空 subs 关联的组件
						subs.splice(subs.indexOf(c), 1);
						// 执行组件被销毁的时候的 componentWillUnmount 生命周期
						old && old.call(c);
					};
				};
			}
			// 返回子组件
			return props.children;
		}
	};

	context.Consumer.contextType = context;
	// 返回context 包括  { _id, _defaultValue, Consumer, Provider }
	return context;
}
```

```js
export function useContext(context) {
	// context._id 是在执行 React.createContext 产生的  还有 默认传入的 context._defaultValue
	// 判断是否有 provider 没有返回默认的 _defaultValue
	const provider = currentComponent.context[context._id];
	if (!provider) return context._defaultValue;
	// 返回一个 _list[currentIndex++] 对象
	const state = getHookState(currentIndex++);
	// This is probably not safe to convert to "!"
	if (state._value == null) {
		// 设置 _value
		state._value = true;
		// currentComponent push 到 subs队列中
		provider.sub(currentComponent);
	}
	// 获取 provider 跟组件的props 的value 值
	return provider.props.value;
}
```

### useReducer
`useReducer` 是useState的替代方案，接受一个`(state, action) => newState` 的reducer，并返回当前state以及配套的duspath方法，当state逻辑比较复杂且包含多个值的时候，userReducer是一个不错的选择
```tsx
// 实现一个控制元素数量的功能
import React, {
	useReducer
} from 'react'

const Calc = ({ count = 0 }) => {
	// reducer 函数
	const reducer = (state, action) => {
		switch (action.type) {
			case 'add':
				return Object.assign({}, state, { count: state.count + 1})
			case 'reducer':
				return Object.assign({}, state, { count: state.count - 1})
			case 'reset':
				return init(action.payload);
			default:
				return state
		}
	}

	const init = (initialValue) => {
		return { count: initialValue }
	}

	const [state, dispath] = useReducer(reducer, count, init)

	return (
		<div>
			// 初始值 为 props.count 也就是 0
			<div>{state.count}</div>
			<span onClick={() => {dispath({type: 'add'})}}>add</span>
      <span onClick={() => {dispath({type: 'reducer'})}}>reducer</span>
      <span onClick={() => {dispath({type: 'reset', payload: count})}}>reset</span>
		</div>
	)
}
```
`useReducer`可以传三个参数，你可以选择惰性地创建初始 state。为此，需要将 `init 函数` 作为 useReducer 的第三个参数传入，这样初始 state 将被设置为 init(initialArg)，也就是默认显示传入count 的props的值
其目的是为了将 state 逻辑提取到 `reducer` 外部，同样可以方便重置state的初始值


### useMemo
`useMemo` 返回一个 **memoized** 值
```tsx
import React, {
	useMemo
} from 'react'

const Test = () => {
	const [a, setA] = useState(1)
	const doubleValue = useMemo(() => {
		return a * 2
	}, [a])
	return (
		<div>
			<span>{doubleValue}</span>
			<span onClick={() => setA(a + 1)}>点击 ++</span>
		</div>
	)
}
```
在这里，每当 点击+1 的时候 `doubleValue` 返回的值都是最新的 `a * 2`的结果，如果用过vue 的computed的话，其实是一样的效果，而且vue3.0的 computed 也是一个函数

再来看看preact中对于useMemo的实现:
```js
// 第一个参数是一个带有返回值的函数
// 第二个是依赖项数组
export function useMemo(factory, args) {
	// 从数组中创建一个_list[currentIndex++]对象
	const state = getHookState(currentIndex++);
	// 判断state之前的依赖项和当前的依赖项是否有变化
	if (argsChanged(state._args, args)) {
		state._args = args;
		state._factory = factory;
		// 重新执行useMemo中的函数 并赋值 state._value 且返回该值
		return (state._value = factory());
	}

	// 如果没有变化直接返回值
	return state._value;
}
```

### useCallBack
`useCallBack` 的作用是利用 memoize 减少无效的 `re-render`，从而达到性能优化的作用，什么场景下会用到呢? 可以看下面的代码
```jsx
// 定义一个父组件
import React, {
	useState
} from 'react'
import Child from './Child'
const Test = () => {
	const [a, setA] = useState(1)
	const getNewData = () => {
		setTimeout(() => {
			setA(a + 1)
		}, 500)
	}

	return (
		<Child a={a} getNewData={getNewData}/>
	)
}

// Child.tsx子元素
import React, {
	useEffect
} from 'react'

const Child = ({ a, getNewData }) => {
	useEffect(() => {
		getNewData()
	}, [getNewData])
	return (
		<div>{a}</div>
	)
}
```
这种场景下会发生死循环，先看执行步骤
 - Test组件render，传入 `a` 和 `getNewData` 属性
 - Child拿到 `a` 并渲染，`getNewData` 获取到最新的时候执行 `getNewData`，第一次渲染会直接执行
 --------------以下便开始重新循环-------------
 - 此时 Test 的 `getNewData` 被执行，500毫秒后，a的值发生变化，Test重新渲染
 - `getNewData` 被重新创建，`getNewData` 和 `a` 被重新作为属性传入到子元素
 - Child 监听到 `getNewData` 变化继续执行 `getNewData` 方法
 - 然后就一直循环
#### 其实问题的根源在于两次的 `getNewData` 引用发生了变化，导致重复渲染的操作，此时`useCallback`就可以解决这个问题
```jsx
import React, {
	useState
} from 'react'
import Child from './Child'
const Test = () => {
	const [a, setA] = useState(1)
	const getNewData = useCallback(() => {
		setTimeout(() => {
			setA(a + 1)
		}, 500)
	}, [])

	return (
		<Child a={a} getNewData={getNewData}/>
	)
}
// 此时 useCallback 返回的值都是同一个值
// 第一次返回的是 return (state._value = factory())
// 之后就直接返回 state._value 就是useMemo的包装，只不过 factory() 的返回值是一个方法
```
#### 除此之外还有就是 不能在 `useCallback` 内部设置新的依赖的状态值
```jsx
const Test = () => {
	const [a, setA] = useState(1)
	const getNewData = useCallback(() => {
		console.log(a)
		setA(a + 1)
	}, [a])

	return (
		<div>test callback</div>
	)
}
```
```jsx
function useRefCallback(fn, dependencies) {
  const ref = useRef(fn);

  // 每次调用的时候，fn 都是一个全新的函数，函数中的变量有自己的作用域
  // 当依赖改变的时候，传入的 fn 中的依赖值也会更新，这时更新 ref 的指向为新传入的 fn
  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```


preact中的 `useCallback` 就只有一行代码
```jsx
export function useCallback(callback, args) {
	return useMemo(() => callback, args);		// 返回一个 memoize 方法
}
```

### useRef
`useRef` 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变
```js
const Test = () => {
	const refInfo = useRef(1)		// refInfo.current === 1

	return (
		<div>test useRef</div>
	)
}
```
`ref` 会让人想到react 获取元素的dom节点，将dom节点的信息存放在变量中, `refInfo` 也可以将`.current`属性设置元素的`dom`节点
```js
const Test = () => {
	const refInfo = useRef(null)		// refInfo.current === 1
	const showRef = () => {
		return refInfo.current		// dom元素，可访问element元素的相应属性
	}

	return (
		<div ref={refInfo}>test useRef</div>
	)
}
```
但是 `useRef` 比 `ref` 更好用，它可以很方便地保存任何可变值，数据存储在 .current 属性中，**当数据发生变化的时候，不会触发组件重新渲染**

preact 源码中 `useRef` 是一个没有数据依赖的 useMemo 返回 带有 current属性 initialValue 的初始值的对象
```js
export function useRef(initialValue) {
	return useMemo(() => ({ current: initialValue }), []);
}
```

### useImperativeHandle
### useDebugValue

### 自定义hook

https://zhuanlan.zhihu.com/p/56975681
https://dev.to/dinhhuyams/introduction-to-useref-hook-3m7n