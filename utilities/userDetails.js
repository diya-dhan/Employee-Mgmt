module.exports = async(req, pool)=>{

    let query = `SELECT * FROM employee WHERE emp_id=${req.user.id}`;
    let result = await pool.query(query);

    if(result.rows.length === 0)
        return {user:null, status:400, message:"Employee information not available"};

    result = result.rows[0];

    query = `SELECT dept_name FROM department WHERE dept_id='${result.dept_id}';`;
    let dept = await pool.query(query);
    if(dept.rows.length===0)
        return {user:null, status:400, message:"Department information not available"};
    
    dept = dept.rows[0].dept_name;

    const user = {
        empid : result.emp_id,
        name : result.first_name+" "+result.last_name,
        email : result.email,
        phonenum : result.phone_number,
        dept : dept,
        mgr_name : result.manager,
        role : result.role
    };

    return {user:user, status:200, message:"Success"};
};