const mongoose = require('../db')
const Schema = mongoose.Schema

const WishSchema = new Schema({
    title: String,
    user: String
})

module.exports = mongoose.model('Wish', WishSchema)
