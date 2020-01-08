// 创建app实例
// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa')

// 解析body 的中间件，用以接受post 过来的表单，json数据，或者上传的文件流
// 解析原始request请求，然后，把解析后的参数，绑定到ctx.request.body中
const bodyParser = require('koa-bodyparser')()

const path = require('path')

// ===========================================================================

// 处理URL的middleware，它根据不同的URL调用不同的处理函数
const router = require('koa-router')()

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

// ===========================================================================

// 判断当前环境是否是production环境 production development
const isProduction = process.argv[2] === '--prod'

// 创建一个Koa对象表示web app本身:
const app = new Koa()

// 第一个middleware是记录URL以及页面执行时间：
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
    const start = new Date().getTime()
    await next()
    const execTime = new Date().getTime() - start
    console.log(`页面执行事件${execTime}`)
    ctx.response.set('X-Response-Time', `${execTime}ms`)
})

// 解析静态文件
// 测试环境下 解析静态文件；线上用ngix反向代理
if (!isProduction) {
    // console.log('测试环境，使用static-files')
    // console.log(path.join(__dirname, 'public'))
    const staticFiles = require('./server/middleware/static-files')
    app.use(staticFiles('/static/', path.join(__dirname, 'public')))
    // app.use(convert(require('koa-static')(path.join(__dirname, 'public'))))
}

// parse user from cookie:
// app.use(async (ctx, next) => {
//     console.log('parse user from cookie')
//     ctx.state.user = parseUser(ctx.cookies.get('name') || '')
//     await next()
// })

// parse request body:
app.use(bodyParser)
// app.use(convert(bodyParser))

app.use(convert(json()))
app.use(convert(logger()))

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
