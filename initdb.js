// const mongoose = require('mongoose')

// const DB_URL = 'mongodb://localhost:27017/mdb' /** * 连接 */

// mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

// const db = mongoose.connection

// db.once('open', function() {
//     // we're connected!
//     console.log('mongodb open')
//     var kittySchema = mongoose.Schema({
//         name: String
//     })
//     // 译者注：注意了， method 是给 document 用的
//     // NOTE: methods must be added to the schema before compiling it with mongoose.model()
//     kittySchema.methods.speak = function() {
//         var greeting = this.name ? 'Meow name is ' + this.name : "I don't have a name"
//         console.log(greeting)
//     }
//     var Kitten = mongoose.model('Kitten', kittySchema)

//     var fluffy = new Kitten({ name: 'fluffy' })
//     fluffy.save(function(err, fluffy) {
//         if (err) return console.error(err)
//         fluffy.speak()
//     })
//     Kitten.find(function(err, kittens) {
//         if (err) return console.error(err)
//         console.log(kittens)
//     })
// })

// /** * 连接成功 */
// db.on('connected', function() {
//     console.log('Mongoose connection open to ' + DB_URL)
// })

// /** * 连接异常 */
// db.on('error', function(err) {
//     console.log('Mongoose connection error: ' + err)
// })

// /** * 连接断开 */
// db.on('disconnected', function() {
//     console.log('Mongoose connection disconnected')
// })

// 管理员数据模型
const moment = require('moment')
const md5 = require('md5')
// 配置文件
const config = require('./server/config')
// 加密前缀
const md5Pre = config.md5Pre

const Admin = require('./server/models/admin')

const admin1 = new Admin({
    username: 'xyy',
    email: 'xyy@163.com',
    password: md5(md5Pre + '123456'),
    creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    is_delete: 0,
    timestamp: moment().format('X')
})
// console.log(admin1)
admin1.save((err, newAdmin) => {
    if (err) return console.error(err)
    console.log(newAdmin)
})
