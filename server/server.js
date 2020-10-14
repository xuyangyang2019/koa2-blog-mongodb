const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const Router = require('koa-router')
// 日志中间件
const Koa_Logger = require('koa-logger')
const Moment = require("moment")
// 数据压缩
const KoaCompress = require('koa-compress')()
// 解析静态资源
const Koa_Static = require("koa-static")
// 解析POST请求
const bodyParser = require('koa-bodyparser')
// ajax 跨域问题
const jsonp = require('koa-jsonp')
// rest中间件
const rest = require('./middlewares/rest')
// 缓存
const LRU = require('lru-cache')
// ssr
const { createBundleRenderer } = require('vue-server-renderer')
// 开发环境配置
const setUpDevServer = require('../build/setup.dev.server.js')

// 获取本地ip
const currentIP = require('ip').address()
const appConfig = require('../app.config')
const uri = `http://${currentIP}:${appConfig.appPort}`
// 开发环境
const isProd = process.env.NODE_ENV === 'production'
// const resolve = file => path.resolve(__dirname, file)
function resolve(dir) {
    return path.resolve(process.cwd(), dir)
}

// 后端Server 创建app实例
const backendApp = new Koa()
// 添加各种中间件
backendApp.use(Koa_Logger((str) => {
    console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str)
}))
backendApp.use(KoaCompress)
backendApp.use(Koa_Static(resolve('dist'), { maxAge: 30 * 24 * 60 * 60 * 1000, gzip: true }))
backendApp.use(bodyParser())
backendApp.use(rest.restify())
backendApp.use(jsonp())

function createRenderer(bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        runInNewContext: false // 推荐
    }))
}

let renderer

if (isProd) {
    // 生产环境,从打包好的文件夹读取bundle和manifest
    const template = fs.readFileSync(resolve('dist/index.ssr.html'), 'utf-8')
    const serverBundle = require(resolve('dist/vue-ssr-server-bundle.json'))
    const clientManifest = require(resolve('dist/vue-ssr-client-manifest.json'))
    renderer = createRenderer(serverBundle, {
        template: template, // （可选）页面模板
        clientManifest: clientManifest // （可选）客户端构建 manifest
    })
} else {
    // 开发环境,从内存中读取bundle和manifest
    setUpDevServer(backendApp, uri, (bundle, options) => {
        try {
            renderer = createRenderer(bundle, options)
        } catch (e) {
            console.log('\nbundle error', e)
        }
    })
}

const renderData = (ctx, renderer) => {
    const context = {
        url: ctx.url,
        title: 'Vue Koa2 SSR',
        cookies: ctx.request.headers.cookie
    }
    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
            if (err) {
                return reject(err)
            }
            resolve(html)
        })
    })
}

// 路由
backendApp.use(async (ctx, next) => {
    if (!renderer) {
        ctx.type = 'html'
        return ctx.body = 'waiting for compilation... refresh in a moment.';
    }
    // if (Object.keys(proxyConfig).findIndex(vl => ctx.url.startsWith(vl)) > -1) {
    //     return next()
    // }
    let html, status
    try {
        status = 200
        html = await renderData(ctx, renderer)
    } catch (e) {
        console.log('\ne', e)
        if (e.code === 404) {
            status = 404
            html = '404 | Not Found'
        } else {
            status = 500
            html = '500 | Internal Server Error'
        }
    }
    ctx.type = 'html'
    ctx.status = status ? status : ctx.status
    ctx.body = html
})

// const backendRouter = new Router()
// //前端请求
// backendRouter.get(["/", "/home", "/article", "/article/:articleList", "/article/:articleList/:id", "/life",
//     "/life/:id", "/msgBoard", "/search/:searchKey", "/timeLine/:time", "/login_qq"], async (ctx, next) => {
//         const context = { url: ctx.url }
//         // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
//         // 现在我们的服务器与应用程序已经解耦！
//         try {
//             // vuex demo
//             // let html = await new Promise((resolve, reject) => {
//             //     // 这里直接使用 renderToString 的 Promise 模式，返回的 html 字符串没有样式和 __INITIAL_STATE__，原因暂时还没有查到
//             //     // 所以，只能暂时先自己封装一个 Promise，用 renderToString 的 callback 模式
//             //     renderer.renderToString((err, html) => {
//             //         if (err) {
//             //             reject(err)
//             //         } else {
//             //             resolve(html)
//             //         }
//             //     })
//             // })

//             // vuex router demo
//             let html = await renderer.renderToString(context)
//             ctx.type = 'html'
//             ctx.status = 200
//             ctx.body = html

//             // 流式传输
//             // 如果你依赖由组件生命周期钩子函数填充的上下文数据，则不建议使用流式传输模式
//             // const stream = renderer.renderToStream(context)
//             // let html = ''
//             // stream.on('data', data => {
//             //     html += data.toString()
//             // })

//             // stream.on('end', () => {
//             //     // console.log(html) // 渲染完成
//             //     ctx.status = 200
//             //     ctx.type = 'html'
//             //     ctx.body = html
//             // })

//             // stream.on('error', err => {
//             //     // handle error...
//             //     console.log(err)
//             // })

//         } catch (err) {
//             ctx.status = 500
//             ctx.body = '服务器内部错误'
//         }
//     })

// backendRouter.get(["/", "/home", "/article", "/article/:articleList", "/article/:articleList/:id", "/life",
//     "/life/:id", "/msgBoard", "/search/:searchKey", "/timeLine/:time", "/login_qq"], (req, res) => {
//         const context = {
//             title: 'mapBlog',
//             url: req.url
//         }
//         renderer.renderToString(context, (err, html) => {
//             const { title, meta } = context.meta.inject()
//             if (err) {
//                 res.status(500).end('Internal Server Error')
//                 return
//             }
//             html = html.replace(/<title.*?<\/title>/g, title.text())
//             html = html.replace(/<meta\s+.*?name="description".*?>/g, meta.text())
//             res.end(html)
//         })
//     })
//后端请求
// backendApp.get(["/admin", "/admin/*", "/login"], (req, res) => {
//     fs.readFile('../admin/dist/admin.html', 'utf-8', function (err, data) {
//         if (err) {
//             console.log(err);
//         } else {
//             // console.log(data);
//             res.end(data)
//         }
//     });
//     // res.render("admin.html",{title: "登录"})
// })
// backendApp.get('*', function (req, res) {
//     res.render('404.html', {
//         title: 'No Found'
//     })
// })
// backendApp
//     .use(backendRouter.routes())
//     .use(backendRouter.allowedMethods())

// 错误处理
backendApp.on('error', (err) => {
    console.error('Server error: \n%s\n%s ', err.stack || '')
})


// backendApp.listen(appConfig.appPort)
backendApp.listen(appConfig.appPort, () => {
    // console.log('服务器端渲染地址： http://localhost:3000')
    console.log(`\n> Starting server... ${uri} \n`)
})


// 前端Server
// const frontendApp = new Koa()
// const frontendRouter = new Router()
// frontendApp.use(serve(path.resolve(__dirname, '../dist')))
// frontendRouter.get('/index', (ctx, next) => {
//     let html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
//     ctx.type = 'html'
//     ctx.status = 200
//     ctx.body = html
// })
// frontendApp
//     .use(frontendRouter.routes())
//     .use(frontendRouter.allowedMethods())
// frontendApp.listen(3001, () => {
//     console.log('浏览器端渲染地址： http://localhost:3001')
// })