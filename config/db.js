const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize with MySQL database connection
const sequelize = new Sequelize(
  process.env.DATABASENAME,
  process.env.DATABASEUSER,
  process.env.DATABASEPWD,
  {
    host: process.env.DATABASEHOST,
    dialect: process.env.DATABASEDIALECT,
    port: process.env.DATABASEPORT,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
