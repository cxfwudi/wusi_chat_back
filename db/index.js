const mysql = require('mysql')

const db = mysql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'111111',
  database:'wusi_chat',
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
})

module.exports = db