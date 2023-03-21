// !!! INCOMPLETE


const pool = require('../../db').pool;

const signIn = async()=>{
    await browser.url("http://www.localhost:8000/signIn");
    await $('#id').setValue('6'); 
    await $('#pass').setValue('f56g643') 
    await $('#submit').click();

    // await require('../utilities/login');
    expect(await browser.getUrl()).toEqual("http://www.localhost:8000/user/profile");
}


//how to test without modifying database
describe("Modify Personal Details Page", ()=>{

    it('should properly edit and save changes', async()=>{

        await signIn();

        let modDetails = await $('#modify');
        await modDetails.click();

        expect(await browser.getUrl()).toEqual("http://www.localhost:8000/user/modify");

        let saveEmail = await $('#email');
        await saveEmail.click();


    });

});