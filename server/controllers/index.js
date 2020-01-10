// MVC Controllers
// 原始语法
// const fn_hello = async (ctx, next) => {
//     ctx.response.type = 'text/html'
//     const name = ctx.params.name || 'world'
//     ctx.response.body = `<h1>Hello, ${name}!</h1>`
// }

// Nunjucks 模板方法
const fn_index = async ctx => {
    await ctx.render('index.ejs', {})
}

// /**
//  * 异步读取文件
//  * @param {*} url
//  */
// function read(url) {
//     const fs = require('fs')
//     return new Promise((resolve, reject) => {
//         fs.readFile(url, 'utf-8', function(err, data) {
//             if (err) return reject(err)
//             resolve({ status: 200, body: data })
//         })
//     })
// }

// const fn_dist = async (ctx, next) => {
//     const path = './dist/index.html'
//     // 构造解析 异步读取
//     const { status, body } = await read(path)
//     // 同步读取
//     // let status = 200
//     // let body = fs.readFileSync(path, 'utf-8');
//     ctx.state = status
//     ctx.type = 'text/html'
//     ctx.body = body
// }

module.exports = {
    'GET /': fn_index
    // 'GET /hello/:name': fn_hello,
    // 'GET /dist': fn_dist
}
