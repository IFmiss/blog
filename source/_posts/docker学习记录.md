---
title: docker学习记录
date: 2021-06-01 17:46:25
categories: docker
tags: [工程化]
---

Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

Docker 可以让自己的项目在服务器上的docker容器内部执行。

### 容器

#### docker ps
显示所有在运行中的容器

#### docker ps -a
显示所有的容器，包括未运行的。

#### docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
创建一个新的容器并运行一个命令
- OPTIONS
  - -d: 后台运行容器，并返回容器ID；
  - -p: 指定端口映射，格式为：**主机(宿主)端口**:**容器端口**
  - -P: 随机端口映射，容器内部端口随机映射到主机的端口
  - --name="nginx-lb": 为容器指定一个名称；  或者 --name hi_container
  - --dns 8.8.8.8: 指定容器使用的DNS服务器，默认和宿主一致；
  - -h "mars": 指定容器的hostname；
  - -m :设置容器使用内存最大值；

```code
docker run -dp 3001:3000 app-stared
docker run -dp 3000:3000 --name hi app-stared   // 指定name hi
docker run --name mynginx -d nginx:latest   // 以后台模式启动 nginx last版本
```
启动 `app-stared` 镜像浏览器3001映射到容器内的3000端口

#### docker stop [containerId]
停止一个运行中的容器
```code
docker stop d1    // 停止运行中的容器d1
```

#### docker rm [OPTIONS] CONTAINER [CONTAINER...]
删除一个容器
- OPTIONS
  - -f :通过 SIGKILL 信号强制删除一个运行中的容器。
  - -l :移除容器间的网络连接，而非容器本身。
  - -v :删除与容器关联的卷。
```code
docker rm -f db01 db02    // 强制删除容器 db01、db02
docker rm $(docker ps -a -q)    // 删除所有已经停止的容器
```
#### docker logs [OPTIONS] CONTAINER
获取容器的日志
- OPTIONS
  - -f : 跟踪日志输出
  - --since :显示某个开始时间的所有日志
  - -t : 显示时间戳
  - --tail :仅列出最新N条容器日志
```code
docker logs -f mynginx
docker logs --tail 10 mynginx
```

#### docker port
列出指定的容器的端口映射，或者查找将PRIVATE_PORT NAT到面向公众的端口。

```code
docker port [OPTIONS] CONTAINER [PRIVATE_PORT[/PROTO]]

docker port mymysql
3306/tcp -> 0.0.0.0:3306
```

### 镜像
镜像可以看成是由多个镜像层叠加起来的一个文件系统，镜像层也可以简单理解为一个基本的镜像，而每个镜像层之间通过指针的形式进行叠加。

#### docker images
查看所有镜像
```code
docker images   // 查看所有镜像
```

#### docker pull
从镜像仓库中拉取或者更新指定镜像
```code
docker pull [OPTIONS] NAME[:TAG|@DIGEST]

docker pull [image name]:version    // 拉取镜像  支持版本号 docker pull ubuntu:12.04
```

#### push
将本地的镜像上传到镜像仓库,要先登陆到镜像仓库
- OPTIONS
  - --disable-content-trust :忽略镜像的校验,默认开启
```code
docker push [OPTIONS] NAME[:TAG]

docker push myapache:v1   // 上传本地镜像myapache:v1到镜像仓库中。
```

#### docker image rm [image name]
删除某一个镜像
#### docker build
用于使用 Dockerfile 创建镜像。

### Dockerfile 配置
Dockerfile 一般分为四部分：基础镜像信息、维护者信息、镜像操作指令和容器启动时执行指令，’#’ 为 Dockerfile 中的注释。

#### FROM：指定基础镜像，必须为第一个命令
```code
FROM <image>
FROM <image>:<tag>
FROM <image>@<digest>

FROM mysql:5.6
```

#### MAINTAINER: 维护者信息
```code
MAINTAINER <name>

MAINTAINER dw
MAINTAINER dw<dw.self@qq.com>
```

#### RUN：构建镜像时执行的命令
**两种格式**：
- shell 执行
  ```code
  RUN /bin/bash -c 'source $HOME/.bashrc; echo $HOME'
  ```
- exec执行
  ```code
  RUN ["/bin/bash", "-c", "echo hello"]
  ```
#### COPY: 复制指令，从上下文目录中复制文件或者目录到容器里指定路径。
```code
COPY [--chown=<user>:<group>] <源路径1>...  <目标路径>
```

#### CMD 类似于 RUN 指令，用于运行程序，但二者运行的时间点不同:
- CMD 在docker run 时运行。
- RUN 是在 docker build。
> 如果 Dockerfile 中**如果存在多个 CMD 指令，仅最后一个生效**。

```code
CMD echo 1
CMD ["npm", "run", "test"]  // 必须是双引号
```
#### ENV 设置环境变量, 那么在后续的指令中，就可以使用这个环境变量。
```code
ENV <key> <value>
ENV <key1>=<value1> <key2>=<value2>...
```

```code
ENV NODE_VERSION 7.2.0

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc"
```
