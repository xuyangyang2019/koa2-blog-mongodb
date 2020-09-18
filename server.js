const fs = require('fs')
const path = require('path')
// 导入koa
const Koa = require('koa')
const koaCompress = require('koa-compress')()
const loggerMiddleware = require('./server/middlewares/loggerMiddleWare')()
const errorMiddleware = require('./server/middlewares/errorMiddleware')
const staticMiddleWare = require('./server/middlewares/staticMiddleWare')

// 解析POST请求
const bodyParser = require('koa-bodyparser');
// 路由中间件
const KoaRouter = require('koa-router')
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

// 打印请求与响应 日志
app.use(loggerMiddleware)

// 压缩响应
app.use(koaCompress)

// 错误处理
app.use(errorMiddleware)

// 生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。
// 而在开发环境下，我们希望koa能顺带处理静态文件，否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。
// 静态资源中间件
if (process.env.NODE_ENV === 'development') {
    app.use(staticMiddleWare('./dist'))
    // 原生实现
    // let staticFiles = require('./middlewares/static-files');
    // app.use(staticFiles('/static/', __dirname + '/static'));
    // app.use(staticFiles('/dist/', __dirname + '/dist'));
}

// vue ssr处理
// vueKoaSSR(app, uri)

// 使用ctx.body解析中间件
app.use(bodyParser())

router.get('*', render)
app.use(router.routes()).use(router.allowedMethods())
app.listen(8089)

console.log('start server: localhost:8089')