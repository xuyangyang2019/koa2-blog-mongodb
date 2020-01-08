const db = require('../mongodb/db')

module.exports = db.defineModel(
    'Comment',
    {
        article_id: String,
        userid: { type: db.ObjectId, ref: 'User', autopopulate: { select: '_id email username' } },
        content: String
        //     creat_date: String,
        //     is_delete: Number,
        //     timestamp: Number
    },
    'mongoose-autopopulate'
)
