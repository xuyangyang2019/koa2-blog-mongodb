// const APIError = require('../middleware/rest').APIError

const frontendArticle = require('../service/frontendArticle')
const frontendComment = require('../service/frontendComment')
const frontendLike = require('../service/frontendLike')
const frontendUser = require('../service/frontendUser')

// const isUser = require('../middlewares/user')

module.exports = {
    // 前台浏览时, 获取文章列表
    'GET /api/frontend/article/list': async ctx => {
        await frontendArticle.getList(ctx)
        // ctx.rest({
        //     list: await frontendArticle.getList(ctx)
        // })
    },
    // 前台浏览时, 获取单篇文章
    'GET /api/frontend/article/item': async ctx => {
        await frontendArticle.getItem(ctx)
        // ctx.rest({
        //     list: await frontendArticle.getItem(ctx)
        // })
    },
    // 前台浏览时, 热门文章
    'GET /api/frontend/trending': async ctx => {
        await frontendArticle.getTrending(ctx)
        // ctx.rest({
        //     list: await frontendArticle.getTrending(ctx)
        // })
    },

    // 发布评论
    'POST /api/frontend/comment/insert': async ctx => {
        await frontendComment.insert(ctx)
        // ctx.rest({
        //     list: await frontendComment.insert(ctx)
        // })
    },
    // 读取评论列表
    'GET /api/frontend/comment/list': async ctx => {
        await frontendComment.getList(ctx)
        // ctx.rest({
        //     list: await frontendComment.getList(ctx)
        // })
    },
    // 喜欢
    'GET /api/frontend/like': async ctx => {
        await frontendLike.like(ctx)
        // ctx.rest({
        //     list: await frontendLike.like(ctx)
        // })
    },
    // 取消喜欢
    'GET /api/frontend/unlike': async ctx => {
        await frontendLike.unlike(ctx)
        // ctx.rest({
        //     list: await frontendLike.unlike(ctx)
        // })
    },
    // 重置喜欢
    'GET /api/frontend/reset/like': async ctx => {
        await frontendLike.resetLike(ctx)
        // ctx.rest({
        //     list: await frontendLike.resetLike(ctx)
        // })
    },
    // 前台注册
    'POST /api/frontend/user/insert': async ctx => {
        await frontendUser.insert(ctx)
        // ctx.rest({
        //     list: await frontendUser.insert(ctx)
        // })
    },
    // 前台登录
    'POST /api/frontend/user/login': async ctx => {
        await frontendUser.login(ctx)
        // ctx.rest({
        //     list: await frontendUser.login(ctx)
        // })
    },
    // 微信登录
    'POST /api/frontend/user/jscode2session': async ctx => {
        await frontendUser.jscode2session(ctx)
        // ctx.rest({
        //     list: await frontendUser.jscode2session(ctx)
        // })
    },
    'POST /api/frontend/user/wxLogin': async ctx => {
        await frontendUser.wxLogin(ctx)
        // ctx.rest({
        //     list: await frontendUser.wxLogin(ctx)
        // })
    },
    // 前台退出
    'POST /api/frontend/user/logout': async ctx => {
        await frontendUser.logout(ctx)
        // ctx.rest({
        //     list: await frontendUser.logout(ctx)
        // })
    },
    // 前台账号读取
    'GET /api/frontend/user/account': async ctx => {
        isUser
        await frontendUser.getItem(ctx)
        // ctx.rest({
        //     list: await frontendUser.getItem(ctx)
        // })
    },
    // 前台账号修改
    'POST /api/frontend/user/account': async ctx => {
        isUser
        await frontendUser.account(ctx)
        // ctx.rest({
        //     list: await frontendUser.account(ctx)
        // })
    },
    // 前台密码修改
    'POST /api/frontend/password': async ctx => {
        isUser
        await frontendUser.password(ctx)
        // ctx.rest({
        //     list: await frontendUser.password(ctx)
        // })
    }
    // // 获取
    // 'GET /api/products': async (ctx, next) => {
    //     ctx.rest({
    //         products: products.getProducts()
    //     });
    // },
    // // 获取
    // 'GET /api/todos': async (ctx, next) => {
    //     ctx.rest({
    //         todos: todos
    //     });
    // },
    // // 新增
    // 'POST /api/todos': async (ctx, next) => {
    //     var
    //         t = ctx.request.body,
    //         todo;
    //     if (!t.name || !t.name.trim()) {
    //         throw new APIError('invalid_input', 'Missing name');
    //     }
    //     if (!t.description || !t.description.trim()) {
    //         throw new APIError('invalid_input', 'Missing description');
    //     }
    //     todo = {
    //         id: nextId(),
    //         name: t.name.trim(),
    //         description: t.description.trim()
    //     };
    //     todos.push(todo);
    //     ctx.rest(todo);
    // },
    // // 更新
    // 'PUT /api/todos/:id': async (ctx, next) => {
    //     var
    //         t = ctx.request.body,
    //         index = -1,
    //         i, todo;
    //     if (!t.name || !t.name.trim()) {
    //         throw new APIError('invalid_input', 'Missing name');
    //     }
    //     if (!t.description || !t.description.trim()) {
    //         throw new APIError('invalid_input', 'Missing description');
    //     }
    //     for (i = 0; i < todos.length; i++) {
    //         if (todos[i].id === ctx.params.id) {
    //             index = i;
    //             break;
    //         }
    //     }
    //     if (index === -1) {
    //         throw new APIError('notfound', 'Todo not found by id: ' + ctx.params.id);
    //     }
    //     todo = todos[index];
    //     todo.name = t.name.trim();
    //     todo.description = t.description.trim();
    //     ctx.rest(todo);
    // },
    // // 删除
    // 'DELETE /api/todos/:id': async (ctx, next) => {
    //     var i, index = -1;
    //     for (i = 0; i < todos.length; i++) {
    //         if (todos[i].id === ctx.params.id) {
    //             index = i;
    //             break;
    //         }
    //     }
    //     if (index === -1) {
    //         throw new APIError('notfound', 'Todo not found by id: ' + ctx.params.id);
    //     }
    //     ctx.rest(todos.splice(index, 1)[0]);
    // }
}
