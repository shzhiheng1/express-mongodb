/**
 * 使用 bcrypt 加密和解密
 * 
 * **/ 
const bcrypt=require('bcrypt');

// 加密 默认10级，值越大越难

module.exports.encrypt=async function(data) {
  // 生成随机字符串
  const salt=await bcrypt.genSalt(10)
  // 对返回值加密
  const result=await bcrypt.hash(data,salt)
  return result;
}

/**
 * 解密 ,
 * 参数：password为明码，encryptPassword是加密的码
 * 返回true/false
 * 
 * */ 
module.exports.decrypt=async function (password,encryptPassword) {
  const result=bcrypt.compare(password,encryptPassword)
  return result
}

