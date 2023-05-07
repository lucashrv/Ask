const Sequelize = require('sequelize')
const connection = new Sequelize('ask', 'root', 'Lucas1230', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection