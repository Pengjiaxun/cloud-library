const mongoose = require('../db')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    title: String,
    image: String,
    rating: Number,
    author: String,
    author_intro: String,
    pages: Number,
    summary: String,
    pubdate: Date,
    publisher: String,
    record_date: String,
    status: Number // 0 = 所有，1 = 在架，2 = 借出
})

module.exports = mongoose.model('Book', BookSchema)
