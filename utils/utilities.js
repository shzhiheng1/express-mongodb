
module.exports.output = (status,code,msg,data={})=>{
  return (req,res,next)=>{
    const errorData={
      code,
      msg
    }
    const jsonData = { error: errorData }
    Object.assign(jsonData,{data})

    res.type('application/json')
    res.status(status).json(jsonData)
  }
}
