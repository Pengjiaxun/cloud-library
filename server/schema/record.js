const mongoose = require('../db')
const Schema = mongoose.Schema

const RecordSchema = new Schema({
    title: String,
    user: String,
    image: String,
    status: Number, // 1 = 在借， 2 = 已归还
    date: String
})

module.exports = mongoose.model('Record', RecordSchema)
