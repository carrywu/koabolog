/**
├── modules
    └── article.js
*/

// 连接mysql数据库的db.js文件
const db = require('../config/db');
// 引入Sequelize对象
const Sequelize = db.sequelize;
//查询
const Op = Sequelize.Op;
// 引入上一步的文章数据表模型文件
const Article = Sequelize.import('../schema/article');
const Category = Sequelize.import('../schema/category')
// 自动创建表
Article.sync({ force: false });

Category.hasMany(Article) //将会添加categoryId到Article模型
//Article表与Category表关联
Article.belongsTo(Category, { as: 'Current', foreignKey: 'categoryId', constraints: false })

class ArticleModel {
    /**
     * 创建文章模型
     * @param data
     * @returns {Promise<*>}
     */
    static async createArticle(data) {
        return await Article.create({
            title: data.title, // 文章标题
            author: data.author, // 文章作者
            introduce: data.introduce,//文章介绍
            content: data.content, // 文章内容
            category: data.category, // 文章分类
            categoryId: data.categoryId //关联分类

        })
    }

    /**
     * 查询取文章详情数据
     * @param id  文章ID
     * @returns {Promise<Model>}
     */
    static async getArticleDetail(id) {
        return await Article.findOne({
            where: {
                id,
            },
        })
    }
    //更新文章数据
    static async updateArticle(id, data) {
        await Article.update({
            title: data.title, // 文章标题
            author: data.author, // 文章作者
            introduce: data.introduce,//文章介绍
            content: data.content, // 文章内容
            category: data.category, // 文章分类
            categoryId: data.categoryId //关联分类
        }, {
                where: {
                    id
                },
                fields: ['title', 'author', 'introduce', 'category', 'content', 'recommend']
            }

        )
        return true
    }

    //搜索
    static async search(params) {
        return await Article.findAll({
            raw: true,
            'order': [
                ['id', 'DESC']
            ],
            where: {
                title: {
                    //模糊查询
                    [Op.like]: '%' + params.keyword + '%'
                },
                attribute: { exclude: ['content'] }
            }
        })
    }

    //获取文章列表
    static async getArticleList(params) {
        let ret = null;
        let { page = 1, category, title, recommend } = params;

        if (category) {
            ret = await Article.findAndCountAll({
                limit: 10,//每页十条
                offset: (page - 1) * 10,
                where: {
                    category: category
                },
                'order': [
                    ['id', 'DESC']
                ],
                attributes: { exclude: ['content'] }
            })
        } else if (title) {
            ret = await Article.findAndCountAll({
                limit: 10,//每页十条
                offset: (page - 1) * 10,
                where: {
                    category: category
                },
                'order': [
                    ['id', 'DESC']
                ],
                attributes: { exclude: ['content'] }
            })
        } else if (recommend) {
            ret = await Article.findAndCountAll({
                limit: 10,//每页十条
                offset: (page - 1) * 10,
                where: {
                    category: category
                },
                'order': [
                    ['id', 'DESC']
                ],
                attributes: { exclude: ['content'] }
            })
        } else {
            ret = await Article.findAndCountAll({
                limit: 10,//每页10条
                offset: (page - 1) * 10,
                'order': [
                    ['id', 'DESC']
                ],
                attributes: { exclude: ['content'] }

            });
        }
        return {
            code: 200,
            data: ret.rows,
            meta: {
                current_page: parseInt(page),
                per_page: 10,
                count: ret.count,
                total: ret.count,
                total_pages: Math.ceil(ret.count / 10)
            }
        }

    }

    //获取文章详情数据
    static async getArticleDetail(id){
        return await Article.findOne({
            where:{
                id
            }
        })
    }

    //删除文章
    static async deleteArticle(id){
        await Article.destroy({
            where:{
                id
            }
        })
        return true
    }

}


module.exports = ArticleModel
