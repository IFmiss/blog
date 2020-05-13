---
title: webpack配置-splitChunks
date: 2020-04-05 20:07:06
categories: webpack
tags: webpack
---

### webpack.optimization
从webpack 4.0开始，官方移除了 CommonsChunkPlugin 插件，从 webpack 4 开始，会根据你选择的 `mode` 来执行不同的优化，不过所有的优化还是可以手动配置和重写。而这个配置则是在webpack.optimization属性中进行

### webpack.optimization.minimize [boolean]
告知 webpack 使用 TerserPlugin 压缩 bundle。
当 [`mode`](https://webpack.docschina.org/concepts/mode/) 设置为`production`时候，为true
```js
// webpack.config.js
module.exports = {
  optimization: {
    minimize: false
  }
};
```

### optimization.minimizer [<plugin>] and or [function (compiler)]
```js
// This plugin uses terser to minify your JavaScript.
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
    ],
  }
};
```
如果是function的话
```js
module.exports = {
  optimization: {
    minimizer: [
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin');
        // 实例化的对象注入 compiler 
        new TerserPlugin({ /* your config */ }).apply(compiler);
      }
    ],
  }
};
```

### optimization.splitChunks
SplitChunksPlugin 是 CommonsChunkPlugin 的替代品
默认情况下，它仅影响按需块，因为更改初始块会影响HTML文件应包含的脚本标签以运行项目
webpack将根据以下条件自动分割块：
- 可以共享新块，或者模块来自node_modules文件夹
- 新的块将大于30kb（在min + gz之前）
- 按需加载块时并行请求的最大数量将小于或等于6
- 初始页面加载时并行请求的最大数量将小于或等于4

```ts
// index.tsx
import './a.ts'
```

```ts
// a.ts
import Dutils from 'd-utils'
Dutils.LogUtils.logBeauty('hello') 
```
在执行 run build 的时候
![非按需加载的打包结果](https://www.daiwei.site/static/blog/webpack配置-splitChunks/非按需加载的打包结果.png)
所有的js只打包成一个 js 文件

但是如果我们使用按需加载的方式，js会被分开打包，在页面加载的时候会引入 app.js 但不会立即加载 `d-utils`, 该文件也会被打包成单独的文件

看这段代码
```tsx
// index.js 入口文件
import('./a')
```
```tsx
// a.js
import Dutils from 'd-utils'
Dutils.LogUtils.logBeauty('hello')
```
打包结果

![按需加载的打包结果](https://www.daiwei.site/static/blog/webpack配置-splitChunks/按需加载的打包结果.png)
1-62e51b951297d22a8114.js 是第三方包文件
2-62e51b951297d22a8114.js 是引入第三方包执行的代码文件，也就是 a.ts

总结一下: （可能有以下集中情况）
  - [x] 该块包含来自以下模块 node_modules
  - [x] `d-utils` 大于30kb
  - [x] 导入的并行请求为2  一个是 `a.js`  一个是 `d-utils`
  - [x] 按需请求在初始页面加载时不影响
上述操作 4种splitChunk的场景都包含

再看这段代码
```tsx
// index.js 入口文件
import('./a')
import('./b')
```

```tsx
// a.js
import Dutils from 'd-utils'
Dutils.LogUtils.logBeauty('hello')
```

```tsx
// b.js
import _ from 'lodash'
import Dutils from 'd-utils'
console.log(_)
Dutils.LogUtils.logBeauty('hello')
```

#### optimization.splitChunks 属性配置
##### `automaticNameDelimiter` 默认使用【来源】~【名称】来定义字段，如：
`vendors~app.js`
vendors: 可以定义来源名称
~: automaticNameDelimiter 可以定义其他分隔符
app: 名称是app

##### `chunks` 设置提取chunks 的场景，默认 `async`， 也就是拆分按需加载的模块
  - `initial`: 提取同步加载的模块
  - `async`: 只提取按需加载的模块
  - `all`: 上述两者都包含
测试代码如下
```tsx
// 入口函数
import './a'
import('./b')
```
```tsx
// a.js
import ripple from 'ripple-button'
import d from 'd-utils'
console.log('ripple', ripple)
console.log(d)
```
```tsx
// b.js
import _ from 'lodash'
import Dutils from 'd-utils'
console.log(_)
Dutils.LogUtils.logBeauty('lodash and Dutils') 
```
- 在不设置`splitChunks`的情况下，默认的 `chunks` 属性值为 `async`, 意味着默认只会分包 b.js 中引入的第三方代码库，也就是 `lodash` 和 `d-utils`, 但是由于默认分割异步chunk，会导致 a.js 被同步加载的时候将 d-utils 和 ripple-button 打在一个包内，也就是下方的 `app.js` 文件
- 按需引入的 b 模块 也被单独抽离了一个 `1.js`
- b.js引入的第三方库，由于 d-utils 被打入`app.js`文件，b.js 只会打其他的依赖包，lodash，也就是`2.js`

同样的代码在设置`chunks` 为 `initial` 之后，app.js 是整个项目的业务代码，也就是我自己写的 引入，打印，等代码，生成了一个新的文件，vendors~app.js， 代码内容和上面app.js几乎是完全相同，唯一不同的是，打包的名称，因为他有了缓存组 [vendors]

##### `minSize` 设置导入代码模块大于这个值会做代码分割 默认 30000

##### `splitChunks.automaticNameMaxLength` 默认值为 109, 自动自动命名的最大长度

##### `maxSize` 提取出的新chunk在两次压缩之前要小于多少kb，默认为0，即不做限制
比如如果我设置了 maxSize 为 20000，及最大打包生成的代码不能超过20kb，则会将第三方代码拆分成多个模块（按照第三方代码依赖的其他模块进行拆分），如果单个模块超过20k以上，则直接输出该模块，也就是即使设置 maxSize 为20000，也有可能会有大于20000以上的模块，比如vue.js, react.js, lodash.js等
![maxSize-20000](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxSize-20000.png)

##### `minChunks` 被提取的 模块 最少要被多少个 chunks 调用，才会被单独打包 默认值为2

##### `maxAsyncRequests` 模块按需加载的最大数量 默认是5
说说为什么会有这个配置，因为在 http 协议，不同浏览器的网络资源 并行连接 是有限制的，比如一共10和js资源，并行连接一次性可以加载6个js资源，意味着有些js资源加载的过程都需要等待，这也是为什么 maxAsyncRequests 设置为5的原因吧

我们用entry.tsx作为webpack的主入口，主入口动态引入三个js文件，p1, p2, p3, 每个文件分别引入不同的第三方库
```tsx
// entry.tsx
import React from 'react'
import ReactDOM from 'react-dom'

// 动态引入
import('./p1')
import('./p2')
import('./p3')

const Entry = () => {
  return (
    <div>this is Entry</div>
  )
}
ReactDOM.render(<Entry />, document.getElementById('root'))

```
```ts
// p1.tsx
import _ from 'lodash'
import Dutils from 'd-utils'
import vue from 'vue'
console.log('this is p1', _)
console.log(Dutils)
console.log(vue)
```
```ts
// p2.tsx
import utils from 'd-utils'
console.log('this is p2',utils)
```
```ts
// p3.tsx
import lodash from 'lodash'
import vue from 'vue'
console.log('adasd', vue)
console.log('this is p3', lodash)
```
这是webpack的属性配置，此时设置为1
```ts
splitChunks: {
  chunks: "async",
  // // 按需加载的代码块（vendor-chunk）并行请求的数量小于或等于5个
  maxAsyncRequests: 1
},
```
设置为1意味着不允许多个按需加载的代码块并行请求，
打包出的模块状态如图
![maxAsyncRequests为1](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxAsyncRequests为1.png)
打包出的文件分别是
![maxAsyncRequests为1的模块名称](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxAsyncRequests为1的模块名称.png)
可以看到没有按需加载的单独的 chunk，而是动态引入的模块被分别打包成 1.chunk.js, 2.chunk.js, 3.chunk.js，分别对应 p1, p2, p3，entry.ts. 则是被打包成 `e3.boundle.js`
在这里我们可以发现，公共代码没有分离,虽然只请求一次, 但是导致重复加载了公共chunk,代码严重冗余，比较占用js体积大小，此时再设置一下 maxAsyncRequests的值为 2

在打包之前，我们特地设置配置如下，为了更好的区分打包的结果
```ts
module.exports = {
  splitChunks: {
    chunks: "async",
    // // 按需加载的代码块（vendor-chunk）并行请求的数量小于或等于5个
    maxAsyncRequests: 2,
    minChunks: 1,
    name: true,
    cacheGroups: {
      lodash: {
        test: /[\\/]node_modules[\\/]lodash[\\/]/,
        name: 'asyncCommon/lodash',
        chunks: 'async'
      },
      utils: {
        test: /[\\/]node_modules[\\/]d-utils[\\/]/,
        name: 'asyncCommon/utils',
        chunks: 'async'
      },
      vue: {
        test: /[\\/]node_modules[\\/]vue[\\/]/,
        name: 'asyncCommon/vue',
        chunks: 'async'
      }
    }
  },
}
```
改为 2 之后我们发现 打包的结果如下
![maxAsyncRequests设置为2](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxAsyncRequests设置为2.png)
可以看到，此时 `js/asyncCommon/lodash.boundle.js`， `js/asyncCommon/utils.boundle.js` 被单独抽离了出来
![maxAsyncRequests设置为2模块名称](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxAsyncRequests设置为2模块名称.png)

改为 3 之后
![maxAsyncRequests设置为3](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxAsyncRequests设置为3.png)
`lodash`, `utils`, `vue` 都被打出来了
![maxAsyncRequests设置为3模块名称](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxAsyncRequests设置为3模块名称.png)

设置为 3以上的话，这三个包里其他的依赖模块也会单独打包出来

总结：
1. 对于单独打出的包，如果同样的引入模块数量一样的化，体积大的模块会被抽离出来
2. 如果引入模块数量不一样的模块，被引入数量大的模块会被优先抽离

##### `maxInitialRequests` 表示允许入口并行加载的最大请求数
设置为1的时候
```ts
module.exports = {
  splitChunks: {
    chunks: "all",
    maxAsyncRequests: 5,
    maxInitialRequests: 1,
    minChunks: 1,
    cacheGroups: {
      lodash: {
        test: /[\\/]node_modules[\\/](lodash)[\\/]/,
        name: 'common/lodash',
        priority: 20,
      },
      utils: {
        test: /[\\/]node_modules[\\/](d-utils)[\\/]/,
        name: 'common/utils',
        priority: 8,
      },
      vue: {
        test: /[\\/]node_modules[\\/]vue[\\/]/,
        name: 'common/vue',
        priority: 1
      }
    }
  }
}
```
设置为1的时候，直接打包出一个js 文件，如图
![maxInitialRequests为1](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxInitialRequests为1.png)

当我们设置 maxInitialRequests 为2的时候（见下图），可以看到生成了 `lodash.chunk.js` 和 `e3.js`, 这说明入口文件也算一个请求
![maxInitialRequests为2](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxInitialRequests为2.png)

设置为三的时候 （`lodash.chunk.js` + `e3.js` + `js/common/utils.chunk.js`）
![maxInitialRequests为3](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxInitialRequests为3.png)

为四 （`lodash.chunk.js` + `e3.js` + `js/common/utils.chunk.js` + `js/common/vue.chunk.js`）
![maxInitialRequests为4](https://www.daiwei.site/static/blog/webpack配置-splitChunks/maxInitialRequests为4.png)

##### `minRemainingSize || cacheGroups.{cacheGroup}.minRemainingSize` webpack 5中引入了option选项，通过确保拆分后剩余的最小块大小超过限制来避免大小为零的模块。

##### `splitChunks.maxAsyncSize || cacheGroups.{cacheGroup}.maxAsyncSize，` 和maxSize的功能类似，只是这个属性是作用于 按需加载 模块，splitChunks.maxAsyncSize， splitChunks.cacheGroups.{cacheGroup}.maxAsyncSize， 都可以设置

##### `splitChunks.name` boolean 值 或者 string字符串，或者回调函数
- boolean
  - true: 分割文件名为 [缓存组名][连接符][入口文件名].js
  - false 或者不设置: 分割文件名为 [模块id][连接符][入口文件名].js
- string
  - 定义生成的文件目录位置与目录名称
- fn 暴露三个参数，可自定义组合输出的目录
```ts
name: function (module, chunks, cacheGroupKey) {
  return 'hello' + cacheGroupKey + module.used
},
```

##### `cacheGroups` 设置缓存组，可设定不同模块打包成chunk的策略
缓存组可以继承和/或覆盖splitChunks.*;中的任何选项。但是test，priority并且reuseExistingChunk只能在高速缓存组级别配置。要禁用任何默认缓存组，请将它们设置为false。
```ts
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false
      }
    }
  }
};
```

##### `cacheGroups.{cacheGroup}.priority` 设置缓存组优先级
一个模块可以属于多个缓存组。优化将首选具有较高的缓存组priority。默认组的优先级为负，以允许自定义组获得更高的优先级（默认值适用0于自定义组）。
比如 默认我在 设置 maxAsyncRequests 为2的时候，再不设置 priority的情况下，默认会导出 lodash, utils 文件
![priority-1](https://www.daiwei.site/static/blog/webpack配置-splitChunks/priority-1.png)

设置权限之后
```ts
module.exports = {
  cacheGroups: {
    lodash: {
      test: /[\\/]node_modules[\\/]lodash[\\/]/,
      name: 'asyncCommon/lodash',
      chunks: 'async'
    },
    utils: {
      test: /[\\/]node_modules[\\/]d-utils[\\/]/,
      name: 'asyncCommon/utils',
      chunks: 'async'
    },
    vue: {
      test: /[\\/]node_modules[\\/]vue[\\/]/,
      name: 'asyncCommon/vue',
      chunks: 'async',
      priority: 1
    }
  }
}
```
![priority-2](https://www.daiwei.site/static/blog/webpack配置-splitChunks/priority-2.png)

##### `cacheGroups.{cacheGroup}.reuseExistingChunk` 如果是被拆分的模块，其他模块被引用到的时候会被服复用，而不是生成新的模块
![reuseExistingChunk](https://www.daiwei.site/static/blog/webpack配置-splitChunks/reuseExistingChunk.png)

还是来看这段代码
```ts
// p1.tsx
import _ from 'lodash'
import Dutils from 'd-utils'
import vue from 'vue'
console.log('this is p1', _)
console.log(Dutils)
console.log(vue)
```
```ts
// p2.tsx
import utils from 'd-utils'
console.log('this is p2',utils)
```
```ts
// p3.tsx
import lodash from 'lodash'
import vue from 'vue'
console.log('adasd', vue)
console.log('this is p3', lodash)
```
因为我这边设置了 vue 的priority，所以 vue 会被单独抽离，但是 p1 里面 lodash，d-utils 被单独打包成一个文件，为了 p2 或者其他需要引入该文件而生成的模块，如果不设置 vue的priority，则三个模块会被打成一个js包，作为其他 tsx 引入的js包
此时如果我注释了 p3.tsx 中 vue 的引入代码
```ts
// p3.tsx
import lodash from 'lodash'
// import vue from 'vue'
// console.log('adasd', vue)
console.log('this is p3', lodash)
```
在执行 minChuncks 设置为最小2个引入 时， vue 是不满足条件的
执行的结果就是， 原本 vue 从 vue.boundle.js 变成了 一个模块的包，里面包含了业务性代码

##### `cacheGroups.{cacheGroup}.test` 判断要执行cache的分包场景，类似webpack loader 的配置
- RegExp 正则匹配
```ts
module.exports = {
  lodash: {
    test: /[\\/]node_modules[\\/]lodash[\\/]/,
    name: 'asyncCommon/lodash',
    chunks: 'async'
  },
}
```
- 字符串匹配
```ts
module.exports = {
  lodash: {
    // test: /[\\/]node_modules[\\/]lodash[\\/]/,
    test: path.resolve(__dirname, './../node_modules/lodash'),
    name: 'asyncCommon/lodash',
    chunks: 'async'
  },
}
```
- 函数匹配 带有返回值的函数,在编译中会被执行
```ts
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        svgGroup: {
          test(module, chunks) {
            // `module.resource` contains the absolute path of the file on disk.
            // Note the usage of `path.sep` instead of / or \, for cross-platform compatibility.
            const path = require('path');
            return module.resource &&
                 module.resource.endsWith('.svg') &&
                 module.resource.includes(`${path.sep}cacheable_svgs${path.sep}`);
          }
        },
        byModuleTypeGroup: {
          test(module, chunks) {
            return module.type === 'javascript/auto';
          }
        }
      }
    }
  }
};
```

##### `cacheGroups.{cacheGroup}.filename` 打包输出文件的路径以及文件名称
- function (chunkData) {} 回调
```ts
module.exports = {
  cacheGroups: {
    defaultVendors: {
      filename: (chunkData) => {
        // Use chunkData object for generating filename string based on your requirements
        return `${chunkData.chunk.name}-bundle.js`;
      }
    }
  }
}
```
- string
```ts
module.exports = {
  cacheGroups: {
    defaultVendors: filename: 'asyncCommon/[name]-bundle.js'
  }
}
```

##### `cacheGroups.enforce` 
- 布尔类型，默认为false， 当设为true时，webpack会忽略 `splitChunks.minSize`、`splitChunks.minChunks`、`splitChunks.maxAsyncRequests`、`splitChunks.maxInitialRequests` 这几个配置项
- 并且只要某个缓存组设置了enforce为true，匹配的模块就会忽略前面提到的那几个属性，即使有其他的缓存组匹配同样的模块，也没有设置enforce，同时优先级比设置了enforce的高，enforce: true仍然有效。
```ts
module.exports = {
  splitChunks: {
    chunks: "async",
    maxAsyncRequests: 5,
    minChunks: 4,
    cacheGroups: {
      lodash: {
        test: /[\\/]node_modules[\\/]lodash[\\/]/,
        name: 'asyncCommon/lodash',
        chunks: 'async',
        priority: -10,
        enforce: true
      },
      utils: {
        test: /[\\/]node_modules[\\/](d-utils)[\\/]/,
        name: 'asyncCommon/utils',
        chunks: 'async',
        priority: 8
      },
      vue: {
        test: /[\\/]node_modules[\\/]vue[\\/]/,
        name: 'asyncCommon/vue',
        chunks: 'async',
        priority: 1
      }
    }
  }
}
```
![enforce-true-1](https://www.daiwei.site/static/blog/webpack配置-splitChunks/enforce-true-1.png)
我在设置 minChunks 为4时，下面三个模块理论上都不会满足的，但是我设置了 lodash 配置的 enforce 为true，此时 lodash依然被打包成chunk，因为 minChunks 对于他来说并不生效
为了验证第二点，我们将 priority 的层级修改一下， 看看 d-utils 是否可以被打出来
```ts
module.exports = {
  splitChunks: {
			chunks: "async",
      // // 按需加载的代码块（vendor-chunk）并行请求的数量小于或等于5个
      maxAsyncRequests: 5,
      minChunks: 4,
      cacheGroups: {
        lodash: {
          test: /[\\/]node_modules[\\/](d-utils|lodash)[\\/]/,
          name: 'asyncCommon/lodash',
          chunks: 'async',
          priority: 20
        },
        utils: {
          test: /[\\/]node_modules[\\/](d-utils)[\\/]/,
          name: 'asyncCommon/utils',
          chunks: 'async',
          priority: 8,
          enforce: true
        },
        vue: {
          test: /[\\/]node_modules[\\/]vue[\\/]/,
          name: 'asyncCommon/vue',
          chunks: 'async',
          priority: 1
        }
      }
    }
	}
}
```
![enforce-true-2](https://www.daiwei.site/static/blog/webpack配置-splitChunks/enforce-true-2.png)
可以看到，即使 `d-utils` priority设置为20，utils 的chunks 也是可以被单独打出来的，即使 splitChunks.minChunks == 4 （被视为无效）
