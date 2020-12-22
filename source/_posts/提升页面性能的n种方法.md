---
title: 提升页面性能的n种方法
date: 2020-12-18 08:29:38
categories: 总结
tags: [总结]
---

### 减少资源请求
- #### `css spirites`
  图片资源合并一张，background-position 显示
- #### http接口合并请求
  后端接口聚合 或者 中间层聚合(`graphQL`)

### 控制资源优先级
  - #### 控制阻塞资源
    - ###### 控制 script type **`defer`** or  **`async`** 标签达到低优先级, 避免阻塞主线程
    ![defer and async](./提升页面性能的n种方法/defer&async.jpeg)
    - ###### 避免 `js` 存放于 head 中
  - #### css 避免阻塞
    当一个媒体查询的结果值计算出来是 false 的时候 (`media` 设置非 `all`)，浏览器仍然会下载样式表，但是不会在渲染页面之前等待样式表的资源可用
    ```jsx
    // jsx
    <link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Caveat&display=swap"
      media="none"
      onLoad={(rel) => {
      if (rel.currentTarget.media != 'all') {
        rel.currentTarget.media = 'all'
      }
    }}>
    </link> 
    ``` 

### CSS 优化
- content-visibility
- will-change

### 预加载，预请求
- #### preconnect
  ![preconnect](./提升页面性能的n种方法/preconnect.webp)
  允许浏览器在将HTTP请求实际发送到服务器之前建立早期连接。可以预先启动诸如`DNS查找`，`TCP握手`和`TLS协商`之类的连接，从而消除了这些连接的往返延迟，并为用户节省了时间。
  #####  执行代码
  ```html
  // crossOrigin 设置 use-credentials 表示允许携带cookie信息
  <link rel="preconnect" href="//fonts.googleapis.com" crossOrigin='use-credentials'/>
  <link rel="preconnect" href="//hm.baidu.com" crossOrigin='use-credentials'/>
  <link rel="preconnect" href="//p3.music.126.net" crossOrigin='use-credentials'/>
  <link rel="preconnect" href="//m10.music.126.net" crossOrigin='use-credentials'/>
  ```
- #### dns-prefetch
  DNS Prefetch 是一种 DNS 预解析技术。
  浏览网页时，浏览器会在加载网页时对网页中的域名进行解析缓存，这样在你单击当前网页中的连接时就无需进行`DNS`的解析，减少用户等待时间，提高用户体验。
  ```html
  <link rel="dns-prefetch" href="//fonts.googleapis.com"/>
  <link rel="dns-prefetch" href="//hm.baidu.com"/>
  ```

### 缓存
- cache-control，expires


### 体积优化
- #### 文件压缩
  通过 webpack, gulp, rollup 构建压缩代码

- #### GZIP
  基于文本（js，css...）的资源应该使用压缩（gzip）来最小化网络总字节
  ```nginx
    # 开启gzip压缩
    gzip  on;
    # 压缩类型
    gzip_types text/css text/javascript application/javascript image/jpeg image/png image/gif;
    # 超过1k以上压缩
    gzip_min_length 1k;
    # 等级1-9  9最小的压缩,传输最快 但是消耗cpu
    gzip_comp_level 6;
  ```

### 外部优化
- 使用CDN

### webview优化

### 其他
