const express = require('express')
const router = express.Router()
const LogSchema = require('../schema/log')
const BookSchema = require('../schema/book')
const RecordSchema = require('../schema/record')

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
    insertLog(req.body).then(res1 => {
        if (res1.result) {
            insertRecord(req.body).then(res2 => {
                if (res2.result) {
                    res.json({
                        result: true,
                        msg: '借阅成功'
                    })
                } else {
                    res.json({
                        result: false,
                        msg: res2.msg
                    })
                }
            }).catch(err => {
                res.json({
                    result: false,
                    msg: err
                })
            })
        } else {
            res.json({
                result: false,
                msg: res1.msg
            })
        }
    }).catch(err => {
        res.json({
            result: false,
            msg: err
        })
    })
})
function insertRecord(body) {
    const { title, user, status, image } = body
    return new Promise((resolve, reject) => {
        RecordSchema.find({ title, user }, (err, data) => {
            if (err) {
                reject({ result: false, msg: err })
            } else {
                if (data.length === 0) {
                    const record = new RecordSchema({
                        title,
                        user,
                        image,
                        status,
                        date: new Date().getTime()
                    })
                    record.save((err, data) => {
                        if (err) {
                            reject({ result: false, msg: err })
                        } else {
                            resolve({ result: true, msg: '' })
                        }
                    })
                } else {
                    RecordSchema
                        .where({ title, user })
                        .update({ status }, () => {
                            resolve({ result: true, msg: '' })
                        })
                }
            }
        })
    })
}
function insertLog(body) {
    const { title, user, status, image } = body
    return new Promise((resolve, reject) => {
        const log = new LogSchema({
            title,
            user,
            image,
            date: new Date().getTime(),
            status
        })
        log.save((err, data) => {
            if (err) {
                reject({ result: false, msg: err })
            } else {
                BookSchema
                    .where({ title })
                    .update({ status: status === 1 ? 2 : 1 }, () => {
                        resolve({ result: true, msg: '' })
                    })
            }
        })
    })
}

// 借阅记录列表
router.get('/list', (req, res) => {
    const filter = {}
    if (req.query.user) {
        filter.user = req.query.user
        filter.status = 1
    }
    LogSchema.find(filter, (err, data) => {
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
