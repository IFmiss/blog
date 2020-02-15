---
title: 个人脚手架tiga-cli搭建总结
date: 2020-02-01 10:57:13
categories: js
tags: [cli, react, javascript]
---

#### 可尝试安装使用
```code
npm i tiga-cli -g
```

#### 新建项目
```bash
tiga init test-cli
```

#### 配置好信息之后下载模版

#### 下载模版完成之后进入项目
安装依赖
```bash
npm install
```

或者yarn安装
```bash
npm install
```

运行项目
```bash
npm run dev
```

#### 打开浏览器输入 localhost:1994 即可访问

### 正文从这里开始
### 背景
就想弄一个个人脚手架，尤其是在 react 项目中尝试使用，集成 react-router路由管理，redux这类项目状态管理，typescript支持，css预处理选择，以及单侧等其他功能，做到动态配置，开袋即食的功能效果

### 项目构建目录
|-- bin  
&ensp;&ensp;|-- index.js  
&ensp;&ensp;|-- init.js  
&ensp;&ensp;|-- update.js  
|-- utils  
&ensp;&ensp;|-- download.js  
&ensp;&ensp;|-- file.js  
&ensp;&ensp;|-- handlebars.register.js  
&ensp;&ensp;|-- template.js  
&ensp;&ensp;|-- utils.js  
|-- package.json  
|-- README.md  

### 用到的第三方依赖库
- **commander**： 自动的解析命令和参数，必备
- **path，fs，rimraf，fs-extra**： 文件读写复制粘贴等相关依赖
- **ora**：终端加载动画效果
- **inquirer**：终端动态提示效果，贼优雅
- **chalk**：美化打印效果
- **download-git-repo**：远程分支拉取至本地
- **handlebars**：js模版引擎，用于根据不同配置产出不同项目内容
- **metalsmith**：处理远程下载的项目模版

### 先从bin说起
`bin` 目录是整个项目的入口，package.json 的配置如下
```json
{
  "name": "tiga-cli",
  "version": "1.0.3",
  "description": "tiga cli",
  "bin": {
    "tiga": "./bin/index.js"
  },
  // ...
}
```
package.json提供一个映射到本地本地文件名的bin字段,一旦被引入后,npm将软链接这个文件到prefix/bin里面,以便于全局引入

- 如果我们全局安装了项目可以在任何目录下执行 `tiga ...` 命令
- 如果只是项目本地安装可以在项目的相对路径下找到地址执行对应的命令 如: `./node_modules/.bin/tiga...`

以上会执行到 `package.json` 配置的对应文件 `./bin/index.js`

来看看index.js是什么内容

### 入口文件 bin/index.js
```js
#!/usr/bin/env node
const program = require('commander');

const {
  init
} = require('./init');

const {
	updateTiga
} = require('./update')

program.on('--help', function(){
     console.log('');
     console.log('Examples:');
     console.log('  [version]   tiga -v or --version');
     console.log('  [init]      tiga init test-file');
     console.log('');
})

program
		 .version(require('./../package').version, '-v, --version', 'tiga version')

program
     .command('init [project]')
     .action(function (name) {
        if (name) {
					init(name)
        }
		 })

program
		 .command('update', 'update tiga version')
		 .action(function () {
				updateTiga()
		 })
     .parse(process.argv)

```

> `#!/usr/bin/env node` 用于定义文件使用node环境执行，这是必须要注明的

引入了两个方法 `init` 和 `update`
- 终端执行 `tiga init test_cli`，会执行 action 的动作执行内部回调方法初始化 `test_cli`
- 终端执行 `tiga update` 执行更新方法
其他则是针对 `--help` 的自定义配置，以及 动态获取版本 的配置

### 初始化一个项目 bin/init.js
在index.js中，用户如果执行 init projectname 则会执行 init.js 中定义的 init 方法，传入 project 名称作为参数，初始化的过程如下

### 以 project name 在当前路径下建立同名文件夹 
- 先判断本地是否有同名文件夹，如果有 提示是否重置，确定删除文件夹，执行后续操作，取消则取消项目创建
- 如果没有同名文件夹，则直接创建新的文件夹，执行后续操作
> 此操作是在 `动态获取用户配置信息` 之后先执行的动作

