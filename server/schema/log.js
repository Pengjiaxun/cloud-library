const mongoose = require('../db')
const Schema = mongoose.Schema

const LogSchema = new Schema({
    title: String,
    user: String,
    image: String,
    date: String,
    status: Number // 1 = 借出， 2 = 已归还
})

module.exports = mongoose.model('Log', LogSchema)
