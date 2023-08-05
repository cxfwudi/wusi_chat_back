const db = require('../db/index')

//messageschema
module.exports.addMessage = (req,res) => {
  const {sender,reveiver,content} = req.body;
  console.log(req.body)
  const messageInfo = {...req.body}
  const sql = `insert into messageschema set ?`
  db.query(sql,messageInfo,(err,result)=>{
    if(err) {
      console.log(err)
      return res.cc("can't insert to database(database error)")
    }
    if(result.affectedRows !== 1) return res.cc("can't insert to database(sql error)")
    res.send({
      msg:"record had save to database"
    })
  })
}

module.exports.getAllMessage = (req,res) => {
  //按照时间升序
  function dateData(property, bol) { //property是你需要排序传入的key,bol为true时是升序，false为降序
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      if (bol) {
        // 升序
        return Date.parse(value1) - Date.parse(value2);
      } else {
        // 降序
        return Date.parse(value2) - Date.parse(value1)
      }
    }
  }
  
  //转换时间格式
   function formateDate(datetime) {
      function addDateZero(num) {
          return (num < 10 ? "0" + num : num);
      }
      let d = new Date(datetime);
      let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
      return formatdatetime;
    }

  const {sender_id,receiver_id} = req.body;
  const sql = `select * from messageschema where (sender=? and receiver=?) or (receiver=? and sender=?)`
  db.query(sql,[sender_id,receiver_id,sender_id,receiver_id],(err,result)=>{
    if(err) return result.cc("can't find to database(database error)")
    
    const format_messages = result.map(msg=>{
      return {...msg,time:formateDate(msg.time)}
    })
    
    const sort_result = format_messages.sort(dateData("time",true))
    // console.log(sort_result)
    const res_message = sort_result.map((msg)=>{
      return {
        fromSelf:msg.sender === sender_id,
        message:msg.content
      }
    })
    res.send({res_message})
  })
}