代码如下
```js
/**
 * 初始化动作，校验是否已有重名项目
 * @param { String } name   项目名称
 */
function init (name) {
  console.log();
  if (!name) {  // project-name 必填
    // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
    program.help()
    return
  }
  
  projectName = name
  const list = glob.sync('*')  // 遍历当前目录
  
  // 如果当前目录不为空
  if (list.length) {
    // 判断文件是否存在
    if (list.some(n => {
      const fileName = path.resolve(process.cwd(), n);
      const isDir = isDirSync(fileName);
      return name === n && isDir
    })) {
      inquirer
        .prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `项目名称: ${name} 已经存在, 确认覆盖此文件夹?`,
          }
        ]).then(answers => {
          if (answers.ok) {
            inputBaseInfo(name, true)
            return
          }
        }).catch(err => {
          throw err
        })
      return
    }
    inputBaseInfo(name)
  } else {
    inputBaseInfo(name)
  }  
}
```

### 动态获取用户配置信息
通过 `inquirer.prompt` 方法动态获取用户传入的一系列信息，存储在一个对象中
- `coverDir` 是否需要覆盖同名文件夹 
- `name` 项目名称
- `rootName` 当前执行命令的却对路径位置，需要在这个目录下 添加一个 project 同名的目录
- `name` package.json 中动态的项目名称
- `description` package.json 中动态的项目描述
- `useRouter` 是否使用 React-Router
- `useTypeScript` 是否使用 TypeScript
- `useStore` 状态管理 'redux', 'mobx', 'none'
- `useStyle` 样式预处理 'less', 'scss', 'none'
- `useTest` 是否使用 单元测试 (mocha)
该对象用于满足后续的模版渲染，以及项目配置

代码如下
```js
/**
 * 安装之前需要下载的信息 
 * @param { String } name   项目名称
 * @param { Boolean } cover   是否需要覆盖文件夹
 */
async function inputBaseInfo(name, cover) {
  let projectInfo = {
    name,
    rootName
  }
  // 输入描述，和开发人
  inquirer.prompt([
    {
      name: 'description',
      message: '请输入项目描述'
    },
    {
      name: 'author',
      message: '请输入作者名称'
    }
  ]).then(({ description, author }) => {
    projectInfo = Object.assign({}, projectInfo, {
      description,
      author
    })
    // 安装什么环境

    inquirer.prompt([
      {
        name: 'useRouter',
        type: 'confirm',
        message: `是否使用 React-Router ?`,
      }, {
        name: 'useTypeScript',
        type: 'confirm',
        message: `是否使用 TypeScript ?`,
      }, {
        type: 'list',
        message: '是否有数据状态管理的需求 ?',
        name: 'useStore',
        choices: ['redux', 'mobx', 'none'],
      }, {
        type: 'list',
        message: '选择一个css 预处理 ?',
        name: 'useStyle',
        choices: ['less', 'scss', 'none'],
      },
      //  {
      //   name: 'useGitManager',
      //   type: 'confirm',
      //   message: `是否使用 git hook ?`,
      // },
      {
        name: 'useTest',
        type: 'confirm',
        message: `是否使用 单元测试 (mocha) ?`,
      }
    ]).then(async ({ useRouter, useTypeScript, useStore, useStyle, useTest }) => {
      projectInfo = Object.assign({}, projectInfo, {
        useRouter,
        useTypeScript,
        useStore,
        useStyle,
        useTest
      })

      console.log()

      if (cover) {
        Object.assign(projectInfo, {
          coverDir: true
        })
        const spinner = ora()
        spinner.start(`删除目录下已存在的 [${projectInfo.name}] 文件夹...  \n`)
        // 为了防止 要覆盖的文件内容少导致无法渲染 start文案 而直接显示 succeed 文案结果的问题
        await sleep(500)

        await removeFileOrDirSync(projectName)
        spinner.succeed(`[${projectInfo.name}] 原文件清除成功 \n`)
      }
      await start(projectInfo)
    })
  })
}
```

### 远程下载项目模版 utils/download.js
使用 `download-git-repo` 将远程模版代码拉取到本地的 临时的文件夹 `.download-temp/`
提供两个方法
- `init` 初始化下载配置 返回一个 promise
- `finish` 则是下载成功之后的一个提示方法

