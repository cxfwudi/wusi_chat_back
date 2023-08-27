const db = require('../db/index')
const config = require("../config")
//userSchema
module.exports.getAllUsers = (req,res)=>{
  const id = req.params.id
  const sql = 'select username,id,email,avatarImage from userSchema where id!=?'

  db.query(sql,id,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length < 1) return res.cc('Get user error,please tyr again')
    // console.log(result)
    return res.send(result)
  }) 
}