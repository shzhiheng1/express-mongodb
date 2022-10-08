const jwt=require('jsonwebtoken');

// 生成token
module.exports.generateToken=function (data={}) {
  return jwt.sign(data,'secretKey',{ expiresIn: '2h' })
}

module.exports.decodeToken=async function (req) {
  let token=req.headers['authorization']||req.headers['x-access-token']|| req.query.token || req.body.token||""
  let data={}
  if(token&&token.startsWith("Bearer")){
     token=token.slice(7, token.length)
  }
  jwt.verify(token, 'secretKey', function(err, decoded) {
    if(err){
      console.log(err)
    }else{
      data= decoded
    }
  });
  return data
}