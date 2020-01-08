// const mongoose = require('../mongoose')
// const Schema = mongoose.Schema
// const Promise = require('bluebird')
const db = require('../mongodb/db')

module.exports = db.defineModel('Admin', {
    username: String,
    email: String,
    password: String
})
