const pool = require('../../db').pool;

const signIn = async()=>{
    await browser.url("http://www.localhost:8000/signIn");
    await $('#id').setValue('6'); 
    await $('#pass').setValue('f56g643') 
    await $('#submit').click();

    // await require('../utilities/login');
    expect(await browser.getUrl()).toEqual("http://www.localhost:8000/user/profile");
}

describe("View Details Page", ()=>{

    it("Validates information on the Employee Details page", async()=>{

        await signIn();

        let empDetails = await $('#emp');
        await empDetails.click();

        let query = `SELECT emp_id, first_name||' '||last_name AS name,email,phone_number,dept_id AS dept,manager,role FROM employee;`;
        result = await pool.query(query);
        result = result.rows;

        console.log(result);
        let rows = await $$("#table1 tbody tr").length;
        let cols = await $$("#table1 tbody tr:nth-child(1) td").length;
        
        let actualData = [];
        const columns = ["emp_id", "name", "email", "phone_number", "dept", "manager", "role"];
        for(let i=1; i<=rows; i++){

            let data = {emp_id:undefined, name:undefined, email:undefined, phone_number:undefined, dept:undefined, manager:undefined, role:undefined};
            for(let j=1; j<=cols; j++){
                data[columns[j-1]] = await $(`#table1 tbody tr:nth-child(${i}) td:nth-child(${j})`).getText();
            }

            actualData.push(data);
        }

        query = `SELECT dept_id, dept_name FROM department;`;
        d_result = await pool.query(query);
        d_result = d_result.rows;

        for(let i=1; i<=rows; i++){
            d_result.forEach((ele) =>{ 
                if(ele.dept_name === actualData[i-1].dept) {
                    actualData[i-1].dept = ele.dept_name;
                    return; 
                }
            });
        }

        expect(actualData === result);
    });

    it("Validates information on the Department Details page", async()=>{

        await signIn();

        let depDetails = await $('#dep');
        await depDetails.click();

        let query = `SELECT * FROM department;`;
        result = await pool.query(query);
        result = result.rows;

        console.log(result);
        let rows = await $$("#table1 tbody tr").length;
        let cols = await $$("#table1 tbody tr:nth-child(1) td").length;
        
        let actualData = [];
        const columns = ["dept_id", "dept_name", "building_no"];
        for(let i=1; i<=rows; i++){

            let data = {dept_id:undefined, dept_name:undefined, building_no:undefined};
            for(let j=1; j<=cols; j++){
                data[columns[j-1]] = await $(`#table1 tbody tr:nth-child(${i}) td:nth-child(${j})`).getText();
            }

            actualData.push(data);
        }
        
        expect(actualData === result);
    });

});