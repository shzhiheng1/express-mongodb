const redis = require('redis');
let client;
if(process.env.NODE_ENV==='production'){
  client = redis.createClient(
    {url: process.env.REDIS_URL}
  ); 
}else{
  client = redis.createClient(
    {port:6379,host:'127.0.0.1'}  //或本地可以不填写
    
  ); //默认没有密码 127.0.0.1  端口也是默认
}

// 如果是连接远程的话
// redis[s]://[[username][:password]@][host][:port][/db-number]:
// const client = createClient({
//  url: 'redis://alice:foobared@awesome.redis.server:6380'
// });

let redisRequest=0;//redis尝试链接的次数
client.on('error', (err) =>{
  redisRequest++
  if(redisRequest>2){
     client.quit();//关闭连接
  }
    return console.log('------redis连接失败------', err)
  }
);
client.on('connect', () => {
  console.log('----------redis连接成功-------');
})

client.connect();


module.exports = client;