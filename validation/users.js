var Validator=require('validator')
var utilities=require('../utils/utilities')
// 注册验证
module.exports.register=(req,res,next)=>{
  const {email='',name='',password='',password2=''}=req.body
  let errors=[]
  if(Validator.isEmpty(name)){
    errors.push('用户名不能为空！')
  }
  if(Validator.isEmpty(email)){
    errors.push('邮箱不能为空！')
  }
  if(Validator.isEmpty(password)){
    errors.push('密码不能为空！')
  }
  if(Validator.isEmpty(password2)){
    errors.push('确认面不能为空！')
  }
  if(!Validator.isLength(name,{min:2,max:20})){
      errors.push('用户名称长度2-30位！')
  }
  if (!Validator.isEmail(email)) {
    errors.push('邮箱不合法！')
  }
  if(!Validator.equals(password,password2)){
    errors.push('设置的密码和确认密码不相同！')
  }
  // 密码必须包含大小写数字^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,20}$
  if(!Validator.matches(password,`^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,20}$`)){
      errors.push('密码必须包含大小写和数字且长度6-20位');
  }
  if(errors.length>0){
    utilities.output(200,0,errors[0],{})(req,res,next)
  }else{
    next()
  }

}

// 登录验证
module.exports.login=function(req,res,next){
  const {email='',password=''}=req.body
  let errors=[]
  if(Validator.isEmpty(email)){
    errors.push('邮箱不能为空！')
  }
  if(Validator.isEmpty(password)){
    errors.push('密码不能为空！')
  }
  if (!Validator.isEmail(email)) {
    errors.push('邮箱不合法！')
  }
  if(!Validator.matches(password,`^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,20}$`)){
    errors.push('密码必须包含大小写和数字且长度6-20位');
  }
  if(errors.length>0){
    utilities.output(200,0,errors[0],{})(req,res,next)
  }else{
    next()
  }
}