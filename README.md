##LocalServer
快速把文件目录变为web服务. 目前这个还不很完善, 主要是用来临时测试某个html的时候, 可以快速的把当前目录进行挂载.

### 如何使用

#### 下载项目代码

#### 服务映射. 
```
alias localserver='node /localserver-src/server.js'
alias addserver='node /localserver-src/addserver.js'
```

#### 启动服务

1. 在任意目录执行 localserver &; 挂载主服务.

2. 然后在我们需要目录执行  addserver test .  就把当前目录给挂载到test这个context上了

3. 在浏览器 http://localhost:2000/test 就可以访问当前目录了



