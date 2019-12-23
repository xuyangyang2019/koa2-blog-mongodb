const path = require('path')
const Koa = require('koa')

// 处理URL的middleware，它根据不同的URL调用不同的处理函数
const router = require('koa-router')()
// 解析body 的中间件，用以接受post 过来的表单，json数据，或者上传的文件流
// 解析原始request请求，然后，把解析后的参数，绑定到ctx.request.body中
const bodyparser = require('koa-bodyparser')()
// JSON pretty-printed response middleware. Also converts node object streams to binary.
const json = require('koa-json')
// Template rendering middleware for koa@2.
const views = require('koa-views')
// Development style logger middleware for koa
const logger = require('koa-logger')
// Convert koa legacy ( 0.x & 1.x ) generator middleware to modern promise middleware ( 2.x )
// It could also convert modern promise middleware back to legacy generator middleware
// ( useful to help modern middleware support koa 0.x or 1.x )
const convert = require('koa-convert')

//
const proxy = require('./server/middlewares/proxy')

// 引入 mongoose 相关模型
require('./server/models/admin')
require('./server/models/article')
require('./server/models/category')
require('./server/models/comment')
require('./server/models/user')
require('./server/models/shihua')

const index = require('./server/routes/index')

const app = new Koa()

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
    await next()
})

// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
// 解析静态文件
app.use(convert(require('koa-static')(path.join(__dirname, 'public'))))
// 模板渲染
app.use(views(path.join(__dirname, 'views'), { extension: 'ejs' }))
// 返回封装
app.use(require('./server/middlewares/return'))

app.use(proxy(app))
// 路由中间件
app.use(index.routes(), router.allowedMethods())
// 服务器报错
app.on('error', function(err, ctx) {
    console.error('server error', err, ctx)
})

module.exports = app
