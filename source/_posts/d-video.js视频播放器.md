---
layout: posts
title: d-video.js 视频播放器
date: 2018-12-03 10:02:47
categories: javascript
tags: [js, video]
---

## 关于d-video.js
d-video.js是之前的公司中业务需求所拓展的一个通用的pc端插件，兼容ie9及目前主流浏览器，基于video元素来封装的视频的一体化操作
该插件包涵以下功能
  - 语速调整
  - 清晰度调整
  - 音量调整，菜单的显示与隐藏
  - 全屏设置，动态调整视频大小
  - 播放下一个视频的动态显示

## 代码引入
es6环境下可以基于npm 安装， import 导入的方式
安装:
```code
  npm install d-video
```
导入:
```js
  import Dvideo from 'd-video'
```

es5的代码可以使用script标签直接引用
```html
  <script src="./d-video.js"></script>
```

## 使用
导入完之后，就可以开始使用了
### 初始化
```js
  var video = new Dvideo ({
    ele: '#testVideo',
    // 名字
    title: 'Pneumatic Tokyo - EnV',
    nextVideoExtend: function () {
      // 点击下一页的回调函数， 此时通常会执行获取下一段视频的信息，然后执行视频切换
      video.setVideoInfo(title, url, currentT)
    },
    // 是否显示下一页按钮，配合nextVideoExtend
    showNext: true,
    width: '580px',
    height: '292px',
    src: 'http://www.daiwei.org/index/video/EnV%20-%20PneumaticTokyo.mp4',
    // 是否自动播放
    autoplay: true,
    setVideoDefinition: function (type, e, current) {
      if (type === '0') {
        alert('你点击了标清')
        // video.setVideoInfo('這是標清','这里填写视频的标清地址',current)
    }
    if (type === '1') {
        alert('你点击了标清')
        // video.setVideoInfo('這是標清','这里填写视频的高清地址',current)
    }
    if (type === '2') {
        alert('你点击了标清')
        // video.setVideoInfo('這是標清','这里填写视频的超清地址',current)
    }
    video.showLoading(false)
  },
})
```

### 属性
#### ele
```code
dom 元素， 元素id需要带 # ， 比如 #video  或者 .video
```
#### src
```code
视频地址 <string>
```
#### isShowPoster
```code
是否显示封面，默认为true   bool
```
#### title
```code
视频的名称   string
```
#### width
```code
视频显示宽度   string 默认 '300px'
```
#### height
```code
视频显示高度   string 默认 '160px'
```
#### showNext
```code
是否显示下一集按钮   bool   默认true
```
#### autoplay
```code
是否自动播放   bool   默认  true
```
#### ctrSpeedDuration
```code
控制条 关闭的时间  number (ms)
```
#### loop
```code
视频是否循环播放   bool  默认false
```
#### showVolume
```code
是否显示音量设置  bool  默认true
```
#### volume
```code
音量大小  number  0.8
```
#### showVolumeUnFull
```code
在非全屏幕下是否显示音量调整条   bool  默认false
```
#### showPlayBackRate
```code
是否显示设置语速菜单列表   bool   默认true
```
#### showPlayBackRateUnFull
```code
是否在未全屏的情况下 显示语速   bool  默认true
```
#### playbackRate  语速的设置  object
```code
  activeIndex: 索引  number
  rateList: 语速  array   [0.8, 1, 1.2, 2]
```
#### showVideoDefinition
```code
是否显示清晰度  bool  默认true
```
#### showVideoDefinitionUnFull
```code
非全屏的状态下是否显示   bool   默认true
```
#### videoDefinition: 清晰度的设置  object
```code
  activeIndex: 索引  number
  definitionList: 清晰度选项  object
    definitionList.type: 类型
    definitionList.name: 名称
```
#### nextVideoExtend
```code
可让用户自定义扩展   点击下一个视频的操作  function
```
#### setVideoDefinition
```code
设置清晰度的回调  参数  (type, event, currentT)  function
```
#### onTimeupdate
```code
进度更新事件  参数（currentT)  function
```
#### onPlaying
```code
视频播放事件  参数（currentT)  function
```
#### onPause
```code
视频暂停事件  function
```
#### onEnded
```code
视频播放结束事件   function
```
#### onLoadedMetaData
```code
元数据加载成功事件    function
```

### 方法
#### 更新视频宽度高度
```js
video.updateVideoSize()
@param { number }  width   宽度
@param { number }  height   高度
```
#### 显示上下菜单
```js
video.showTopBottomCtrl()
@param { bool }  disappearance   是否自动消失
```
#### 关闭上下菜单
```js
video.hideTopBottomCtrl()
@param { bool }  immediately   是否立刻关闭
```
#### 更新音量
```js
video.updateVolume(0.5)
@param { number }  vol   音量大小  0 - 1 之间
```
#### 快进
```js
video.videoForward(seconds)
@param { number } seconds  快进时长
```

#### 快退
```js
video.videoRewind(seconds)
@param { number } seconds  快退时长
```

#### 跳转到具体位置
```js
video.videoSeek(seconds)
@param { number } seconds  跳转的位置
```

#### 切换视频地址
```js
video.setVideoInfo()
@param { sting } title  视频的名称
@param { string } url  视频的地址
@param { number } currentT  视频开始播放的时间，默认为0
```
