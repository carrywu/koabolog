const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const jwt = require('koa-jwt')
const logger = require('koa-logger')
const cors = require('koa-cors');
const index = require('./routes/index')
const secret = require('./config/secret')
const err = require('./middlreware/error')

// error handler
onerror(app)

app.use(err())
app.use(cors());

// 此接口列表，过滤不用jwt验证
// app.use(jwt({secret: secret.sign}).unless({
//     path: [
//         // 文章详情
//         /^\/api\/v1\/article\/detail/,
//         // 文章列表
//         /^\/api\/v1\/article\/list/,
//         // 登录
//         /^\/api\/v1\/user\/login/,
//         // 创建用户
//         /^\/api\/v1\/user\/register/,
//         // 分类列表
//         /^\/api\/v1\/category\/list/,
//         // 文章搜索
//         /^\/api\/v1\/article\/search/,
//         // 分类
//         /^\/api\/v1\/category\/article\/list/
//     ]
// }))

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
