const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const { createBundleRenderer } = require('vue-server-renderer')

// 后端Server
const backendApp = new Koa()
const backendRouter = new Router()

// server.bundle.js demo
// const bundle = fs.readFileSync(path.resolve(__dirname, '../dist/server.bundle.js'), 'utf-8')
// const renderer = require('vue-server-renderer').createBundleRenderer(bundle, {
//     template: fs.readFileSync(path.resolve(__dirname, '../dist/index.ssr.html'), 'utf-8')
// })

// 使用serverBundle和clientManifest进行优化
const serverBundle = require(path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'))
const clientManifest = require(path.resolve(__dirname, '../dist/vue-ssr-client-manifest.json'))
const template = fs.readFileSync(path.resolve(__dirname, '../src/index.ssr.html'), 'utf-8')

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template: template, // （可选）页面模板
    clientManifest: clientManifest // （可选）客户端构建 manifest
})

// 解析静态资源
backendApp.use(serve(path.resolve(__dirname, '../dist')))

// 路由
backendRouter.get('/*', async (ctx, next) => {
    console.log(ctx.url)
    const context = { url: ctx.url }
    // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
    // 现在我们的服务器与应用程序已经解耦！
    try {
        // vuex demo
        // let html = await new Promise((resolve, reject) => {
        //     // 这里直接使用 renderToString 的 Promise 模式，返回的 html 字符串没有样式和 __INITIAL_STATE__，原因暂时还没有查到
        //     // 所以，只能暂时先自己封装一个 Promise，用 renderToString 的 callback 模式
        //     renderer.renderToString((err, html) => {
        //         if (err) {
        //             reject(err)
        //         } else {
        //             resolve(html)
        //         }
        //     })
        // })

        // vuex router demo
        let html = await renderer.renderToString(context)
        // console.log(html)
        ctx.type = 'html'
        ctx.status = 200
        ctx.body = html

        // 流式传输
        // 如果你依赖由组件生命周期钩子函数填充的上下文数据，则不建议使用流式传输模式
        // const stream = renderer.renderToStream(context)
        // let html = ''
        // stream.on('data', data => {
        //     html += data.toString()
        // })

        // stream.on('end', () => {
        //     // console.log(html) // 渲染完成
        //     ctx.status = 200
        //     ctx.type = 'html'
        //     ctx.body = html
        // })

        // stream.on('error', err => {
        //     // handle error...
        //     console.log(err)
        // })

    } catch (err) {
        console.error(err)
        ctx.status = 500
        ctx.body = '服务器内部错误'
    }
})

backendApp
    .use(backendRouter.routes())
    .use(backendRouter.allowedMethods())

backendApp.listen(3000, () => {
    console.log('服务器端渲染地址： http://localhost:3000')
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