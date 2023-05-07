const mysql = require('mysql')
//链接数据库
const db = mysql.createPool({
    host: '127.0.0.1',//数据库存放地址
    user: 'root', //登录数据库账号
    password: 'admin123', //登录密码
    database: 'my_db_node' //操作数据
})
//向外共享db
module.exports = db 
