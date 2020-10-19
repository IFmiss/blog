---
title: web安全-SQL注入
date: 2020-10-14 16:07:57
categories: web安全
tags: [web安全]
---

### 举例
例如登陆请求
输入用户名和密码登陆用户信息，基本上会执行这个sql语句
```sql
select * from tb_user_info Where 'username' = 'dw' and 'password' = '123'
```
但是如果输入
username: `'' or 1 = 1 --`
password: `''`

```sql
select * from tb_user_info Where 'username' = '' or 1 = 1 and 'password' = ''
```

### 原理
主要是攻击者，利用被攻击页面的一些漏洞，改变数据库执行的SQL语句，从而达到获取“非授权信息”的目的。

### SQL防御方式
##### 转义符号
针对前端在表单提交之前进行数据格式校验

##### 服务端sql转译
后端采用sql语句预编译和绑定变量，是防御sql注入的最佳方法 
