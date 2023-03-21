const pool = require('../../db').pool;
// const assert = requier('assert');

let id, name, email, phoneNum, dept, mgrName, role;

const signIn = async()=>{
    await browser.url("http://www.localhost:8000/signIn");
    await $('#id').setValue('6'); 
    await $('#pass').setValue('f56g643') 
    await $('#submit').click();

    // await require('../utilities/login');
    expect(await browser.getUrl()).toEqual("http://www.localhost:8000/user/profile");
}

describe('Profile page', async()=>{

    it('should verify the information displayed on the page with the database', async()=>{

        await signIn();
        
        id = $("#id");
        name = $("#full_name");
        email = $('#email');
        phoneNum = $("#phone_num");
        dept = $("#dept");
        mgrName = $("#mgr_name");
        role = $("#role");

        const actualData = {
            emp_id : await id.getText(),
            name : await name.getText(),
            email : await email.getText(),
            phone_number : await phoneNum.getText(),
            dept : await dept.getText(),
            manager : await mgrName.getText(),
            role : await role.getText()
        };

        let query = `SELECT emp_id, first_name||' '||last_name AS name,email,phone_number,dept_id AS dept,manager,role FROM employee WHERE emp_id=6;`
        let results = await pool.query(query);
        results = results.rows[0];

        query = `SELECT dept_name FROM department WHERE dept_id='${results.dept}'`;
        let d_results = await pool.query(query);
        
        results.dept = d_results.rows[0].dept_name;

        console.log(actualData);
        console.log(results);

       expect(actualData === results);
    });

    it('should navigate to the right pages', async()=>{

        await signIn();

        let empDetails = await $('#dep');
        await empDetails.click();
        expect(await browser.getUrl()).toEqual("http://www.localhost:8000/view/dept");

        await browser.url("http://www.localhost:8000/user/profile");

        let userDetails = await $('#emp');
        await userDetails.click();
        expect(await browser.getUrl()).toEqual("http://www.localhost:8000/view/user");

        await browser.url("http://www.localhost:8000/user/profile");

        let modify = await $('#modify');
        await modify.click();
        expect(await browser.getUrl()).toEqual("http://www.localhost:8000/user/modify");

    });
});
