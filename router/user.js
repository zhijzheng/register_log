const express = require('express')
//导出路由
const router = express.Router()
//用户路由函数
const usrHandler =require('../router_handler/user')
//引入表单中间键
const expressJoi = require('@escook/express-joi')
//导入验证规则包
const { reg_log} = require('../schema/user')

//注册新用户模块
router.post('/regUsr', expressJoi(reg_log) ,usrHandler.regUsr )

//登录用户模块
router.post('/login', usrHandler.login )
//验证规则模块

//共享路由模块
module.exports = router

