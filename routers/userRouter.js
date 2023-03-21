const userRoute = require('express').Router();
const pool = require('../db').pool;
const passport = require('passport');

userRoute.use((req, res, next) => {
    if(req.user) next();
    else res.redirect('/signIn');
}); 

userRoute.route('/profile').get(async(req,res)=>{

    if(req.user===undefined){
        res.redirect('/signIn');
        return;
    }

    const {user, status, message} = await require('../utilities/userDetails')(req,pool);

    if(status === 400){
        res.status(status).send(message);
        return;
    }

    else
        res.render("profile", {user : user});
});

//display page to edit
userRoute.route('/modify').get(async(req,res)=>{

    const {user, status, message} = await require('../utilities/userDetails')(req,pool);

    if(status === 400){
        res.status(status).send(message);
        return;
    }

    res.render('editProfile', {user: user});
});

//alter user details
userRoute.route('/modify/:type/:value').post(async (req,res)=>{

    let type = req.params.type;
    let value = req.params.value;

    let query = `UPDATE employee SET ${type} = '${value}' WHERE emp_id='${req.user.id}';`;

    const result = await pool.query(query);
    
    if(result.rowCount === 0){
        res.status(400).send("Could not modify details");
        return;
    }

    res.redirect("/user/modify");
});

module.exports = userRoute;