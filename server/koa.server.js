/**
 * koa2 server 入口
 */


const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

// 数据压缩
const koaCompress = require('koa-compress')()
// 日志中间件
const loggerMiddleware = require('./middlewares/loggerMiddleWare')()
// 解析静态文件
const staticMiddleWare = require('./middlewares/staticMiddleWare')
// 错误处理
const errorMiddleware = require('./middlewares/errorMiddleWare')
// 代理
// const proxyMiddleWare = require('./middlewares/proxyMiddleWare')
// 服务端渲染
const vueKoaSSR = require('./vue.koa.ssr')

const currentIP = require('ip').address()
const appConfig = require('./../app.config')
const uri = `http://${currentIP}:${appConfig.appPort}`

// koa server
const app = new Koa()
app.use(loggerMiddleware)
app.use(koaCompress)
app.use(errorMiddleware)
app.use(staticMiddleWare('./dist'))
app.use(bodyParser())

// vue ssr处理
// vueKoaSSR(app, uri)

// http代理中间件
// app.use(proxyMiddleWare())

// let home = new Router()
// // 子路由1
// home.get('/', async (ctx) => {
//   let html = `
//     <ul>
//       <li><a href="/page/helloworld">/page/helloworld</a></li>
//       <li><a href="/page/404">/page/404</a></li>
//     </ul>
//   `
//   ctx.body = html
// })
// // 子路由2
// let page = new Router()
// page.get('/404', async (ctx) => {
//   ctx.body = '404 page!'
// }).get('/helloworld', async (ctx) => {
//   ctx.body = 'helloworld page!'
// })
// // 装载所有子路由
// let router = new Router()
// router.use('/', home.routes(), home.allowedMethods())
// router.use('/page', page.routes(), page.allowedMethods())
// // 加载路由中间件
// app.use(router.routes()).use(router.allowedMethods())

// 错误处理
app.on('error', (err) => {
  console.error('Server error: \n%s\n%s ', err.stack || '')
})

app.listen(appConfig.appPort)
console.log(`\n> Starting server... ${uri} \n`)