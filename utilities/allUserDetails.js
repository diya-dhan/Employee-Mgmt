module.exports = async(pool, type=null, value=null)=>{

    let query;
    if(type===null)
        query = `SELECT emp_id, first_name||' '||last_name AS name,email,phone_number,dept_id AS dept,manager,role FROM employee;`;
    
    else
        query = `SELECT emp_id,first_name||' '||last_name AS name,email,phone_number,dept_id AS dept,manager,role FROM employee WHERE ${type}='${value}';`;

    let result = await pool.query(query);
    result = result.rows;

    query = 'SELECT dept_id, dept_name FROM department';
    let d_result = await pool.query(query);
    if(d_result.rows.length === 0)
        return {user:null, status:400, message:"Department information not available"};
        
    d_result = d_result.rows;

    for (let i=0; i<result.length; i++)
        d_result.forEach((ele)=>{
            if(ele.dept_id === result[i].dept){
                result[i].dept = ele.dept_name;
                return;
            }
        })

    columns = ["Employee ID","Name","Email ID","Phone Number","Department","Manager","Role"];

    return {results:result, columns:columns, status:200, message:"Success"};
};