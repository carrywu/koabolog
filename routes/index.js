/**
 ├── routes
 └── index.js
 */
const Router = require('koa-router')
const ArticleController = require('../controllers/article')
const CategoryController = require('../controllers/category')

const router = new Router({
    prefix: '/api/v1'
})

/**
 * 文章接口
 */
// 创建文章接口（路由）
router.post('/article', ArticleController.create);
// 获取文章详情接口（路由）
router.get('/article/:id', ArticleController.detail);


// 分类接口
//创建分类
router.post('/category/create',CategoryController.create)
//获取分类详情
router.get('/category/detail/:id',CategoryController.detail)
//删除分类
router.delete('/category/detail/:id',CategoryController.delete)
//更改分类
router.put('/category/update/:id',CategoryController.update)
//获取分类
router.get('/category/list',CategoryController.list)
//查询分类ID下所有文章列表
router.get('/category/article/list/:id',CategoryController.getCategoryArticle)


module.exports = router

