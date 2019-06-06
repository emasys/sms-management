require('dotenv').config();

const config = {
  development: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DEV_DATABASE,
    host: process.env.HOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.TEST_DATABASE,
    host: process.env.HOST,
    dialect: 'postgres',
    logging: false,
  },
};

module.exports = config;
