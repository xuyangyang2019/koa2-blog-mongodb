const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Promise = require('bluebird')

// 配置文件
// const config = require('../config')

// 生成唯一标识符
// const uuid = require('node-uuid')

// /**
//  * 生成唯一标识符
//  */
// function generateId() {
//     return uuid.v1() // 基于时间戳生成
//     // return uuid.v4(); // 随机生成
// }

// const mongoUrl = process.env.NODE_ENV === 'docker-development' ? 'dockerized_mongo' : 'localhost'
mongoose.connect(`mongodb://localhost/mdb`, { useNewUrlParser: true, useUnifiedTopology: true })

// 类型
// const ID_TYPE = Sequelize.STRING(50)

function defineModel(name, attributes, plugin = '') {
    attributes.creat_date = {
        type: String
    }
    attributes.update_date = {
        type: String
    }
    attributes.is_delete = {
        type: Number
    }
    attributes.timestamp = {
        type: Number
    }
    const schema = new Schema(attributes)
    if (plugin) {
        schema.plugin(require(plugin))
    }
    const model = mongoose.model(name, schema)

    Promise.promisifyAll(model)
    Promise.promisifyAll(model.prototype)
    return model
}

const exp = {
    defineModel
}

const TYPES = ['String', 'Number', 'Boolean', 'Array', 'Buffer', 'Date', 'ObjectId', 'Mixed']
for (const type of TYPES) {
    exp[type] = Schema.Types[type]
}

// exp.ID = ID_TYPE // 主键的数据类型
// exp.generateId = generateId // 主键

module.exports = exp
