const model = require('../mongodb/model')
const Article = model.Article

module.exports = {
    /**
     * 获取文章列表
     */
    getList: async ctx => {
        const { by, id, key } = ctx.query
        let { limit, page } = ctx.query
        // 页
        page = parseInt(page, 10)
        // number/page
        limit = parseInt(limit, 10)
        // 默认第一页 10条数据
        if (!page) page = 1
        if (!limit) limit = 10

        const data = {
                is_delete: 0
            },
            skip = (page - 1) * limit
        if (id) {
            data.category = id
        }
        if (key) {
            const reg = new RegExp(key, 'i')
            data.title = { $regex: reg }
        }
        let sort = '-update_date'
        if (by) {
            sort = '-' + by
        }

        try {
            const [list, total] = await Promise.all([
                Article.find(data)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                Article.countDocumentsAsync(data)
            ])
            const totalPage = Math.ceil(total / limit)
            const user_id = ctx.cookies.get('userid') || ctx.header['userid']
            const tmpData = {
                total,
                hasNext: totalPage > page ? 1 : 0,
                hasPrev: page > 1
            }
            if (user_id) {
                const lists = list.map(item => {
                    item.content = item.content.substring(0, 500) + '...'
                    item._doc.like_status = item.likes.indexOf(user_id) > -1
                    item.likes = []
                    return item
                })
                tmpData.list = lists
                ctx.success(tmpData)
            } else {
                const lists = list.map(item => {
                    item.content = item.content.substring(0, 500) + '...'
                    item._doc.like_status = false
                    item.likes = []
                    return item
                })
                tmpData.list = lists
                ctx.success(tmpData)
            }
        } catch (err) {
            ctx.error(null, err.toString())
        }
        // return tmpData

        // Article.find({}).then(r => {
        //     console.log(r)
        // })

        // const articles = await Article.find({})
        //     .limit(10)
        //     .sort({ update_date: -1 })

        // return articles
    },
    /**
     * 前台浏览时, 获取单篇文章
     */
    getItem: async ctx => {
        const _id = ctx.query.id
        const user_id = ctx.cookies.get('userid') || ctx.header['userid']
        if (!_id) {
            ctx.error(null, '参数错误')
            return
        }
        try {
            const [article] = await Promise.all([
                Article.findOneAsync({ _id, is_delete: 0 }),
                Article.updateOneAsync({ _id }, { $inc: { visit: 1 } })
            ])
            if (!article) {
                ctx.error(null, '没有找到该文章')
            } else {
                if (user_id) article._doc.like_status = article.likes.indexOf(user_id) > -1
                else article._doc.like_status = false
                article.likes = []
                ctx.success(article)
            }
        } catch (err) {
            ctx.error(null, err.toString())
        }
    },
    /**
     * 获取热门文章
     */
    getTrending: async ctx => {
        const limit = 5
        const data = { is_delete: 0 }
        try {
            const result = await Article.find(data)
                .sort('-visit')
                .limit(limit)
                .exec()
            console.log(result)
            ctx.success({
                list: result
            })
        } catch (err) {
            ctx.error(null, err.toString())
        }
        // return result
    }
}
