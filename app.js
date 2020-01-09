// 创建app实例
// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa')

// Template rendering middleware for koa@2.
const views = require('koa-views')

// koa-logger提供了输出请求日志的功能，包括请求的url、状态码、响应时间、响应体大小等信息
const logger = require('koa-logger')

// 处理URL的middleware，它根据不同的URL调用不同的处理函数
const router = require('koa-router')()

// 解析body 的中间件，用以接受post 过来的表单，json数据，或者上传的文件流
// 把koa2上下文的formData数据解析到ctx.request.body的中间件
const bodyParser = require('koa-bodyparser')()

const path = require('path')

// 是一个 JavaScript 日期处理类库,用于解析、检验、操作、以及显示日期
const moment = require('moment')

// ===========================================================================

// JSON pretty-printed response middleware. Also converts node object streams to binary.
// const json = require('koa-json')

// 对于比较老的使用Generate函数的koa中间件(< koa2)，
// 官方提供了一个灵活的工具可以将他们转为基于Promise的中间件供Koa2使用，
// 同样也可以将新的基于Promise的中间件转为旧式的Generate中间件
// const convert = require('koa-convert')

// const proxy = require('./server/middlewares/proxy')

// 引入 mongoose 相关模型
// require('./server/models/Admin')
// require('./server/models/Article')
// require('./server/models/Category')
// require('./server/models/Comment')
// require('./server/models/User')
// require('./server/models/Shihua')
require('./server/mongodb/model')

const index = require('./server/routes/index')

// ===========================================================================

// 判断当前环境是否是production环境 production development
const isProduction = process.argv[2] === '--prod'

// 创建一个Koa对象表示web app本身:
const app = new Koa()

// 第一个middleware是记录URL以及页面执行时间：
// app.use(async (ctx, next) => {
//     console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
//     const start = new Date().getTime()
//     await next()
//     const execTime = new Date().getTime() - start
//     console.log(`页面执行时间${execTime}`)
//     ctx.response.set('X-Response-Time', `${execTime}ms`)
// })
app.use(
    logger(str => {
        console.log(moment().format('YYYY-MM-DD HH:mm:ss') + str)
    })
)

// 测试环境下 解析静态文件；线上用ngix反向代理
if (!isProduction) {
    // const staticFiles = require('./server/middleware/static-files')
    // app.use(staticFiles('/static/', path.join(__dirname, 'public')))
    app.use(require('koa-static')(path.join(__dirname, 'public')))
}

// parse user from cookie:
// app.use(async (ctx, next) => {
//     console.log('parse user from cookie')
//     ctx.state.user = parseUser(ctx.cookies.get('name') || '')
//     await next()
// })

// 把koa2上下文的formData数据解析到ctx.request.body
app.use(bodyParser)

// app.use(convert(json()))

// 模板渲染
app.use(views(path.join(__dirname, 'views'), { extension: 'ejs' }))

// 返回封装
app.use(require('./server/middlewares/return'))

// app.use(proxy(app))

// 路由中间件
app.use(index.routes(), router.allowedMethods())

// 服务器报错
app.on('error', function(err, ctx) {
    console.error('server error', err, ctx)
})

module.exports = app
