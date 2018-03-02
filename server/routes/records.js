const express = require('express')
const router = express.Router()
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
    insertRecord(req.body).then(res1 => {
        if (res1.result) {
            updateBookStatus(req.body).then(res2 => {
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
                        date: new Date().getTime(),
                        returnDate: ''
                    })
                    record.save((err, data) => {
                        if (err) {
                            reject({ result: false, msg: err })
                        } else {
                            resolve({ result: true, msg: '' })
                        }
                    })
                } else {
                    if (status === 1) {
                        RecordSchema
                            .where({ title, user })
                            .update({ status, date: new Date().getTime(), returnDate: '' }, (err) => {
                                if (err) {
                                    reject({ result: false, msg: err })
                                } else {
                                    resolve({ result: true, msg: '' })
                                }
                            })
                    } else {
                        RecordSchema
                            .where({ title, user })
                            .update({ status, returnDate: new Date().getTime() }, (err) => {
                                if (err) {
                                    reject({ result: false, msg: err })
                                } else {
                                    resolve({ result: true, msg: '' })
                                }
                            })
                    }
                }
            }
        })
    })
}
function updateBookStatus(body) {
    const { title, status } = body
    let options = {}
    // 借书时，书籍的借阅次数才增加 1
    if (status === 1) {
        options = {
            status: 2,
            $inc: { borrowCount: 1 }
        }
    } else {
        options = {
            status: 1
        }
    }
    return new Promise((resolve, reject) => {
        BookSchema
            .where({ title })
            .update(options, (err, data) => {
                if (err) {
                    reject({ result: false, msg: err })
                } else {
                    resolve({ result: true, msg: '' })
                }
            })
    })
}

// 借阅记录列表
router.get('/list', (req, res) => {
    const { title, status } = req.query
    const filter = {}
    if (title) {
        filter.title = title
    }
    if (status && status !== '0') {
        filter.status = Number(status)
    }
    RecordSchema
        .find(filter)
        .sort({ date: 'asc' })
        .exec((err, data) => {
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
