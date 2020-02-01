---
title: graphql入门
date: 2020-01-23 19:26:08
categories: javascript
tags: [graphql, js]
---

### GraphQL 是什么
#### 一种用于 API 的查询语言
GraphQL 既是一种用于 API 的查询语言也是一个满足你数据查询的运行时。 GraphQL 对你的 API 中的数据提供了一套易于理解的完整描述，使得客户端能够准确地获得它需要的数据，而且没有任何冗余，也让 API 更容易地随着时间推移而演进，还能用于构建强大的开发者工具。

### 背景
- 请求多个接口，页面请求借口过多，多次资源请求，难维护
- 数据过度获取，或者数据字段缺失
- 参数类型校验
- 前端对于接口的处理被动，字段无法变更
- 如何实现代码即文档

### GraphQL 特点
- API 聚合
- 请求合并， 字段组合
- 类型系统描述
- 辅助工具，提升开发效率

### 浏览器查询语言
在客户端获取gql聚合数据的时候，需要用到gql提供的查询操作

#### query 查询
查询字段： 获取数据，比如查找， 获取所有文章的 id 和 title 字段
```graphql
query {
  article {
    result {
      id
      title
    }
  }
}
```

查询结果
```json
{
  "data": {
    "article": {
      "result": [
        {
          "id": "1",
          "title": "JavaScript"
        },
        {
          "id": "2",
          "title": "html5新特性"
        },
        {
          "id": "3",
          "title": "css3相关特性"
        }
      ]
    }
  }
}
```

#### mutation 变更
变更：对数据进行变更，比如增加、删除、修改
添加tip的count信息 会返回对应tip的详情
```graphql
mutation {
  tipIncrease (id: 1) {
    result {
      count
    }
  }
}
```
变更的结果
```json
{
  "data": {
    "tipIncrease": {
      "result": {
        "count": 30
      }
    }
  }
}
```

#### substription 订阅
当数据发生更改，进行消息推送

#### 事例代码
```js
import Http from './../utils/http'

/**
 * 合并 gql 请求的方法
 */
export const gql = async (type, name, ...gqlStr) => {
  console.log(`【${type.toUpperCase()}】===【${name}】：`)
  console.log([...gqlStr].join('\n'))
  try {
    const { data } = await Http.post('/graphql', {
      query: `
        ${type} ${name} {
          ${[...gqlStr].join('\n')}
        }
      `
    })
    return data
  } catch (e) {
    throw e
  }
}

/**
 * 获取tips 的query数据
 */
export const tipsQuery = (page = 0, size = 20) => {
  return `
    tips(page: ${page}, size: ${size}) {
      result {
        id
        name
        count
      }
    }
  `
}

/**
 * 获取banner 信息 
 */
export const bannerQuery = () => {
  return `
    banner {
      result {
        id
        desc
        url
      }
    }
  `
}

/**
 * 获取文章类型信息
 */
export const articleTypeQuery = () => {
  return `
    articleType {
      result {
        id
        name
      }
    }
  `
}

/**
 * 获取文章信息
 */
export const articleQuery = (page = 0, size = 20, type = 0) => {
  return `
    article(page: ${page}, size: ${size}, type: ${type}) {
      result {
        id
        title
        tid
        createDate
        desc
        content
        type
        editDate
        user
      } 
    }
  `
}

/**
 * 获取 tips info
 */
export const tips = async () => {
  const { data } = await gql('query', 'getTips', tipsQuery())
  return data
}

/**
 * 获取页面的所有数据信息
 */
export const pageAInfo = async () => {
  return await gql('query', 'getPageAInfo',
                    tipsQuery(),
                    bannerQuery(),
                    articleTypeQuery(),
                    articleQuery()
                  )
}

/**
 * tip increase
 */
export const tipIncrease = async (id) => {
  return await gql('mutation', 'tipIncrease', `
    tipIncrease(id: ${id}) {
      result {
        count
      }
    }
  `)
}
```

