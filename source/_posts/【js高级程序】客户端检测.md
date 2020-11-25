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

