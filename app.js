//dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');
const path = require('path');
const pool = require('./db').pool;
// const { db_connect } = require('./db');

const adminRoute = require('./routers/adminRouter');
const userRoute = require('./routers/userRouter');
const viewRoute = require('./routers/viewRouter');

//environment variables
const { port } = require('./environment/config.js');

//create server
const app = express();

// middleware
app.use(express.static(path.join(__dirname, '/src')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use(session({
    secret : 'employeeMgMT',
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave : false,
    saveUninitialized : false
}));

app.set('views', './src');
app.set('view engine', 'ejs');

require('./config/passport.js')(app); 

//routes
app.use('/admin',adminRoute);
app.use('/user',userRoute);
app.use('/view',viewRoute);

app.get('/', (req,res)=>{
    console.log("here")
    res.redirect('/signIn');
});

//employee signin
app.get('/signIn', (req,res)=>{

    // console.log(req.user);

    // let error, message;
    // if(req.user === undefined){
    //     error= false;
    //     message = undefined;
    // }

    // else if(req.user.message === "invalid credentials"){
    //     console.log("here")
    //     error = true;
    //     message = req.user.message;
    // }
        res.render("signIn");
});


app.post('/signIn', passport.authenticate('local', {     
        successRedirect : '/user/profile',
        failureRedirect : '/signIn'
}));

app.get('/signOut', (req,res, next)=>{
    req.logOut((err)=>{
        if(err) next(err);
        else
            res.redirect("/");
    })
});

//server listens for requests
app.listen(port, ()=>{
    console.log(`Server started at port ${port}`);
    // require('./db').db_connect;
});

