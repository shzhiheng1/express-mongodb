// 生成随机数
var shortid= require('shortid')
// 引入 mongoose
var mongoose =require('mongoose');

// 定义schema
var schema=mongoose.Schema;
const UsersSchema=new schema({
    id:{
       type:String,
       default:shortid.generate,
       index:true
    },
    socketId:{
        type:String,
        default:''
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    password2:{
        type:String,
        default:''
    },
    avatar:{
        type:String,
        default:''
    },
    createTime:{
        type:Number,
        default:Date.now
    }
})

module.exports=mongoose.model('Users',UsersSchema);