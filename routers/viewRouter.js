const viewRoute = require('express').Router();
const pool = require('../db').pool;

viewRoute.use((req, res, next) => {
    if(req.user) next();
    else res.redirect('/signIn');
}); 

//display department details
viewRoute.route('/dept').get(async (req,res)=>{
    
    const {results, columns, status, message} = require("../utilities/allDepartmentDetails");

    res.render("viewDetails", {title:"Department Details", columns:columns, results:results});
});

//display user details
viewRoute.route('/user').get(async (req,res)=>{

    // let query = `SELECT emp_id, first_name||' '||last_name AS name,email,phone_number,dept_id AS dept,manager,role FROM employee;`;
    // result = await pool.query(query);
    // if(result.rows.length === 0){
    //     res.status(400).send("No user information available");
    //     return;
    // };

    // query = 'SELECT dept_id, dept_name FROM department';
    // d_result = await pool.query(query);
    // if(d_result.rows.length === 0){
    //     res.status(400).send("No department information available");
    //     return;
    // };

    // result = result.rows;
    // d_result = d_result.rows;

    // for (let i=0; i<result.length; i++)
    //     d_result.forEach((ele)=>{
    //         if(ele.dept_id === result[i].dept){
    //             result[i].dept = ele.dept_name;
    //             return;
    //         }
    //     })

    // columns = ["Employee ID","Name","Email ID","Phone Number","Department","Manager","Role"];

    // console.log(result[0]);
    
    const {results, columns, status, message} = require('../utilities/allUserDetails')(pool);

    if(status === 400){
        res.status(status).send(message);
        return;
    }
    
    else
        res.render("viewDetails", {title:"Employee Details", columns: columns, results:results});
});

//filter employees
viewRoute.route('/user/:type/:value').get(async (req,res)=>{
    let type = req.params.type;
    let value = req.params.value;

    const mappings = require("../utilities/columnMappings").employeeMappings;

    if(mappings[type]==="dept_id"){
        let query = `SELECT dept_id FROM department WHERE dept_name='${value}'`;

        const result = await pool.query(query);

        if(result.rows.length === 0){
            res.status(400).send("No users in mentioned department");
            return;
        }

        value = result.rows[0].dept_id;
    }

    const {results, columns, status, message} = require("../utilities/allUserDetails")(pool, mappings[type], value);

    if(status === 400){
        res.status(status).send(message);
        return;
    }

    else
        res.render("viewDetails", {title:"Employee Details", columns: columns, results:results});
});

//filter departments
viewRoute.route('/dept/:type/:value').get(async (req,res)=>{
    let type = req.params.type;
    let value = req.params.value;

    const mappings = require("../utilities/columnMappings").departmentMappings;

    const {results, columns, status, message} = require("../utilities/allDepartmentDetails")(pool, mappings[type], value);
    
    res.render("viewDetails", {title:"Department Details", columns: columns, results:results});
});

module.exports = viewRoute;