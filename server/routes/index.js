const router = require('koa-router')()

// 后端路由
const backend = require('./backend')
// 前端路由
const frontend = require('./frontend')

// 管理员
const backendUser = require('../api/backend-user')

// 添加管理员
router.get('/backend', async ctx => {
    ctx.state = {
        title: '后台登录',
        message: ''
    }
    await ctx.render('admin-add', {})
})
//
router.post('/backend', backendUser.insert)

// 嵌套路由
router.use('/api/backend', backend.routes(), backend.allowedMethods())
router.use('/api/frontend', frontend.routes(), frontend.allowedMethods())

// 其他路由返回404
router.get('*', async ctx => {
    ctx.body = '404 Not Found'
})

module.exports = router
