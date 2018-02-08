const mongoose = require('mongoose')

// 数据库地址
const DB_URL = 'mongodb://localhost:27017/book'

mongoose.connect(DB_URL)
console.log('db connect success')

mongoose.connection.on('disconnected', function () {
    console.log('db connect wrong')
})

module.exports = mongoose
