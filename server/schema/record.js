const mongoose = require('../db')
const Schema = mongoose.Schema

const RecordSchema = new Schema({
    title: String,
    user: String,
    date: String,
    status: Number // 1 = 借出， 2 = 已归还
})

module.exports = mongoose.model('Record', RecordSchema)
