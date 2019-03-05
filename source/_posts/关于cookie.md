---
title: 关于cookie
date: 2019-03-06 00:27:40
categories: javascript
tags: js
---

**`http请求的时候cookie的数据会携带在请求头中传递给后端`**，我一直以为只是简单的数据存储，这应该算是http的基本常识了，还是得好好看，好好敲

### 对比h5的存储机制（localStorage和sessionStorage）
| 名称 | 存储大小 | 过期时间 |
|:-----|:---|:----------|
|**cookie**|4kb|可自定义过期时间|
|**localStorage**|4-8mb|没有过期时间，不清楚永久有效|
|**sessionStorage**|4-8mb|关闭页面或浏览器后被清除|

### 其他区别
#### 代码执行方式
localStorage和sessionStorage都有html5的API，添加，删除，移除所有变得很简单
```js
// 如果需要判断浏览器是否支持 可使用 window.localStorage判断
// 添加
window.localStorage.setItem('name', value)
// 删除
window.localStorage.removeItem('name')
// 获取
window.localStorage.getItem('name')
// 删除所有
window.localStorage.clear()
```
同样的，sessionStorage也是这种操作方式
```js
// 如果需要判断浏览器是否支持 可使用 window.sessionStorage判断
// 添加
window.sessionStorage.setItem('name', value)
// 删除
window.sessionStorage.removeItem('name')
// 获取
window.sessionStorage.getItem('name')
// 删除所有
window.sessionStorage.clear()
```
localStorage和sessionStorage都是全局的`Storage对象`，所以是可以不加windows的

然而cookie就没有那么简单明了的api了
```js
// 获取
document.cookie
// "a=1; b=2; c=3"
```
`document.cookie`直接可以拿到浏览器的数据信息，是一个键值对的字符串，用于获取cookie的信息
`document.cookie=...`同样可以被赋值，用于设置cookie的信息
##### 基本方法
- 添加cookie：
```js
/**
  * @description 设置Cookie
  * @param { String } name cookie名称
  * @param { String } value cooke的值
  * @param { Number } exp 过期时间 默认2小时 单位毫秒
  * @link https://ifmiss.github.io/d-js-utils/#/lib/_store?id=setcookie
  * @example
  * // 设置name为test的值为12345，设置过期时间为1小时
  * Dutils.store.setCookie('test', '12345', 60 * 60 * 1000)
  */
  setCookie (name, value, exp = 60 * 60 * 2 * 1000) {
    let date = new Date()
    date.setTime(date.getTime() + exp)
    document.cookie = `${name}=${escape(value)};expires=${date.toGMTString()}`
  }
```
- 获取cookie：
```js
 /**
   * @description 获取Cookie
   * @param { String } name cookie名称
   * @returns { (Array | Null) } 返回数据
   * @link https://ifmiss.github.io/d-js-utils/#/lib/_store?id=getcookie
   * @example
   * Dutils.store.getCookie('test')
   */
  getCookie (name) {
    if (name) {
      let reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
      let arr = document.cookie.match(reg)
      return arr&&arr[2] ? arr[2] : null
    }
    let getAllCookies = []
    if (document.cookie !== '') {
      let arrCookie = document.cookie.split('; ')
      for (let k in arrCookie) {
        getAllCookies.push({
          name: `${unescape(arrCookie[k].split('=')[0])}`,
          value: `${unescape(arrCookie[k].split('=')[1])}`
        })
      }
      return getAllCookies
    } else {
      return null
    }
  }
```
- 删除Cookie
```js
/**
  * @description 删除Cookie
  * @param { String } name cookie名称 如果不传参数则设置所有cookie过期
  * @link https://ifmiss.github.io/d-js-utils/#/lib/_store?id=rmcookie
  * @example
  * Dutils.store.rmCookie('test')
  */
  rmCookie (name) {
    let date = new Date()
    date.setTime(date.getTime() - 1)
    if (name) {
      let cookieInfo = store.getCookie(name)
      if (cookieInfo !== null) {
        document.cookie = `${name}=${cookieInfo};expires=${date.toGMTString()}`
      }
      return
    }
    let getAllCookies = store.getCookie()
    for (let k in getAllCookies) {
      document.cookie = `${getAllCookies[k].name}=${getAllCookies[k].value};expires=${date.toGMTString()}`
    }
  }
```

##### 在http请求的时候
- `cookie会作为请求内容存放在httpRequest的header里面`，此时后端是可以拿到cookie里面的数据信息的，可以通过cookie的方式和后端建立数据通信，但也会有安全性问题
- 而localStorage和sessionStorage 只是单纯的数据存储的概念

