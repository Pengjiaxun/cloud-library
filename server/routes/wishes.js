const express = require('express')
const router = express.Router()
const WishSchema = require('../schema/wish')

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

// 后台愿望列表
router.get('/list', (req, res) => {
    WishSchema
        .aggregate([{
            $group: {
                _id: '$title',
                account: { $sum: 1 }
            }
        }])
        .exec((err, data) => {
            console.log(err, data)
            if (err) {
                res.json({
                    result: false,
                    msg: err
                })
            } else {
                res.json({
                    result: true,
                    msg: '查询成功',
                    data: data
                })
            }
        })
})

// 用户愿望列表
router.get('/mine', (req, res) => {
    const { user } = req.query
    WishSchema.find({ user }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            res.json({
                result: true,
                msg: '查询成功',
                data: data
            })
        }
    })
})

// 加入愿望清单
router.post('/add', (req, res) => {
    const { title, user } = req.body
    if (title !== '' && user !== '') {
        const wish = new WishSchema({
            title,
            user
        })
        WishSchema.find({ title, user }, (err, data) => {
            if (err) {
                res.json({
                    result: false,
                    msg: err
                })
            } else {
                if (data.length !== 0) {
                    res.json({
                        result: false,
                        msg: '已加入愿望清单'
                    })
                } else {
                    wish.save((err, data) => {
                        if (err) {
                            res.json({
                                result: false,
                                msg: err
                            })
                        } else {
                            res.json({
                                result: true,
                                msg: '已加入愿望清单'
                            })
                        }
                    })
                }
            }
        })
    } else {
        res.json({
            result: false,
            msg: '用户名或书名不能为空'
        })
    }
})

// 移除愿望清单
router.post('/del', (req, res) => {
    console.log(req.body)
    const { title, user } = req.body
    WishSchema.remove({ title, user }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            res.json({
                result: true,
                msg: '删除成功'
            })
        }
    })
})

module.exports = router
