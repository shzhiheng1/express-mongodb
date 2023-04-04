
// 创建socket服务
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const appServer = express();
const socketServer = http.createServer(appServer);
socketServer.listen(3000,() => {
  console.log("---stocket端口为:3000----");
});
const io = socketIO(socketServer,{ //
    cors: {
        origin: '*'
    }
});
//连接建立中
io.on('connection',(socket) => {
    console.log('------socket连接成功了-----')
    socket.on('sendMsg',(data) => {
        console.log(`收到客户端的消息：${data}`);
        io.emit('receiveMsg',data);
    })
    socket.on('sendLogin',(data) => {
      console.log(`收到客户端的消息：${data}`);
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});



module.exports = io;
 