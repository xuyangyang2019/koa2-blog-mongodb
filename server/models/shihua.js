const db = require('../mongodb/db')

module.exports = db.defineModel('Shihua', {
    user_id: String,
    img_id: String,
    name: String,
    img: String,
    result: String
    //     creat_date: String,
    //     is_delete: Number,
    //     timestamp: Number
})
