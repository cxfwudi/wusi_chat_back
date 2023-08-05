const db = require('../db/index')
const config = require("../config")

module.exports.setAvatar = (req,res)=>{
  console.log("111")
  const userId = req.params.id;
  
  const avatarImage = req.body.image;
  // console.log(avatarImage)
  const sql_update_avat = 'update userSchema set isAvatarImageSet =? ,avatarImage= ? where id=?'
  db.query(sql_update_avat,[1,avatarImage,userId],(err,result)=>{
    if(err) return res.cc(err)
    if(result.affectedRows !== 1){
      console.log("没改变")
      return res.cc('Set failed,Please try again')
    } else{
      res.send({
        isSet:1,
        image:avatarImage
      })
    }


  })
}