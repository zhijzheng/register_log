//导入数据库模块
const db = require('../db/index')
//bcryptjs用于存入铭文密码加密
const bycry = require('bcryptjs')
// 导入生成Token包
const jwt = require('jsonwebtoken')
// 导入全局配置文件
const config = require('../config')
//注册新用户
exports.regUsr = (req, res)=>{
   //获取客户端提交到服务的用户信息
   const userInfo = req.body
   //对表单数据进行验证
   if(!userInfo.userName || !userInfo.password){
    return res.send({
        status: 1, 
        massage: '用户名或密码不合法'
    })
   }
   //定义数据库sql,查询数据库是否包含改数据
   const sqlStr = 'select * from ev_users where userName=?'
   db.query(sqlStr,userInfo.userName,(err, results)=>{
    // 执行myq语句失败
    if(err){
        // return res.send({
        //     status: 1, 
        //     message: err.message
        // })
        return res.cc(err)
    }
    // 数据执行成功，判断是否在用户
    if(results.length > 0){
        // return res.send({
        //     status: 1, 
        //     message: '用户已占用,请更换用户名'
        // })
        return res.cc('用户已占用,请更换用户名')
    }
     //调用bcrypt用于密码加密
  userInfo.password = bycry.hashSync(userInfo.password,10)
    //添加新用户
    const sqlAddStr= 'insert into ev_users set ?'
    //添加新用户
    db.query(sqlAddStr, {userName:userInfo.userName, password:userInfo.password} ,(err, results)=>{
     // 执行myq语句失败
     if(err) {
        // console.log(err, 'err')
        // return res.send({
        //     status: 1, 
        //     message: err.message
        // })
        return res.cc(err)
    }
    //数据插入成功返回是对象，可以通过affectedRows判断是否成功
    if(results.affectedRows !==1){ return res.cc('用户注册失败,请稍后再试')}
        // return res.send({
        //     status: 1, 
        //     message: '用户注册失败,请稍后再试'
        // })
        res.cc('注册成功',0)
})
   })
   
 
//校验成功
//    res.send({
//     status: 0,
//     massage: '200'
//    })
}
//登录
exports.login = (req, res)=>{
   //接收表单数据
   const userInfo= req.body
   //定义插查询数据
   const sqlSelect = 'select * from ev_users where userName=?'
   db.query(sqlSelect,userInfo.userName,(err, results)=>{
    if(err) return res.cc(err)
    //执行失败语句
    if(results.length !== 1) return res.cc('登录失败');

   // TODO: 判断密码是否正确
    const compareResult= bycry.compareSync(userInfo.password, results[0].password)
   if(!compareResult) return res.cc('登录失败!')
   const user= {...results[0],  password:'', usr_pic:''}
   //对用户信息进行加密，生成Token字符串,并设置有效期
   const tokenStr = jwt.sign(user,config.jwtSereKey,{expiresIn:config.expiresIn})
   // 调用res.sen()蒋Token响应客户端
   res.send({
    status:  0,
    message: '登录成功',
    token: 'Bearer ' +tokenStr
   })
    // res.cc('登录成功', 0)
   })
}
//表名ev_users，字段
// CREATE TABLE `my_db_node`.`ev_users` (
//     `id` INT NOT NULL AUTO_INCREMENT,
//     `userName` VARCHAR(255) NOT NULL,
//     `password` VARCHAR(45) NOT NULL,
//     `nickeName` VARCHAR(45) NULL,
//     `email` VARCHAR(45) NOT NULL,
//     `user_pic` TEXT NULL,
//     PRIMARY KEY (`id`),
//     UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
//   COMMENT = '用户表';
  