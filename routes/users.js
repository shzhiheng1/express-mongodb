var express = require('express');
var router = express.Router();
var UsersModel=require('../models/users')
var utilities=require('../utils/utilities')
const {register,login}=require('../validation/users')
const {encrypt,decrypt}=require('../utils/bcrypt')
const multiavatar = require('@multiavatar/multiavatar')
const {generateToken,decodeToken} =require('../utils/jwt')
const {authToken} =require('../middlewares/authorization')
// email
const nodemailer=require('nodemailer')
// 连接redis
const client=require('../lib/redis');


/* /users*/
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
* /users/captcha
* 获取邮箱验证码 
*/ 
router.post('/captcha',async(req,res,next)=>{
  const {email}=req.body;
  try {
    const result=await UsersModel.findOne({email})
    if(result){
      return utilities.output(200,0,'邮箱已被注册！')(req,res,next)
    }else{
      let user = "2225018807@qq.com";//自己的邮箱
      let pass = "gmescagriaxcdihd"; //qq邮箱授权码
      // let to = `${receive}@qq.com`; //对方的邮箱
      let transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        // service: 'qq', //类型qq邮箱
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
              user: user, // 用户账号
              pass: pass, //授权码,通过QQ获取
          },
      });
      //  生成随机数
      let code= parseInt(Math.random() * 1000000)
      console.log('---code--',code)
      // 发送邮件 let mailOptions = 
      await transporter.sendMail({
        from: '石先生<2225018807@qq.com>', // 发送方
        to: email, //接收者邮箱，多个邮箱用逗号间隔
        subject:'石先生邮箱验证码',
        // subject: `欢迎登录,你的验证码${code}`, // 标题
        html: `<head><base target="_blank" /><style type="text/css">::-webkit-scrollbar{ display: none; }</style><style id="cloudAttachStyle" type="text/css">#divNeteaseBigAttach, #divNeteaseBigAttach_bak{display:none;}</style><style id="blockquoteStyle" type="text/css">blockquote{display:none;}</style><style type="text/css">     body{font-size:14px;font-family:arial,verdana,sans-serif;line-height:1.666;padding:0;margin:0;overflow:auto;white-space:normal;word-wrap:break-word;min-height:100px}  td, input, button, select, body{font-family:Helvetica, \'Microsoft Yahei\', verdana}  pre {white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;width:95%}  th,td{font-family:arial,verdana,sans-serif;line-height:1.666} img{ border:0}  header,footer,section,aside,article,nav,hgroup,figure,figcaption{display:block}  blockquote{margin-right:0px}</style></head><body tabindex="0" role="listitem"><table width="700" border="0" align="center" cellspacing="0" style="width:700px;"><tbody><tr><td><div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;"><table border="0" cellpadding="0" cellspacing="0" width="700" height="39" style="font:12px Tahoma, Arial, 宋体;"><tbody><tr><td width="210"></td></tr></tbody></table></div><div style="width:680px;padding:0 10px;margin:0 auto;"><div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;"><strong style="display:block;margin-bottom:15px;">尊敬的用户：<span style="color:#f60;font-size: 16px;"></span>您好！</strong><strong style="display:block;margin-bottom:15px;">您正在进行<span style="color: red">用户登录</span>操作，请在验证码输入框中输入：<span style="color:#f60;font-size: 24px">${code}</span>，以完成操作。</strong></div>     <div style="margin-bottom:30px;"><small style="display:block;margin-bottom:20px;font-size:12px;"><p style="color:#747474;">     注意：此操作可能会修改您的密码、登录邮箱或绑定手机。如非本人操作，请及时登录并修改密码以保证帐户安全<br>（工作人员不会向你索取此验证码，请勿泄漏！)</p></small></div></div><div style="width:700px;margin:0 auto;"><div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;"><p>此为系统邮件，请勿回复<br>请保管好您的邮箱，避免账号被他人盗用</p><p>石先生团队</p></div></div></td></tr></tbody></table></body>`
      });
      await client.set(email,code) //redis 存储数据
      await client.expire(email, 600);//设置过期时间 600s 前端六十秒可以重新获取
      return  utilities.output(200,1,'验证码成功！')(req,res,next)
    }
  } catch (error) {
    console.log(error)
    return utilities.output(500,-1,'服务器异常！')(req,res,next)
  }

})


/*
用户注册 /users/register

*/
router.post('/register',register,async(req,res,next)=>{
  const {email,name,password,password2,captcha}=req.body
   try {
    const result=await UsersModel.findOne({email})
    if(result){
     return utilities.output(200,0,'邮箱已被注册！')(req,res,next)
    }else{
      // 验证码是否正确
      let code = await client.get(email)
      if(code!==captcha){
        return  utilities.output(200,0,'邮箱或验证码不正确！')(req,res,next)
      }
      // 生成头像(为了节省空间)
      // const avatar=multiavatar(email)||''
      const avatar=''
      // 密码加密
      const encryptPassword=await encrypt(password)
      await UsersModel.create({name,password:encryptPassword,email,avatar,password2})
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
      // 解码token
      const data=await decodeToken(req);
      const userInfo=await UsersModel.findOne({email:data.email})
      const result={name:userInfo.name,email:userInfo.email,avatar:userInfo.avatar}
      return utilities.output(200,1,'获取用户信息成功！',result)(req,res,next)
    } catch (error) {
      return utilities.output(500,-1,'服务器异常！')(req,res,next)
    }
})

module.exports = router;
