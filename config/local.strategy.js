const passport = require('passport');
const {Strategy} = require('passport-local');
const pool = require('../db').pool;

module.exports = function localStrategy(){
    passport.use(new Strategy({
        usernameField : 'empid',
        passwordField : 'password'
    }, (id, password, done)=>{
        const query = `SELECT * FROM employee WHERE emp_id='${id}';`;
        pool.query(query, (err,r)=>{
            // console.log(r);
            if(err){
                done(null, false);
                return;
                // res.render("signIn", {message : "No user found"}); 
            }
            else if(r.rows.length>0 && r.rows[0].password === password){
                const user = {id, password, type:r.rows[0].role};
                done(null, user)        // passes user to serializeUser()
            }

            else{
                done(null, false);// res.render("signIn", {message : "No user found"}); 
                return;
            }
        });
    }));

    return;
}
