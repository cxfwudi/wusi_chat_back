const db = require('../db/index')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("../config")
//userSchema
module.exports.register = (req,res) => {
  console.log("register")
  const {username, email, password} = req.body;
  const sqlStr_username = 'select * from userschema where username=?'
  const sqlStr_email = 'select * from userschema where email=?'
  db.query(sqlStr_username,[username],(err,result)=>{
    if(err) return res.cc(err)
    if(result.length > 0) return res.cc('Username has used')

    db.query(sqlStr_email,[email],(err,result)=>{
      if(err) return res.cc(err)
      if(result.length > 0) return res.cc('Email has used')
      
      const hashedPassword = bcrypt.hashSync(password,10)
      const sql = 'insert into userSchema set ?'
      db.query(sql,{username:username,password:hashedPassword,email:email},(err,result)=>{
        if(err) return res.cc(err)
        if(result.affectedRows !== 1) return res.json({status:0,msg:"注册失败，请稍后重试"})

        const query_new_info = 'select * from userSchema where username=?'
        db.query(query_new_info,username,(err,result)=>{
          if(err) return res.cc(err)
          res.send({
            status:0,
            msg:'register successfully',
            data:result[0]
          })
        })
      })
    })
  })
};
module.exports.login = (req,res) => {
  console.log("login")
  const {username, password} = req.body;
  const sql = 'select * from userSchema where username=?';

  db.query(sql,username,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length !== 1) return res.cc('No current user')

    const password_copmare = bcrypt.compareSync(password,result[0].password)
    if(!password_copmare) return res.cc('The password has wrong!')

    const user = {...result[0],password:''}
    const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:'10h'})

    res.send({
      status:0,
      messgae:'login successfully',
      user:user,
      token:tokenStr
    })
  })
};