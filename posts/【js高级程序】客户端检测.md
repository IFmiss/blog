---
title: 【js高级程序】客户端检测
date: 2020-11-25 07:36:34
categories: javascript
tags: [js]
---

红宝书学习记录

### *原文整理摘抄自 javascript 高级程序开发(第4版) 第13章*

### 能力检测
能力检测（又称特性检测）即在 JavaScript **运行时中使用一套简单的检测逻辑，测试浏览器是否支 持某种特性**。
```js
if (object.propertyInQuestion) {
  // 使用 object.propertyInQuestion
}
```
能力检测的关键是理解两个重要概念。
- 应该先检测最常用的方式。
- 必须检测切实需要的特性。某个能力存在并不代表别的能力也存在。

#### 基于能力检测进行浏览器分析
##### 检测特性
如果你的应用程序需要使用特定的浏览器能力，那么最好集中检测所 有能力，而不是等到用的时候再重复检测。
```js
// 检测浏览器是否支持 Netscape 式的插件
let hasNSPlugins = !!(navigator.plugins && navigator.plugins.length);

// 检测浏览器是否具有 DOM Level 1 能力
let hasDOM1 = !!(document.getElementById && document.createElement && document.getElementsByTagName);
```
> 能力检测最适合用于决定下一步该怎么做，而不一定能够作为辨识浏览器的标志。

### 用户代理检测
用户代理检测通过浏览器的用户代理字符串确定使用的是什么浏览器。用户代理字符串包含在每个 HTTP 请求的头部，在 JavaScript 中可以通过 navigator.userAgent 访问。
- 在服务器端，常见的做法 是根据接收到的用户代理字符串确定浏览器并执行相应操作。
- 而在客户端，用户代理检测被认为是不可 靠的，只应该在没有其他选项时再考虑。

#### Gecko 
Gecko渲染引擎是 Firefox 的核心。
```code
Mozilla/MozillaVersion (Platform; Encryption; OS-or-CPU; Language; PrereleaseVersion)Gecko/GeckoVersion ApplicationProduct/ApplicationProductVersion
```

#### WebKit
2003年，苹果宣布将发布自己的浏览器 Safari。Safari 的渲染引擎叫 WebKit，是基于 Linux 平台浏 览器 Konqueror 使用的渲染引擎 KHTML 开发的。
```code
Mozilla/5.0 (Platform; Encryption; OS-or-CPU; Language) AppleWebKit/AppleWebKitVersion (KHTML, like Gecko) Safari/SafariVersion

Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/522.15.5 (KHTML, like Gecko) Version/3.0.3 Safari/522.15.5
```

#### Blink
谷歌的 Chrome 浏览器使用 Blink 作为渲染引擎，使用 V8 作为 JavaScript 引擎。Chrome 的用户代理 字符串包含所有 WebKit 的信息，另外又加上了 Chrome 及其版本的信息。
```code
Mozilla/5.0 (Platform; Encryption; OS-or-CPU; Language) AppleWebKit/AppleWebKitVersion (KHTML, like Gecko) Chrome/ChromeVersion Safari/SafariVersion
```

#### Opera
```code
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.64
```

#### iOS 与 Android
iOS 和 Android 移动操作系统上默认的浏览器都是基于 WebKit 的，因此具有与相应桌面浏览器一样 的用户代理字符串。


#### 浏览器分析
通过检测用户代理来识别浏览器并不是完美的方式，毕竟这个字符串是可以造假的。
只不过实现 window.navigator 对象的浏览器（即所有现代浏览器）都会提供 userAgent 这个只读属性。因此， 简单地给这个属性设置其他值不会有效：

不过，有些浏览器提供伪私有的__defineGetter__方法， 利用它可以篡改用户代理字符串：
```js
// Chrome 浏览器测试
window.navigator.__defineGetter__('userAgent', () => 'foobar')
console.info(window.navigator.userAgent);  // "foobar"
```

### 软件与硬件检测
#### 识别浏览器与操作系统 (测试于mac pc端)
1. `navigator.oscpu` 通常对应用户代理字符串中操作系统/系统架构相关信息。
```js
// Chrome Safari 显示为 undefind
console.info(navigator.oscpu) // undefind
```

2. `navigator.vendor` 通常包含浏览器开发商信息。
```js
// Chrome
console.info(navigator.vendor)    // Google Inc.

// Safari
console.info(navigator.vendor)    // Apple Computer, Inc.
```

3. `navigator.platform` 通常表示浏览器所在的操作系统。
```js
// Chrome
console.info(navigator.vendor)    // MacIntel

// Safari
console.info(navigator.vendor)    // MacIntel
```

4. `screen.colorDepth` 和 `screen.pixelDepth` 
返回一样的值，即显示器每像素颜色的位深。
```js
// Chrome
console.info(screen.colorDepth, screen.pixelDepth)    // 30 30

// Safari
console.info(screen.colorDepth, screen.pixelDepth)     // 24 24
```

5. `screen.orientation` 返回一个 ScreenOrientation 对象
```js
// Chrome
console.info(screen.orientation) 
// {
//   angle: 0
//   onchange: null
//   type: "landscape-primary"
// }

// Safari 
console.info(screen.orientation)  // undefind
```

#### 浏览器元数据
navigator 对象暴露出一些 API，可以提供浏览器和操作系统的状态信息。

##### Geolocation API
浏览器脚本感知当前设备的地理位 置。这个 API 只在安全执行环境(通过 HTTPS 获取的脚本)中可用。

