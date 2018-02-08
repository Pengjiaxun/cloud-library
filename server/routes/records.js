const express = require('express')
const router = express.Router()
const RecordSchema = require('../schema/record')
const BookSchema = require('../schema/book')

// 设置跨域
router.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

    if (req.method === 'OPTIONS') {
        res.sendStatus(200) // 让options请求快速返回
    } else {
        next()
    }
})

// 增加借阅记录
router.post('/add', (req, res) => {
    const { title, user, status } = req.body
    if (title && user && status) {
        const record = new RecordSchema({
            title,
            user,
            date: new Date().getTime(),
            status
        })
        record.save((err, data) => {
            if (err) {
                res.json({
                    result: false,
                    msg: err
                })
            } else {
                BookSchema.where({ title }).update({ status }, () => {
                    res.json({
                        result: true,
                        msg: status === 1 ? '借阅成功' : '还书成功'
                    })
                })
            }
        })
    } else {
        res.json({
            result: false,
            msg: '借阅失败'
        })
    }
})

// 借阅记录列表
router.get('/list', (req, res) => {
    RecordSchema.find({}, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            res.json({
                result: true,
                data: data
            })
        }
    })
})

module.exports = router
