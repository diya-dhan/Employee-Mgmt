const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path : path.resolve(__dirname + '/.env')});

module.exports = {
    port : process.env.PORT,
    user : process.env.USER_NAME,
    host : process.env.HOST,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    db_port : process.env.DB_PORT
};