## 关于 websocket 简单 demo

1. 服务器语言选择 nodeJs，

- 一是因为自己是做前端的，对 javascript 比较熟悉，相比于其他后台语言，自然会更喜欢 nodeJs 了
- 二是 NodeJs 本身事件驱动的方式很擅长与大量客户端保持高并发的连接。所以就选择 NodeJs 了。#

服务器的实现很简单，先装一个 nodeJs 的模块，叫 nodejs-websocket ， 直接在 nodeJs 命令行中敲入：npm install nodejs-websocket 回车就可以安装好了，#
然后就可以开始建立服务器了，因为有了 nodejs-websocket 模块，所以很多工作都不用我们自己做，直接调用别人封装好的方法就行了：#

2. 使用 node 启动 server
3. 打开 game1 和 game2 俩页面, 点击就可达到相互交互效果

ps: nodejs-websocket registry link https://github.com/sitegui/nodejs-websocket#readme
