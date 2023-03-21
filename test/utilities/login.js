module.exports = async()=>{

    await browser.url("http://www.localhost:8000/signIn");
    await $('#id').setValue('6'); 
    await $('#pass').setValue('f56g643') 
    await $('#submit').click();

    expect(await browser.getUrl()).toEqual("http://www.localhost:8000/user/profile");
    // await browser.waitUntil(async()=>{
    //     await browser.getCookies().lengtjh > 0;
    // });
};