代码如下
```js
const download = require('download-git-repo')
const ora = require('ora')
const path = require('path')
const repoUrl = 'IFmiss/tiga-template-react#master'

const Download = {
  projectName: '',

  spinner: ora(`正在下载项目模板... \n`),

  init: (target) => {
    Download.projectName = target
    return new Promise((resolve, reject) => {
      let mergeTarget = path.join(target || '.', '.download-temp')
  
      Download.spinner.start()
  
      download(repoUrl, mergeTarget, {
        clone: true
      }, function (err) {
        if (err) {
          Download.spinner.fail()
          reject(err)
          return
        }
  
        resolve(mergeTarget)
      })
    }, (err) => {
      Download.spinner.fail()
      reject(err)
    })
  },

  finish: () => {
    Download.spinner.succeed(`模版下载完成: \n 
    cd ${Download.projectName} \n 
    npm install || yarn \n
    npm run dev || yarn dev  \n`)
  }
}

module.exports = Download
```

### metalsmith 处理项目模版 utils/template.js
处理项目模版之前先介绍一下这个模版

#### 模版
目前位于个人项目 `tiga-template-react` 这个 github repo中，拉取的是 `master` 分支

基于 `handlebars` 创建的模版 基本就是 #if #unless 以及一些自定义的条件语句使用
地址: https://github.com/IFmiss/tiga-template-react

#### 【模版处理步骤一】 initIgnoreFile 动态渲染 templates.ignore 文件
`removeIgnoreFile` 删除在 模版 文件的 `templates.ignore` 文件中定义的，目的是有些不同配置的内容显示的文件不一样，比如
- 使用ts 需要我渲染所有.ts .tsx 文件，移除.js .jsx文件，反之亦然
- 不同的状态管理 文件内容不同，此时则需要过滤不同配置下的文件渲染

`templates.ignore` 大致内容如下
```code
{{#if useTest}}
{{#if useTypeScript}}
.mocharc.yaml
{{/if}}
{{#unless useTypeScript}}
.mocharc.json
{{/unless}}
{{/if}}
```
大致解析一下，在 执行 `removeIgnoreFile` 的时候，会解析 `templates.ignore`的内容，动态生成需要删除的文件src地址
如果 `useTest` `useTypeScript` 都为 true 的时候 `templates.ignore` 的渲染结果为
```code
.mocharc.yaml
```
意思就是需要删除 模版项目中 的 `.mocharc.yaml` 配置文件

> 在这个过程中，还执行了对 store文件夹特殊处理，将原本的 src/store/redux 或者 src/store/mobx 内的文件内容，复制到 src/store 目录下

看代码
```js
/**
  * 根据 templates.ignore 删除不需要的文件
  */
removeIgnoreFile: async (projectInfo) => {
  await Tpl.moveFileDirSync(projectInfo)
  return new Promise((resolve, reject) => {
    const metalsmith = Metalsmith(process.cwd())
                    .metadata(projectInfo)
                    .clean(false)
                    .source(projectInfo.downloadTemp)
                    .destination(projectInfo.name);
    const ignoreFile = path.join(projectInfo.downloadTemp, 'templates.ignore')
    if (existsSync(ignoreFile)) {
      // 定义一个用于移除模板中被忽略文件的metalsmith插件
      metalsmith.use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        // 先对ignore文件进行渲染，然后按行切割ignore文件的内容，拿到被忽略清单
        const ignores = handlebars.compile(fs.readFileSync(ignoreFile).toString())(meta)
                                  .split('\n').filter(item => !!item.length)
        Object.keys(files).forEach(fileName => {
          // 移除被忽略的文件
          ignores.forEach(async ignorePattern => {
            if (minimatch(fileName, ignorePattern)) {
              delete files[fileName]
              await removeFileOrDirSync(path.join(projectInfo.downloadTemp, fileName))
            }
          })
        })
        done()
      }).build(err => {
        err ? reject(err) : resolve(projectInfo)
      })
    }
  })
},

/**
  * 针对 状态 管理，mobx，redux 拷贝至store目录下
  */
moveFileDirSync: async (projectInfo) => {
  if (projectInfo.useStore === 'none') {
    return Promise.resolve(projectInfo)
  }
  return new Promise((resolve, reject) => {
    const storeDir = path.join(projectInfo.downloadTemp, 'src/store')
    const copyedDir = path.join(projectInfo.downloadTemp, 'src/store', projectInfo.useStore)
    fs.copy(copyedDir, storeDir, err => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }
      resolve(projectInfo)
    })
  })
}
```
删除成功之后会执行 `initFile` 方法 来到了第二步的操作了

