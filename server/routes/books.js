const express = require('express')
const router = express.Router()
const BookSchema = require('../schema/book')

// 设置跨域
router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

    if (req.method === 'OPTIONS') {
        res.sendStatus(200) // 让options请求快速返回
    } else {
        next()
    }
})

// 录入图书信息
router.post('/record', (req, res) => {
    const { title } = req.body
    BookSchema.find({ title }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            // 录入的图书不存在，则录入
            if (data.length === 0) {
                insert(req.body)
                res.json({
                    result: true
                })
            } else {
                res.json({
                    result: false,
                    msg: '该图书已经在书架上啦'
                })
            }
        }
    })
})
function insert({ title, image, rating, author, author_intro, pubdate, pages, summary = '无', publisher }) {
    let book = new BookSchema({
        title,
        image,
        rating: rating.average || '无',
        author: author[0] || '未知',
        author_intro,
        pages,
        summary,
        pubdate,
        publisher,
        record_date: new Date().getTime(),
        status: 1
    })
    book.save((err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log('record successfully')
        }
    })
}

// 图书下架
router.post('/offshelf', (req, res) => {
    const { title } = req.body
    BookSchema.remove({ title }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            res.json({
                result: true,
                msg: '下架成功'
            })
        }
    })
})

// 获取图书信息
router.get('/list', (req, res) => {
    const { status, title } = req.query
    const filter = {}
    if (status !== '0') {
        filter.status = Number(status)
    }
    if (title) {
        filter.title = title
    }
    if (status !== '0') {
        BookSchema
            .find()
            .where(filter)
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
    } else {
        BookSchema.find(filter, (err, data) => {
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
    }
})

module.exports = router
