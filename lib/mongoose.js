// 引入mongoose 模块
var mongoose=require('mongoose');
console.log(process.env.MONGOOSE_URL)

// 链接数据库服务器
mongoose.connect(process.env.MONGOOSE_URL,{
    useNewUrlParser:true,//解析url中需要数据库
    useUnifiedTopology:true,//默认true
},function(err){
  if(err){
     console.log('-----mongoDB连接失败-----',err)
  }else{
    console.log('------mongoDB连接成功----')
  }
})
// 导出
module.exports=mongoose;