
const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const { createBundleRenderer } = require('vue-server-renderer')

const backendApp = new Koa()
const backendRouter = new Router()

const serverBundle = require(path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'))
const clientManifest = require(path.resolve(__dirname, '../dist/vue-ssr-client-manifest.json'))
const template = fs.readFileSync(path.resolve(__dirname, '../dist/index.ssr.html'), 'utf-8')

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,  // 推荐
    template: template, // （可选）页面模板
    clientManifest: clientManifest // （可选）客户端构建 manifest
})

// 后端Server
backendApp.use(serve(path.resolve(__dirname, '../dist')))
backendRouter.get('*', (ctx, next) => {
    // console.log('ctx', ctx)
    // console.log('url', ctx.url)

    const context = { url: ctx.url }
    // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
    // 现在我们的服务器与应用程序已经解耦！
    // renderer.renderToString(context, (err, html) => {
    //     // 处理异常……
    //     if (err) {
    //         console.log(err)
    //         // ctx.status = 500
    //         // ctx.type = 'html'
    //         // ctx.body = err
    //     }
    //     ctx.status = 200
    //     ctx.type = 'html'
    //     ctx.body = html
    // })

    // 流式传输
    // 如果你依赖由组件生命周期钩子函数填充的上下文数据，则不建议使用流式传输模式
    const stream = renderer.renderToStream(context)
    let html = ''
    stream.on('data', data => {
        html += data.toString()
    })

    stream.on('end', () => {
        // console.log(html) // 渲染完成
        ctx.status = 200
        ctx.type = 'html'
        ctx.body = html
    })

    stream.on('error', err => {
        // handle error...
        console.log(err)
    })
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