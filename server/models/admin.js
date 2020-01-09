const db = require('../mongodb/db')

module.exports = db.defineModel('Admin', {
    username: String,
    email: String,
    password: String
})
