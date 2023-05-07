const express= require('express')
//创建服务对象
const app = express()
//配置跨域
const cors = require('cors')
//注册全局可用
app.use(cors())
const joi = require('@hapi/joi')
//配置解析表单数据中间键,只解析www-from-urlencoded
app.use(express.urlencoded({extended: false}))
// 一定在路由之前封装res.cc函数
app.use((req, res, next)=>{
    // status等于1时默认失败
    res.cc = (err, status =1)=>{
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
//路由之前配置Token的中间件
const { expressjwt:jwt } =require('express-jwt')
// 导入config文件
const config = require('./config')
//注册解密全局中间键,设定已什么开头部需要机密
app.use(jwt({secret: config.jwtSereKey, algorithms: ['HS256']}).unless({path: [/^\/api/]}))
//导出路由模块
const userRouter = require('./router/user')
//注册全局路由
app.use('/api', userRouter)
//导入用户进本信息模块
const userInfo = require('./router/userInfo')
app.use('/my',userInfo)
// 定义错误级别中间键
app.use((err, req, res, next)=>{
    //验证失败错误
    if(err instanceof joi.ValidationError) return res.cc(err)
    //捕获错误登录token校验身份认证失败错误error
    if(err.name === 'UnauthorizedError') return res.cc('Token身份认证失败')
    //未知错误
    res.cc(err)
})
//启动服务
app.listen(3007,()=>{
    console.log('http://127.0.0.1:3007');
})