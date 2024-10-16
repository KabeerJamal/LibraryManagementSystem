const express = require('express');
const app = express();
const dotenv = require('dotenv');


const cron = require('node-cron');
const db = require('./db');

dotenv.config();

const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const flash = require('connect-flash');


//To schedule automated tasks
// Function to update overdue reservations
const updateOverdueReservations = async () => {
    try {
        // Your SQL query to update reservations
        const query = `
            UPDATE reservations
            SET status = 'overdue'
            WHERE return_date < CURDATE() AND status = 'collected'
        `;
        //write code for reserved but not collected as well.
        
        const [result] = await db.query(query);
        console.log(`${result.affectedRows} reservations updated to 'overdue'`);
    } catch (error) {
        console.error('Error updating overdue reservations:', error);
    }
};

// Function to cancel reservations that have not been collected by deleting it from database
const cancelNotCollectedReservations = async () => {
    try {
        // Your SQL query to update reservations
        const query = `
            DELETE FROM reservations
            WHERE collect_date_deadline < CURDATE() AND status = 'reserved'
        `;
        const [result] = await db.query(query);
    } catch (error) {
        console.error('Error updating overdue reservations:', error);
    }
};

//pms to run website locallt forever
//notifications to be sent to user when overdue

// Schedule the job to run every day at midnight
cron.schedule('25 0 * * *', () => {
    console.log('Running job to check for overdue reservations');
    updateOverdueReservations();
    cancelNotCollectedReservations();
});


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


//need to deal with time issue in database. borrower details in reservation model.
//add publication year as well in search
//count of how many overdues/bad debts and a strike or smth.

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




//Many tasks to do, but this includes fundamanetal features to be done in backend


//The reservation should have search feature(me)
//Main page books and search there as well.
//Settings page where admin can customize to his own liking.






//Admin has access to every user. He can see all reservations.take actions on them.

//User: view past reservation details, Admin: view past reservation details -> bad debt + completed (using filter)
//overdue logic and automated reservation cacnellation.(use a trigger)
//search feature for reservations(both current and past) (including filter of statuses)
//Send notification to user when overdue
//add image of book wherever being displayed

//clean code.

//i want a search option in admin reservation page with a search filter that should work as follows.

//1)You can search for books and borrower name(later adapt to where user can select what to search for)
//2)You can filter out the results based on the status of the reservation
//3)You can further filter\sort the results based on the date of reservation
//4) i want the user to have same code, but for him the search should be based on the book name and the status of the reservation and date of reservation


//1) almost implemented, then work on 2.


//Before all that, pull umer code.
//3)option to see all reservations (show all reservation button)
//2)Tommorow work on filters.(1-remove the badreservation related file/code(need to clean))
//4)organise all reservations for user and admin.



//small things, z-index of flash messages and overdue logic check.
//Clean all html css ,code, use includes and everything


//Tomm
//A button showing all reservations, when you search you only look at the filter.(also do a front end search no need for back end)
//clean code
//organise the reservation for user and admin

//A settings page for admin and customer.
//notifications?
//Contacting the admin?
//Front end betterment
