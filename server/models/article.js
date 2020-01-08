const db = require('../mongodb/db')

module.exports = db.defineModel('Article', {
    title: String,
    content: String,
    html: String,
    category: String,
    category_name: String,
    visit: Number,
    like: Number,
    comment_count: Number,
    likes: [String]
})