### Schema 和类型
全称Schema Definition Language。GraphQL实现了一种可读的模式语法，SDL和JavaScript类似，这种语法必须存储为String格式。GraphQL Schema声明了返回的数据和结构。
```js
const typeDefs = `
  type Query {
    article(page: Int, size: Int, type: Int): ArticleResponse
    articleType: ArticleTypeResponse
  }

  type Article {
    id: ID!
    tid: Int
    title: String
    createDate: Date
    desc: String
    content: String
    editDate: Date
    type: String
    user: String
  }

  type ArticleType {
    id: ID!
    name: String
  }

  type ArticleResponse implements Response {
    code: Int
    msg: String
    result: [Article]
  }

  type ArticleTypeResponse implements Response {
    code: Int
    msg: String
    result: [ArticleType]
  }
`
module.exports = typeDefs
```

#### 默认量标类型
GraphQL 自带一组默认标量类型
- `Int`：有符号 32 位整数。
- `Float`：有符号双精度浮点值。
- `String`：UTF‐8 字符序列。
- `Boolean`：true 或者 false。
- `ID`：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读型。

#### 自定义量标类型
自定义量标类型用于定义除 默认量标类型 的其他类型，如 Date 格式
- `resolve`中 类型定义是通过 `GraphQLScalarType` 事例化对象，在其对应的回调函数中执行类型格式化操作
- 通过 `scalar` 申明一个新类型
```js
const resolve = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: '自定义Date标量类型',

    // 对来自客户端的值进行处理, 对变量的处理
    parseValue(value) {
      console.log('parseValue', value)
      return moment(value, 'YYYY-MM-DD hh:mm:ss')
    },

    // 返回给客户端的值进行处理
    serialize(value) {
      console.log('serialize', value)
      return moment(new Date(value))
    },

    // parseLiteral则会对Graphql的参数进行处理，参数会被解析转换为AST抽象语法树
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return moment(new Date(ast.value))
      }
      return null
    }
  })
}
// 在 defs 中注册新类型
// commmon.defs.js
const typeDefs = `
  # 新增 Date 数据结构
  scalar Date

  interface Response {
    code: Int
    msg: String
  }
`
module.exports = typeDefs
```


### resolver 解析器
解析器提供了将gql的操作(查询，突变或订阅)转换为数据的行为，在这个过程中，resolver可能会进行数据库的操作，resolver函数包含四个参数
- obj  上一个resolve的解析结果 (数据层级多的时候可用)  最顶层为 undefined
- args  传递用于查询的参数，id 或者 page，size…
- context  解析器上下文，包含请求状态
- Info 包含与当前查询有关的特定于字段的信息

#### 解析客户端查询语句
```gql
query {
  article {
    code
    msg
    result {
      id,
      author {
        name
      }
      desc
    }
  }
}
```
这段 query 查询，在resolve中是这样被解析的
- 进行第一次解析，当前的类型是query 类型，resolver 名为 article
- 使用article的 resolver 获取解析数据，第一层解析结束
  - 之后对第一层解析的返回值，进行第二层解析，article类型为 `ArticleResponse` ， 执行 code 解析 Int， msg 解析String，result 解析 自定义对象类型  `Article`
    - id在 `Article` 类型中为标量类型，解析结束
    - author 在 `Article` 类型中为自定义类型 `Author` ，执行 `Author` 的 resolver解析
      - 解析name String 结束 `Author` 的 解析
    - 解析desc String  至此完成 `Article` 解析
  - `ArticleResponse` 中 result 自定义类型解析完毕，至此，`ArticleResponse` 字段全部解析完成

> 遇到一个Query之后，尝试使用它的Resolver取值，之后再其Resolver对返回值进行解析，这个过程是递归的，直到所解析Field的类型是 Scalar Type （标量类型） 为止

### GraphQL 工作流程
如图
![GraphQL 工作流程](https://www.daiwei.site/static/blog/graphql入门/graphql.png)

### 演示地址
gql 请求页面: [地址访问](http://www.daiwei.site/graphql/){:target="_blank"}

非gql请求页面: [地址访问](http://106.14.207.56:8080/b){:target="_blank"}

### 参考于
[graphql从入门到实战](https://juejin.im/post/5cd68a9b51882568047fa6eb)

[apollo.vue](https://apollo.vuejs.org/)

[30分钟理解GraphQL核心概念](https://segmentfault.com/a/1190000014131950)

