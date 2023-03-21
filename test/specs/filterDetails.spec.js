
const pool = require('../../db').pool;

const signIn = async()=>{
    await browser.url("http://www.localhost:8000/signIn");
    await $('#id').setValue('6'); 
    await $('#pass').setValue('f56g643') 
    await $('#submit').click();

    // await require('../utilities/login');
    expect(await browser.getUrl()).toEqual("http://www.localhost:8000/user/profile");
}


describe("Filter Details Test", ()=>{

    it("should filter out and give the right set of results : Employees", async()=>{

        await signIn();

        let empDetails = await $('#emp');
        await empDetails.click();
        expect(await browser.getUrl()).toEqual("http://www.localhost:8000/view/user");

        let cols = await $$("form select option").length;

        const mappings = require("../../utilities/columnMappings").employeeMappings;

        //values for testing
        const values = [1, 'Diya', 'diya@gmail.com', '871231732', 't&i', 'David', 'Manager'];

        for(let i=0; i<cols; i++){
            await (await $("form select")).selectByIndex(i);

            let type = await (await $("form select")).getValue();

            if(type !== "Department"){

                await $("#value").setValue(values[i]);
                await (await $("#submit")).click();

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


                const {results} = require("../../utilities/allUserDetails")(pool, mappings[type], values[i]);

                expect(actualData === results);
            }
        }
    });

    it("should filter out and give the right set of results : Departments", async()=>{

        await signIn();

        let depDetails = await $('#dep');
        await depDetails.click();
        expect(await browser.getUrl()).toEqual("http://www.localhost:8000/view/dept");

        let cols = await $$("form select option").length;

        const mappings = require("../../utilities/columnMappings").departmentMappings;
    
        //values to test with
        const values = ["I75DE", "t&i", 2];

        for(let i=0; i<cols; i++){
            await (await $("form select")).selectByIndex(i);

            let type = await (await $("form select")).getValue();

            await $("#value").setValue(values[i]);
            await (await $("#submit")).click();

            let rows = await $$("#table1 tbody tr").length;
            let cols = await $$("#table1 tbody tr:nth-child(1) td").length;
                
            let actualData = [];
            const columns = ["dept_id", "dept_name", "building_no"];
            for(let i=1; i<=rows; i++){

                let data = {dept_id:undefined, dept_name:undefined , building_no:undefined};
                for(let j=1; j<=cols; j++){
                    data[columns[j-1]] = await $(`#table1 tbody tr:nth-child(${i}) td:nth-child(${j})`).getText();
                }

                actualData.push(data);
            }

            const {results} = require("../../utilities/allDepartmentDetails");
            expect(actualData === results);
        }
    });
});