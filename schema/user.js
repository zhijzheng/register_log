// 引入校验包
const Joi = require('joi');
const joi = require('joi')

//定义用户名和密码的规则

const userName = joi.string().alphanum().min(1).max(10).required()

const password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
 // 定义id, nickname,email 的验证规则
 const id = joi.number().integer().min(1).required();
 const nickeName = joi.string().required();
 const email = joi.string().email().required();
// const userName =  joi.string().alphanum().min(1).max(10).required()
// const password = joi.string().pattern(/^[\S]{6,12}$/).required()

//暴露验证表单对象

exports.reg_log = {
    body: {
    userName,
    password
   } 
}

exports.user_schema = {
    body: {
        id,
        nickeName,
        email
    }
}
exports.update_password_schema= {
    body: {
        oldPwd: password,
        newPwd: Joi.not(joi.ref('oldPwd')).concat(password),
    }
}