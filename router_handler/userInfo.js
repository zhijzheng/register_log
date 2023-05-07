//导入数据模块
const db = require('../db/index')
//导入用户密码处理模块
const bcrypt = require('bcryptjs')
//用户初始化信息模块
exports.getUserInfo = (req, res)=>{
    const dbSelect = 'select userName,nickeName,email,user_pic from ev_users where id=? '
    console.log(req.auth.id, 'userid')
    db.query(dbSelect, req.auth.id,(err, results)=>{
        //执行sql语句失败
        if(err)return res.cc(err)
        //执行SQL语句成功
        if(results.length !==1)return res.cc('获取用户信息失败')
        //获取用户信息成功
        res.send({
            status:0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })
}
//更新用户信息的处理函数
exports.postUserInfoRenew = (req, res)=>{
  // 定义待执行函数是否成功
  const sql ='update ev_users set ? where id=?'
  //调取db.query执行Sql语句，并传递参数
  db.query(sql, [req.body, req.body.id],(err, results)=>{
    //执行sql失败
    if (err) return res.cc(err)
    //执行sql成功单不等于1
    if(results.affectedRows !== 1) return res.cc('用户信息更新失败')
    //成功
    res.cc('更新成功', 0)
  })
}
//重置密码处理函数
exports.updatePassword = (req, res)=>{
    console.log(req.auth.id, '111111')
    // 根据id查询用户信息
    const sql= 'select * from ev_users where id=?'
    //执行sql语句
    db.query(sql,req.auth.id, (err,results)=>{
        //执行sql失败
        if(err) return res.cc(err)
        //判断结果是否存在
        if(results.length !==1 ) return res.cc('用户不存在')

        //判断旧密码是否正确
       const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
       if (!compareResult) return res.cc('旧密码错误！')
       //定义更新密码的SQL语句
       const sql = 'update ev_users set password=? where id=?'
       //对新密码加密处理
       const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
       db.query(sql,[newPwd, req.auth.id],(err, results)=>{
        // 执行sql失败
        if(err) return res.cc(err)
        // 判断影响的行数
        if(results.affectedRows !==1 )return res.cc('密码更新失败')
        // 成功
        res.cc('密码更新成功', 0)
       })
    })
}
