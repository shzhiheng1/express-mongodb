const jwt=require('jsonwebtoken');
const utilities=require('../utils/utilities')


// 验证和解码token
module.exports.authToken=function(req,res,next) {
  let token=req.headers['authorization']||req.headers['x-access-token']|| req.query.token || req.body.token||""
  if(token&&token.startsWith("Bearer")){
     token=token.slice(7, token.length)
  }
  console.log(token)

  if (token) {
    jwt.verify(token, 'secretKey', function(err, decoded) {
      if(err){
        console.log(err)
        utilities.output(401,0,'token验证失败！')(req,res,next)
      }else{
         console.log(decoded)
         next()
      }
    });
  } else {
    utilities.output(401,0,'token获取失败！')(req,res,next)
  }
 
}