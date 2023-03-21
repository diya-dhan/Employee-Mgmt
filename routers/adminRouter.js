const adminRoute = require('express').Router();
const pool = require('../db').pool;

adminRoute.use((req, res, next) => {
    if(req.user!==undefined && req.user.type==="Manager") next();
    else res.redirect('/signIn');
}); 

// create user
adminRoute.route('/user/create').post(async (req,res)=>{
    const { fname, lname, email, phonenum, dept, role } = req.body;
    
    let query = `SELECT dept_id FROM department WHERE dept_name='${dept}'`;
    let result = await pool.query(query);
    if(result.rows.length === 0){
        res.status(400).send("Cannot find department");
        return;
    }
    const dept_id = result.rows[0].dept_id;

    query = `SELECT first_name FROM employee WHERE emp_id=${req.user.id}`;
    result = await pool.query(query);
    if(result.rows.length === 0){
        res.status(400).send("Cannot find manager");
        return;
    }

    const mname = result.rows[0].first_name;
    const pass = (Math.random() + 1).toString(36).substring(5);

    query = `INSERT INTO employee (first_name, last_name, email, phone_number, dept_id, manager, password, role) VALUES ('${fname}','${lname}','${email}',${phonenum},'${dept_id}','${mname}','${pass}','${role}');`
    result = await pool.query(query);

    if(result.rowCount === 0){
        res.status(400).send("Cannot create employee");
        return;
    }

    res.status(200).send({message:"User created successfully",temp_password:pass});
});

//create department
adminRoute.route('/dept/create').post(async (req,res)=>{
    const {did, dname, bno} = req.body;

    let query = `INSERT INTO department VALUES ('${did}', '${dname}', ${bno});`;
    const result = await pool.query(query);
    
    if(result.rowCount === 0){
        res.status(400).send("Error in creating");
        return;
    }

    res.status(200).send("Created department");
    
});

module.exports = adminRoute;