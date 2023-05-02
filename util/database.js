const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodejs-udemy', 'root', 'MiBceo5R', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
