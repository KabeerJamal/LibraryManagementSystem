const express = require('express');
const app = express();
const dotenv = require('dotenv');




dotenv.config();

const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const flash = require('connect-flash');




const options ={
    connectionLimit: 10,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    createDatabaseTable: false,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'id',
            expires: 'expires',
            data: 'data'
        }
    }
}

const TWO_HOURS = 1000 * 60 * 60 * 2;
const IN_PROD = process.env.NODE_ENV  === 'production';
const  sessionStore = new mysqlStore(options);

app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD//set to true for production enviourment
    }
}))


app.use(flash());

const router = require('./router');

// Set the public folder as static
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    next();
})

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('views', 'views');
app.set('view engine', 'ejs');

//Use the router for handling routes
app.use('/', router)


//Start the server and listen on port defined in .env file
app.listen(process.env.PORT);


//add publication year as well in search

//file in includes folder for flash messages
//some changes in home.ejs

///adminPortal opening without asking user pass
//deal with the fact that you cant just get the password from the database when doing a call to the database
//can an admin cancel someones reservation? can the admin block someone from membership?



//user reserve add to cart?

//Tomm


//Can a user reserve multiple books at a time? then in reservation table, array like structure neded for bookId and copyId
//add images to books
//User should be able to reserve multiple copies. 
//Once he reserves he should be able to view his book statuses.(make this feature) then work on notifications

//if user delete his id, what happens to his reservations?



//Next step
// ya just design the user reservation details page
//cancel reservation
//collection
//if not returned add in bad debt
//reservations should have search feature.
//admin can see all reservations.(done)
//add image of book wherever being displayed
//search filter

//Many tasks to do, but this includes fundamanetal features to be done in backend

//Cancel reservations(me)
//2)Collection logic(me)
//if not returned, add in bad debt
//The reservation should have search feature(me)
//Main page books and search there as well.
//Settings page where admin can customize to his own liking.







//User: view past reservation details, Admin: view past reservation details -> bad debt + completed (using filter)
//search feature for reservations(both current and past) (including filter of statuses)

//clean code.