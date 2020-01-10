// const APIError = require('../middleware/rest').APIError

const backendArticle = require('../service/backendArticle')
const backendCategory = require('../service/backendCategory')
const backendUser = require('../service/backendUser')

const frontendUser = require('../service/frontendUser')
const frontendComment = require('../service/frontendComment')

module.exports = {
    // ------- 文章 -------
    // 管理时, 获取文章列表
    'GET /api/backend/article/list': async ctx => {
        await backendArticle.getList(ctx)
    },
    // 管理时, 获取单篇文章
    'GET /api/backend/article/item': async ctx => {
        await backendArticle.getItem(ctx)
    },
    // 管理时, 发布文章
    'POST /api/backend/article/insert': async ctx => {
        await backendArticle.insert(ctx)
    },
    // 管理时, 删除文章
    'GET /api/backend/article/delete': async ctx => {
        await backendArticle.deletes(ctx)
    },
    // 管理时, 恢复文章
    'GET /api/backend/article/recover': async ctx => {
        await backendArticle.recover(ctx)
    },
    // 管理时, 编辑文章
    'POST /api/backend/article/modify': async ctx => {
        await backendArticle.modify(ctx)
    },
    // ------- 分类 -------
    // 管理时, 获取分类列表
    'GET /api/backend/category/list': async ctx => {
        await backendCategory.getList(ctx)
    },
    // 管理时, 获取单个分类
    'GET /api/backend/category/item': async ctx => {
        await backendCategory.getItem(ctx)
    },
    // 管理时, 添加分类
    'POST /api/backend/category/insert': async ctx => {
        await backendCategory.insert(ctx)
    },
    // 管理时, 删除分类
    'GET /api/backend/category/delete': async ctx => {
        await backendCategory.deletes(ctx)
    },
    // 管理时, 恢复分类
    'GET /api/backend/category/recover': async ctx => {
        await backendCategory.recover(ctx)
    },
    // 管理时, 编辑分类
    'POST /api/backend/category/modify': async ctx => {
        await backendCategory.modify(ctx)
    },
    // ------- 管理 -------
    // 后台登录
    'POST /api/backend/admin/login': async ctx => {
        await backendUser.login(ctx)
    },
    // 管理列表
    'GET /api/backend/admin/list': async ctx => {
        await backendUser.getList(ctx)
    },
    // 获取单个管理员
    'GET /api/backend/admin/item': async ctx => {
        await backendUser.getItem(ctx)
    },
    // 编辑管理员
    'POST /api/backend/admin/modify': async ctx => {
        await backendUser.modify(ctx)
    },
    // 删除管理员
    'GET /api/backend/admin/delete': async ctx => {
        await backendUser.delete(ctx)
    },
    // 恢复管理员
    'GET /api/backend/admin/recover': async ctx => {
        await backendUser.recover(ctx)
    },
    // 用户列表
    'GET /api/backend/user/list': async ctx => {
        await frontendUser.getList(ctx)
    },
    // 获取单个用户
    'GET /api/backend/user/item': async ctx => {
        await frontendUser.getItem(ctx)
    },
    // 编辑用户
    'POST /api/backend/user/modify': async ctx => {
        await frontendUser.modify(ctx)
    },
    // 删除用户
    'GET /api/backend/user/delete': async ctx => {
        await frontendUser.deletes(ctx)
    },
    // 恢复用户
    'GET /api/backend/user/recover': async ctx => {
        await frontendUser.recover(ctx)
    },
    // ------ 评论 ------
    // 删除评论
    'GET /api/backend/comment/delete': async ctx => {
        await frontendComment.deletes(ctx)
    },
    // 恢复评论
    'GET /api/backend/comment/recover': async ctx => {
        await frontendComment.recover(ctx)
    }
}
