const db = require('../mongodb/db')

module.exports = db.defineModel('Category', {
    cate_name: String,
    cate_order: String,
    cate_num: Number
})
