const express = require('express')
//导出路由
const router = express.Router()
//挂载路由
//导入路由模块
const userInfo =require('../router_handler/userInfo')
// 导入需要验证规则中间件
const expressJoin = require('@escook/express-joi')
//导入需要验证规则中间件
const { user_schema, update_password_schema } = require('../schema/user')
//获取用户基本信息路由
router.get('/userInfo',userInfo.getUserInfo)
//定义用户信息更新模块
router.post('/userInfo',expressJoin(user_schema), userInfo.postUserInfoRenew)
//重置密码路由
router.post('/updatepwd',expressJoin(update_password_schema), userInfo.updatePassword)
module.exports = router