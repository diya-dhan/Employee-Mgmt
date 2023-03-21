const pg = require('pg');
const { user, host, password, database, db_port } = require('./environment/config');

const config = {
    user : user,
    host : host,
    password : password,
    database : database,
    port : db_port
};

const pool = new pg.Pool(config);

const db_connect = pool.connect((err,res) => {
    if(err){
        console.log(err);
        process.exit(-1);
    }
    else
        console.log(`Connected to database at port ${db_port}`);    
});

module.exports = {
    db_connect, 
    pool
};