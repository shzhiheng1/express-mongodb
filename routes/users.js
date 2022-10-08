var express = require('express');
var router = express.Router();
var UsersModel=require('../models/users')
var utilities=require('../utils/utilities')
const {register,login}=require('../validation/users')
const {encrypt,decrypt}=require('../utils/bcrypt')
const multiavatar = require('@multiavatar/multiavatar')
const {generateToken,decodeToken} =require('../utils/jwt')
const {authToken} =require('../middlewares/authorization')

/* /users*/
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/*
用户注册 /users/register

*/
router.post('/register',register,async(req,res,next)=>{
  const {email,name,password}=req.body
   try {
    const result=await UsersModel.findOne({email})
    if(result){
     return utilities.output(200,0,'邮箱已被注册！')(req,res,next)
    }else{
      // 生成头像
      const avatar=multiavatar(email)
      // 密码加密
      const encryptPassword=await encrypt(password)
      await UsersModel.create({name,password:encryptPassword,email,avatar})
      return  utilities.output(200,1,'注册注册成功！')(req,res,next)
    }
   } catch (error) {
    console.log(error)
     return utilities.output(500,-1,'服务器异常！')(req,res,next)
   }
})

router.post('/login',async (req,res,next)=>{
  const {password,email}=req.body
   try {
    const result=await UsersModel.findOne({email})

    if (result) {
      // 解码
      const encryptSuccess=await decrypt(password,result.password)
      if(encryptSuccess){
        // 生成token
       const token= generateToken({email,name:result.name})
       return utilities.output(200,1,'登录成功！',{token:"Bearer "+token})(req,res,next)
      }else{
        return utilities.output(200,0,'密码不正确！')(req,res,next)
      }
    } else {
      return utilities.output(200,0,'用户不存在！')(req,res,next)
    }
   } catch (error) {
      return utilities.output(500,-1,'服务器异常！')(req,res,next)
   }
})

// 获取用户信息
router.post('/info',authToken,async (req,res,next)=>{
   try {
      const data=await decodeToken(req);
      const result=await UsersModel.findOne({email:data.email})
      return utilities.output(200,1,'获取用户信息成功！',result)(req,res,next)
    } catch (error) {
      return utilities.output(500,-1,'服务器异常！')(req,res,next)
    }
})

module.exports = router;
