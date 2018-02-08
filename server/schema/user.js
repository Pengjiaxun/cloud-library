const mongoose = require('../db')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    pwd: String
})

module.exports = mongoose.model('User', UserSchema)
