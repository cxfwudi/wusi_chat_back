const express = require("express")
const cors = require("cors")
const userRoutes = require("./routes/userRoutes")
const userAvatRoutes = require("./routes/userAvatRoutes")
const userInfoRoutes = require("./routes/userInfoRoute")
const messagesRoutes = require("./routes/messagesRoutes")
const parser = require('body-parser')
const app = express()
const socker = require("socket.io")
require("dotenv").config();

app.use(cors());
app.use(parser.json());

//定义中间件，封装res.send()功能
app.use((req,res,next)=>{
  res.cc = function(err,status = 1){
    res.send({
      status,
      msg:err instanceof Error ? err.message : err
    })
  }
  next()
})

const expressJWT = require('express-jwt')
const config = require('./config')
//判断jwt
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api\/auth/]}))

app.use("/api/auth",userRoutes)
app.use("/api/my",userAvatRoutes)
app.use("/api/info",userInfoRoutes)
app.use("/api/messages",messagesRoutes)

//全局错误中间件
app.use((err,req,res,next) => {
  // console.log(err)
  if(err.name === 'UnauthorizedError') return res.cc('Authentication failure');
})

const server = app.listen(process.env.PORT,()=>{
  console.log(`Server Started on Port ${process.env.PORT}`)
})
// console.log(server);
const io = socker(server,{
  cors:{
    origin:"http://localhost:3000",
  }
});
//map用于存储socket（1对1）
global.onlineUsers = new Map();
io.on("connection",(socket)=>{
  global.chatSocket = socket;
  socket.on("add-user",(userId) => {
    // console.log("hahhahahah")
    // console.log("add-user",socket)
    onlineUsers.set(userId,socket.id)
  })
  socket.on("send-msg",(data)=>{
    // console.log("socket")
    // console.log(data)
    const sendUserSocket = onlineUsers.get(data.to)
    if(sendUserSocket){
      socket.to(sendUserSocket).emit("msg-receive",data.message)
    }
  })
})