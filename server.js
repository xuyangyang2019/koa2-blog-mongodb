const fs = require('fs')
const path = require('path')
// 导入koa
const Koa = require('koa')
// 日志中间件
const Koa_Logger = require('koa-logger')
const Moment = require("moment");
const logger = Koa_Logger((str) => {
    console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str)
})
// 路由中间件
const KoaRouter = require('koa-router')
const serve = require('koa-static')
const { createBundleRenderer } = require('vue-server-renderer')

const resolve = file => path.resolve(__dirname, file)
const app = new Koa()
const router = new KoaRouter()
const template = fs.readFileSync(resolve('./src/index-template.html'), 'utf-8')

function createRenderer(bundle, options) {
    return createBundleRenderer(
        bundle,
        Object.assign(options, {
            template,
            basedir: resolve('./dist'),
            runInNewContext: false
        })
    )
}

const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const renderer = createRenderer(bundle, {
    clientManifest
})

// 渲染
function render(ctx) {
    ctx.set('Content-Type', 'text/html')
    return new Promise(function (resolve, reject) {
        const handleError = err => {
            if (err && err.code === 404) {
                ctx.state = 404
                ctx.body = "404 | page not found"
            } else {
                ctx.state = 500
                ctx.body = "500 | internal server error"
                console.error(err.stack)
            }
        }

        const context = {
            title: 'vue ssr',
            url: ctx.url
        }

        renderer.renderToString(context, (err, html) => {
            if (err) {
                return handleError(err)
            }
            // console.log(html)
            ctx.body = html
            resolve()
        })
    })
}

app.use(logger)
app.use(serve(__dirname, '/dist'))

router.get('*', render)
app.use(router.routes()).use(router.allowedMethods())
app.listen(8089)

console.log('start server: localhost:3000')