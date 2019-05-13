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
static initWxConfig (data: any): void {
  wx.config(data)

  wx.error((res: any) => {
    LogUtils.logError(res, 'wx.config => error')
  })
}
```

### 微信分享的方法的注册
配置好了之后就是微信分享的注册，这里只实现微信link的分享，监听的方法写在wx.ready中，并且`wxShare`方法会返回一个promise
```ts
/**
  * @description 微信分享初始化
  * @param { Object } sharInfo  分享的内容
  * @props { String } sharInfo.title 分享的title
  * @props { String } sharInfo.desc 分享描述
  * @props { String } sharInfo.link 分享链接
  * @props { String } sharInfo.imgUrl 分享图标
  */
static wxShare (sharInfo: any): Promise<string> {
  // 返回promise
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      // 分享给好友
      wx.onMenuShareAppMessage({
        title: sharInfo.title,
        desc: sharInfo.desc,
        link: sharInfo.link,
        imgUrl: sharInfo.imgUrl,
        success: function () {
          resolve('onMenuShareAppMessage')
        },
        cancel: function () {
          reject('onMenuShareAppMessage')
        }
      })

      // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
      // wx.updateAppMessageShareData({
      //   title: sharInfo.title,
      //   desc: sharInfo.desc,
      //   link: sharInfo.link,
      //   imgUrl: sharInfo.imgUrl,
      //   success: function () {
      //     resolve('updateAppMessageShareData')
      //   },
      //   cancel: function () {
      //     reject('updateAppMessageShareData')
      //   }
      // })

      // 分享到朋友圈
      wx.onMenuShareTimeline({
        title: sharInfo.title,
        link: sharInfo.link,
        imgUrl: sharInfo.imgUrl,
        success: function () {
          resolve('onMenuShareTimeline')
        },
        cancel: function () {
          reject('onMenuShareTimeline')
        }
      })

      // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
      // wx.updateTimelineShareData({
      //   title: sharInfo.title,
      //   desc: sharInfo.desc,
      //   link: sharInfo.link,
      //   imgUrl: sharInfo.imgUrl,
      //   success: function () {
      //     resolve('updateTimelineShareData')
      //   },
      //   cancel: function () {
      //     reject('updateTimelineShareData')
      //   }
      // })
    })
  })
}
```
promise返回的 onMenuShareTimeline 和 onMenuShareAppMessage 字符串可以用户分享之后提示分享的渠道是否成功

**至此，一个通用的微信分享的实现机制完成了**

### 如何使用
```ts
// 明天找以下代码贴出来
```

[`完整的微信分享代码`](https://github.com/IFmiss/d-utils/blob/master/src/lib/weixinUtils/index.ts)

