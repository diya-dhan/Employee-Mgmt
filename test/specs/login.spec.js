let user, pass, submit;

const signIn = async()=>{
    await browser.url("http://www.localhost:8000/signIn");         //open any website

    //capture page elements
    user = $("#id");
    pass = $("#pass");
    submit = $("#submit");
};

// signIn();
describe('Login test' , ()=>{
    it('should validate the correct login credentials', async()=>{

        await signIn();
        //add text inside the elements
        await user.setValue('6');
        await pass.setValue('f56g643');
        await submit.click();

        //write an assertion
        expect(await browser.getUrl()).toEqual("http://www.localhost:8000/user/profile");
    });

    it('should not validate the incorrect credentials', async()=>{
        await browser.url("http://www.localhost:8000/signIn");

        await user.setValue('6');
        await pass.setValue('uguihuh');
        await submit.click();

        expect(await browser.getUrl()).toEqual("http://www.localhost:8000/signIn");
    });

});