#### 【模版处理步骤二】 initFile 渲染文件内容 且存放于 project name 目录
这个过程是将其他需要文件内容动态渲染，**且将原本下载的临时存储文件移动到 project name 目录下**
内容可能包含需要不同显示的效果，比如
- ts需要定义一些类型，而js可能不需要他
- 不同预处理引入的文件名称不一样 .less, .css, .scss

看代码
```js
/**
  * 文件初始化
  */
initFile: (projectInfo) => {
  return new Promise((resolve, reject) => {
    const packjsonTemp = path.join(projectInfo.downloadTemp, 'package.json')
    const metalsmith = Metalsmith(process.cwd())
                    .metadata(projectInfo)
                    .clean(false)
                    .source(projectInfo.downloadTemp)
                    .destination(projectInfo.name);
    metalsmith.use((files, metalsmith, done) => {
      const meta = metalsmith.metadata();
      Object.keys(files).forEach(fileName => {
        const fileText = files[fileName].contents.toString()
        // 是否是图片
        if (isImage(fileName)) {
          fs.copyFileSync(path.join(projectInfo.downloadTemp, fileName),
                          path.join(projectInfo.name, fileName))
        } else {
          if (fileName === 'package.json') {
            files[fileName].contents = handlebars.compile(fs.readFileSync(packjsonTemp).toString())(meta);
          } else {
            files[fileName].contents = Buffer.from(handlebars.compile(fileText)(meta));
          }
        }
      })
      done();
    }).build(async err => {
      await removeFileOrDirSync(projectInfo.downloadTemp)
      await Tpl.removeIgnoreTemplate(projectInfo)
      err ? reject(err) : resolve(projectInfo)
    })
  })
},
```
`metalsmith` 无法处理 文字，图片等内容，所以需要提前过滤，这里做了一些判断
- 图片单独处理
- package.json 的区分渲染
- 其他内容渲染
.build 方法执行成功之后 执行删除操作

#### 【模版处理步骤三】 删除临时下载的文件
单纯的删除临时的文件夹 `.download-temp/`
```js
const rm = require('rimraf').sync
/**
  * 删除文件夹或者文件的操作
  * @param { String } fileName 
  */
  removeFileOrDirSync (fileName) {
  rm(fileName)
}
```
此后的操作都在正式的文件目录下，但是还有一点，`templates.ignore` 文件需要被删除

#### 【模版处理步骤四】 删除 templates.ignore
```js
/**
  * 删除 templates.ignore
  */
removeIgnoreTemplate: async (projectInfo) => {
  const ignoreFile = path.join(projectInfo.name, 'templates.ignore')
  await removeFileOrDirSync(ignoreFile)
}
```

#### 模版处理结束 初始化项目执行结束

#### 【添加 git init 初始化操作】用于配置 githook
```js
initGitHook: (path) => {
  console.log('')
  return new Promise((resolve, reject) => {
    if (cd(path).code !== 0) {
      console.log(chalk.red(`无法进入[${path}]目录执行git初始化 \n`))
      exit(1)
      reject()
    }

    if (exec('git init').code !== 0) {
      console.log(chalk.red(`git init 初始化失败 \n`))
      exit(1)
      reject()
    }

    console.log('')
    console.log('git init 初始化成功')
    console.log('')
    resolve()
  })
}
```

至此一个脚手架的初始化执行完成

### 支持的功能
- [x] 可配置 css 预处理 less, scss
- [x] 可配置 typescript
- [x] 可配置 redux, mobx 状态 管理
- [x] 可配置 React-router
- [x] 开发环境 环境配置
- [x] 可选择 单元测试 mocha
- [x] 可配置 git hook

### 项目地址
tiga-cli: https://github.com/IFmiss/tiga-cli