```js
navigator.geolocation.getCurrentPosition((position) => console.info(position));

// 如果同意返回如下信息
// {
//   coords: {
//     accuracy: 55 
//     altitude: null
//     altitudeAccuracy: null
//     heading: null 
//     latitude: 31.273845500000004
//     longitude: 121.471465
//     speed: null
//   },
//   timestamp: 1606297728920
// }
```
- `coords`
  - `accuracy` 以米为单位的精度(纬度相关)
  - `altitude` 海拔高度 (精度值:米) 设备必须具备相应的能力(比 如 高度计),否则为null
  - `altitudeAccuracy`  海拔精度(米)
  - `heading`  表示相对于正北方向移动的角度(0 ≤ heading < 360)
  - `latitude`  纬度
  - `longitude`  经度
  - `speed`  表示设备每秒移动的速度
- `timestamp`  表示查询时间的时间戳

`getCurrentPosition` 第二个参数是error 错误的回调函数，参数e是一个对象，包含一下参数
- `code` 属性是一个整数,表示以下 3 种错误
  - `PERMISSION_DENIED` 地理位置信息的获取失败，因为该页面没有获取地理位置信息的权限。
  - `POSITION_UNAVAILABLE` 地理位置获取失败，因为至少有一个内部位置源返回一个内部错误。
  - `TIMEOUT` 获取地理位置超时，通过定义 `PositionOptions.timeout` 来设置获取地理位置的超时时长。
- `message` string

`getCurrentPosition` 第三个参数 `PositionOptions`对象，可设置如下属性
- `enableHighAccuracy` true 表示返回的值应该尽量精确，默认值为 false。
- `timeout` 毫秒 表示在以 TIMEOUT 状态调用错误回调函数之前等待的最长时间
- `maximumAge` 毫秒 表示返回坐标的最长有效期，默认值为 0。0 表示强 制系统忽略缓存的值，每次都重新查询。

##### Connection State 和 NetworkInformation API
1. Connection State: online & offline
```js
const connectionStateChange = () => console.log(navigator.onLine);

// 网络连接时触发
window.addEventListener('online', connectionStateChange);

// 网络断开时触发
window.addEventListener('offline', connectionStateChange);
```

2. NetworkInformation API
navigator 对象还暴露了 NetworkInformation API，可以通过 navigator.connection 属性使用
```js
navigator.connection  // NetworkInformation {onchange: null, effectiveType: "4g", rtt: 100, downlink: 10, saveData: false}
```
以下是 NetworkInformation API 暴露的属性。
- `downlink` 整数，表示当前设备的带宽(以 Mbit/s 为单位)，舍入到最接近的 25kbit/s。这个值可能会根据历史网络吞吐量计算，也可能根据连接技术的能力来计算。
- `downlinkMax` 整数，表示当前设备最大的下行带宽(以 Mbit/s 为单位)，根据网络的第一跳来确定。因为第一跳不一定反映端到端的网络速度，所以这个值只能用作粗略的上限值。
- `effectiveType` 字符串枚举值，表示连接速度和质量。`slow-2g` | `2g` | `3g` | `4g`
- `rtt` 表示当前网络实际的往返时间，舍入为最接近的 25 毫秒。
- `type` 字符串枚举值，表示网络连接技术。这个值可能为下列值之一。
  - `bluetooth` 蓝牙
  - `cellular` 蜂窝
  - `ethernet` 以太网
  - `none` 无网络连接。相当于 navigator.onLine === false。
  - `mixed` 多种网络混合。
  - `wifi` wifi状态
  - ...
- `saveData` 表示用户设备是否启用了“节流”(reduced data)模式。
- `onchange` 会在任何连接状态变化时激发一个 change 事件。
  ```js
    navigator.connection.addEventListener('change',changeHandler)
  ```

3. Battery Status API
```js
(async() => {
  const res = await navigator.getBattery();
  alert(JSON.stringify(res))    //  BatteryManager 对象。
})()
```
BatteryManager 包含 4 个只读属性，提供了设备电池的相关信息
- `charging` 布尔值，表示设备当前是否正接入电源充电。如果设备没有电池，则返回 true。
- `chargingTime` 整数，表示预计离电池充满还有多少秒。
- `dischargingTime` 整数，表示预计离电量耗尽还有多少秒。
- `level` 浮点数，表示电量百分比。电量完全耗尽返回 0.0，电池充满返回 1.0。如果设备没有电
池，则返回 1.0。

这个 API 还提供了 4 个事件属性，可用于设置在相应的电池事件发生时调用的回调函数。
- `onchargingchange`  充电状态变化时的处理程序
- `onchargingtimechange`  充电时间变化时的处理程序
- `ondischargingtimechange`   放电时间变化时的处理程序
- `onlevelchange`   电量百分比变化时的处理程序

#### 硬件
1. 处理器核心数  `navigator.hardwareConcurrency`
返回浏览器支持的逻辑处理器核心数量，包含表示核心
数的一个整数值(如果核心数无法确定，这个值就是 1)。关键在于，这个值表示浏览器可以并行执行的 最大工作线程数量，不一定是实际的 CPU 核心数。

2. 设备内存大小 `navigator.deviceMemory`
返回设备大致的系统内存大小，包含单位为 GB 的浮点数(舍入
为最接近的 2 的幂:512MB 返回 0.5，4GB 返回 4)。

3. 最大触点数  `navigator.maxTouchPoints`
返回触摸屏支持的最大关联触点数量，包含一个整数值。

