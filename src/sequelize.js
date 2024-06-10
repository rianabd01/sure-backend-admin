const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();
const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  },
);
// const sequelize = new Sequelize('sure_app', 'root', 'yAle3iAiD', {
//   host: 'localhost',
//   dialect: 'mysql',
// });

module.exports = sequelize;
