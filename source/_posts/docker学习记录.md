---
title: docker学习记录
date: 2021-06-01 17:46:25
categories: docker
tags: [工程化]
---

Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

Docker 可以让自己的项目在服务器上的docker容器内部执行。

### 容器

### 镜像
镜像可以看成是由多个镜像层叠加起来的一个文件系统，镜像层也可以简单理解为一个基本的镜像，而每个镜像层之间通过指针的形式进行叠加。

```code
docker images   // 查看所有镜像
docker image rm [image name]    // 删除某一个镜像
docker pull [image name]:version    // 拉取镜像  支持版本号 docker pull ubuntu:12.04
docker run [image name]   // 执行image
```

### docker 常用命令

#### docker ps 列出容器
#### docker ps -a 显示所有的容器，包括未运行的。
