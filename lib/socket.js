
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
// 定时任务
var cron = require('node-cron');
const UsersModel=require('../models/users')

//连接建立中
io.on('connection',(socket) => {
    console.log('------socket连接成功了-----',socket.id)
    socket.on('sendMsg',(data) => {
        console.log(`收到客户端的消息：${data}`);
        io.emit('receiveMsg',data);
    })
  // 登录触发
    socket.on('sendLogin', async(data) => {
      await UsersModel.updateOne({email:data.email},{socketId:socket.id})
      let count=0; //第0个30分钟
      //  定时任务
      cron.schedule('*/30 * * * *', async() => {
        console.log('------定时任务每分钟发送一socket------',data.email);
        const result= await UsersModel.findOne({email:data.email})
        count++;
        io.to(result.socketId).emit('sendLogin',`您已连续工作了${count*30}分钟了，该休息一下了！`);
      });
      // console.log(`收到客户端的消息：${data}`);
    })
    // 刷新更改用户的socket.id
    socket.on('reconnection', async(data) => {
      await UsersModel.updateOne({email:data.email},{socketId:socket.id})
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});



module.exports = io;
 