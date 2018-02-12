const mongoose = require('../db')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    title: String, // 图书名称
    image: String, // 封面
    rating: Number, // 评分
    author: String, // 作者
    author_intro: String, // 作者简介
    pages: String, // 页数
    summary: String, // 图书简介
    pubdate: String, // 出版时间
    publisher: String, // 出版社
    record_date: String, // 上架时间
    borrowCount: Number, // 被借阅次数
    status: Number // 0 = 所有，1 = 在架，2 = 借出
})

module.exports = mongoose.model('Book', BookSchema)
