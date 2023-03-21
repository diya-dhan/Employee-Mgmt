module.exports = async(pool, type=null, value=null)=>{

    let query;
    if(type===null)
        query = `SELECT * FROM department;`;
    
    else
        query = `SELECT * FROM department WHERE ${type}='${value}';`;

    let result = await pool.query(query);
    result = result.rows;

    columns = ["Department ID","Department Name","Building No."];

    return {results:result, columns:columns, status:200, message:"Success"};
};