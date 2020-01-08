const db = require('../mongodb/db')

module.exports = db.defineModel('User', {
    username: String,
    email: String,
    password: String,
    wx_avatar: String,
    wx_signature: String
})
