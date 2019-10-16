---
title: 移动端基于vue项目的微信分享解决方案
date: 2019-04-25 22:15:45
categories: javascript
tags: ['vue', '微信', 'js', 'ts']
---

这是我基于vue的微信公众号h5项目中，关于微信分享的一个总结

微信分享是调用微信的jssdk, 使用wx提供的一系列方法, 比如分享, 图片的预览, 保存, 音频, 支付等等方法, demo地址请见 [`微信jssdk Demo`](https://www.weixinsxy.com/jssdk/), 这里我们只说微信分享，这里都是基于vue的history模式的项目下

### 关于URL
IOS微信版本中，无论你在项目的什么目录下，微信菜单复制的地址都是你第一次进入项目的url地址，因此，如果需要每个页面切换的时候有不同的分享信息内容，**此时如果初始化所需要的url如果为window.location.herf的话，会出现微信签名错误** ，所以解决的方法也是和其他人提供的解决方法一样，种植一个初始化的url并反复使用
```ts
/**
  * @description IOS 或者 Android 微信版本小于6.3.31 需要种植首次进入页面的URL，用于解决微信签名错误
  */
static plantSdkUrlIosOrAndorid (): void {
  if (!window.__D_UTILS_WX_FIRST_URL_HOOK__) {
    window.__D_UTILS_WX_FIRST_URL_HOOK__ = window
                                        .location
                                        .href
                                        .split('#')[0]
  }
}
```
而这个方法通常会写在router的beforeeach钩子中，在**window上挂载第一次进入页面的url**, 也可以存在store中，但是window上更方便

注意，低版本的微信客户端在安卓手机上需要走上面的方法，说实在在微信6.2之前(不支持h5的pushstate特性)，我这里是6.3.31之前的判断，所以在获取真正的url的时候我们需要添加判断
```ts
/**
  * @description 初始化微信请求 js-sdk 的url地址 需要区分两种情况
  * IOS 或者 Android 微信版本小于6.3.31, Android 微信版本大于6.3.31
  * 当前这种只支持与VUE单页面模式
  * @returns 返回获取jssdk的url参数值
  */
static sdkUrlIosOrAndorid (): string {
  if (ExpUtils.isIOS() ||
      ExpUtils.isAndroid() && !WeixinUtils.isUpThanWxVersion('6.3.31')) {
        if (window.__D_UTILS_WX_FIRST_URL_HOOK__) {
          return window.__D_UTILS_WX_FIRST_URL_HOOK__
        }
  }
  return window.location.href.split('#')[0]
}
```
此时执行sdkUrlIosOrAndorid方法就可以拿到正确的微信分享需要的url

### 请求后台接口
在获取wx.config所需要的配置信息的时候，我们可以从后端直接获取所有的数据信息，也可以自己做验签
#### 直接返回所有数据
这基本就只需要一个请求微信分享的url页面地址了，**注意，这里的地址也就是`sdkUrlIosOrAndorid`方法返回的地址**，注意，这里是做了split[0]的拆分的
返回回来的所需要的数据信息
```ts
timestamp,
nonceStr,   // 注意属性的S要大写
signature
```

#### jsapi_ticket
生成签名之前必须先了解一下jsapi_ticket，jsapi_ticket是公众号用于调用微信JS接口的临时票据。正常情况下，jsapi_ticket的有效期为7200秒，通过access_token来获取。由于获取jsapi_ticket的api调用次数非常有限，频繁刷新jsapi_ticket会导致api调用受限，影响自身业务，开发者必须在自己的服务全局缓存jsapi_ticket 。
JS接口签名校验只需要请求后端接口获取一个jsapi_ticket，并按照微信提供的解密算法，即可拿到`timestamp`, `nonceStr`, `signature`
```ts
/**
  * @description wxSign
  * @param { String }  jsapi_ticket  公众号用于调用微信JS接口的临时票据
  */

static wxSign (ticket: string): IwxSign {
  const nonceStr = WeixinUtils.randomWord(16)
  const timestamp = (Date.now() + '').substr(0, 10)
  const url = WeixinUtils.sdkUrlIosOrAndorid()
  const str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
  const signature = sha1(str)
  return { timestamp, nonceStr, signature }
}
```

### wx.config
拿到wx.config配置需要的所有信息之后，我们开始执行微信config的配置
```ts
/**
  * @description 初始化微信配置签名
  * @param { Object } data  微信的签名配置
  * @props { Boolean } data.debug  开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  * @props { String } data.appId  必填，公众号的唯一标识
  * @props { Number } data.timestamp  必填，生成签名的时间戳
  * @props { String } data.nonceStr  必填，生成签名的随机串
  * @props { String } data.signature  必填，签名
  * @props { Array } data.jsApiList  必填，需要使用的JS接口列表
  * @link 接口列表地址 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
  */
static initWxConfig (config: IWxConfig): void {
  wx.config(Object.assign({}, {
    debug: false
  }, config))

  wx.error((res: any) => {
    LogUtils.logError(res, '[d-utils] wx.config error => ')
  })
}
```

### 微信分享的方法的注册
配置好了之后就是微信分享的注册，这里只实现微信link的分享，监听的方法写在wx.ready中，并且`wxShareToFriendCircle` `wxShareToFriend`方法会返回一个promise
```ts
/**
  * 分享给朋友
  * @param {Object} sharInfo
  * @props { String } sharInfo.title 分享的title
  * @props { String } sharInfo.desc 分享描述
  * @props { String } sharInfo.link 分享链接
  * @props { String } sharInfo.imgUrl 分享图标
  * @props { Function } sharInfo.success 成功的回调
  * @props { Function } sharInfo.cancel  取消的回调
  * @props { Function } sharInfo.complete 完成的回调
  * @return { Promise<IWxCallBackType> } 返回一个promise
  */
static wxShareToFriend (sharInfo: IWxShareToFriend): Promise<IWxCallBackType> {
  const selfShareInfo = Object.assign({}, this.defaultShareInfo, sharInfo)
  return new Promise ((resolve, reject) => {
    try {
      wx.ready(() => {
        wx.onMenuShareAppMessage({
          title: selfShareInfo.title,
          desc: selfShareInfo.desc,
          link: selfShareInfo.link,
          imgUrl: selfShareInfo.imgUrl,
          success: function (res) {
            const data: IWxCallBackType = {
              type: 'onMenuShareAppMessage',
              data: res
            }
            selfShareInfo.success(data)
            resolve(data)
          },
          cancel: function (res) {
            const data: IWxCallBackType = {
              type: 'onMenuShareAppMessage',
              data: res
            }
            selfShareInfo.cancel(data)
            resolve(data)
          },
          complete: function (res) {
            const data: IWxCallBackType = {
              type: 'onMenuShareAppMessage',
              data: res
            }
            selfShareInfo.complete(data)
            resolve(data)
          }
        })
      })
    } catch (e) {
      const data: IWxCallBackType = {
        type: 'onMenuShareAppMessage',
        data: e
      }
      reject(data)
    }
  })
}

/**
  * 分享到朋友圈
  * @param {Object} sharInfo
  * @props { String } sharInfo.title 分享的title
  * @props { String } sharInfo.link 分享链接
  * @props { String } sharInfo.imgUrl 分享图标
  * @props { Function } sharInfo.success 成功的回调
  * @props { Function } sharInfo.cancel  取消的回调
  * @props { Function } sharInfo.complete 完成的回调
  * @return { Promise<IWxCallBackType> } 返回一个promise
  */
static wxShareToFriendCircle (sharInfo: IWxShareToFriendsCircle): Promise<IWxCallBackType> {
  const selfShareInfo = Object.assign({}, this.defaultShareInfo, sharInfo)
  return new Promise ((resolve, reject) => {
    try {
      wx.ready(() => {
        wx.onMenuShareTimeline({
          title: selfShareInfo.title,
          link: selfShareInfo.link,
          imgUrl: selfShareInfo.imgUrl,
          success: function (res) {
            const data: IWxCallBackType = {
              type: 'onMenuShareTimeline',
              data: res
            }
            selfShareInfo.success(data)
            resolve(data)
          },
          cancel: function (res) {
            const data: IWxCallBackType = {
              type: 'onMenuShareTimeline',
              data: res
            }
            selfShareInfo.cancel(data)
            resolve(data)
          },
          complete: function (res) {
            const data: IWxCallBackType = {
              type: 'onMenuShareTimeline',
              data: res
            }
            selfShareInfo.complete(data)
            resolve(data)
          }
        })
      })
    } catch (e) {
      const data: IWxCallBackType = {
        type: 'onMenuShareTimeline',
        data: e
      }
      reject(data)
    }
  })
}
```
promise返回的 type  data  对象可以用户分享之后提示分享的渠道是否成功

**至此，一个通用的微信分享的实现机制完成了**

### 更新， vue项目出现第一次授权隔一段时间静默授权的时候，出现分享失败的问题
这种问题目前测试只存在于ios的微信浏览器中，解决方法目前只有 页面重新加载的方式初始化微信分享。否则这种问题是毕现的，解决方法
```ts
/**
  * ios 手机在code过期之后会重新静默授权，会导致分享失败，通过url中是否存在code，针对ios用户执行reload的操作
  * @since 3.0.1
  */
static plantIosReloadShim = () => {
  const query = parseUrl()
  if (Object.keys(query).includes('code') && isIOS()) {
    localStorage.setItem('weixin-utils-reload', 'true')
  }
}

/**
  * 在其他页面都需要添加改方法，用户在页面加载之后重新reload，已保证微信分享正常
  * @since 3.0.1
  */
static reloadIosWhenCode = () => {
  const hostAndPath = window.location.href.split('?')[0]
  const reload = localStorage.getItem('weixin-utils-reload')
  const urlSearch = new URLSearchParams(window.location.search)
  urlSearch.delete('code')
  const newUrl = urlSearch.toString() ?  `${hostAndPath}?${urlSearch.toString()}` : hostAndPath
  if (reload === 'true') {
    localStorage.removeItem('weixin-utils-reload')
    setTimeout(() => {
      location.replace(newUrl)
    }, 88)
  }
}
```
需要在路由拦截的时候种植一个 是否需要reload 的判断，依据是判断是否带有code。有的话 在页面加载好的时候执行 `reloadIosWhenCode` 方法以达到reload的效果

[`完整的微信分享代码`](https://github.com/IFmiss/d-utils/blob/master/src/lib/weixinUtils/index.ts)

