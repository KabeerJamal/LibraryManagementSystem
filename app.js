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

const resetReservationCount = async () => {
    try {
        // Your SQL query to update reservations
        const query = `
            UPDATE users
            SET reservation_count = 0
        `;
        const [result] = await db.query(query);
    } catch (error) {
        console.error('Error updating overdue reservations:', error);
    }
}

//create a funciton that will run in cron job once everyday.
const checkOverdueReservations = async () => {
    //for every user, check the reservations that are overdue and isActive is true
    try {
        const query = `SELECT user_id, COUNT(*) AS overdue_reservations
                       FROM reservations
                       WHERE status = 'overdue' 
                       AND is_active = TRUE
                       GROUP BY user_id;
                    `
        const [result] = await db.query(query);

        //need to get this threshold from the database
        const threshold = 3;

        // Check if any user exceeds the threshold
        const userExceedingThreshold = result.some(row => row.overdue_reservations > threshold);

        if (userExceedingThreshold) {
            console.log("One or more users have exceeded the overdue reservation threshold.");
        } else {
        console.log("No users have exceeded the overdue reservation threshold.");
        }

    // Optionally, get the list of users who exceed the threshold
    const usersAboveThreshold = result.filter(row => row.overdue_reservations > threshold);

    if (usersAboveThreshold.length > 0) {
        console.log("Users exceeding threshold:", usersAboveThreshold);
    }
    } catch (error) {
        console.error('Error counting overdue reservations:', error);
    }

};


//pms to run website locallt forever
//notifications to be sent to user when overdue

// Schedule the job to run every day at midnight
cron.schedule('31 14 * * *', () => {
    console.log('Running job to check for overdue reservations and resetting reservation limit');
    updateOverdueReservations();
    cancelNotCollectedReservations();
    resetReservationCount();
    checkOverdueReservations();
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
        sameSite: "strict",
        secure: IN_PROD,//set to true for production enviourment
        httpOnly: true
    }
}))


app.use(flash());

const router = require('./router');

// Set the public folder as static
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    //make user session data available from within view templates
    res.locals.user = req.session.user;//ejs can access the user object which has username and avatar
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






















