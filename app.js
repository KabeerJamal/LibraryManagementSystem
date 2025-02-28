
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const axios = require('axios'); 


const cron = require('node-cron');
const db = require('./db');

dotenv.config();

const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const flash = require('connect-flash');

const overdueAndBadDebtController = require('./controllers/overdueAndBadDebtController');


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

//a limit for number of reservations a day.
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

// Generic function to check overdue/baddebt reservations
const checkReservations = async (statusType, thresholdKey) => {
    try {
        console.log(`Checking ${statusType} reservations...`);

        // Query reservations based on statusType ('overdue' or 'baddebt')
        const query = `
            SELECT user_id, 
                   GROUP_CONCAT(reservation_id ORDER BY reservation_id SEPARATOR ', ') AS reservation_ids
            FROM reservations
            WHERE status = ?
            AND is_active = TRUE
            GROUP BY user_id;
        `;
        const [result] = await db.query(query, [statusType]);

        if (!result.length) {
            console.log(`No ${statusType} reservations found.`);
            return;
        }

        // Get the threshold from settings table
        const thresholdQuery = `SELECT value FROM settings WHERE key_name = ?`;
        const [thresholdResult] = await db.query(thresholdQuery, [thresholdKey]);

        if (!thresholdResult.length) {
            console.error(`Threshold not found in settings for key: ${thresholdKey}`);
            return;
        }

        const threshold = parseInt(thresholdResult[0].value, 10);

        // Filter users who exceed the threshold
        // const usersAboveThreshold = result.filter(row => 
        //     row.reservation_ids && row.reservation_ids.split(', ').length > threshold
        // );
        const usersAboveThreshold = result
            .filter(row => row.reservation_ids && row.reservation_ids.split(', ').length > threshold)
            .map(row => ({
                user_id: row.user_id,
                reservation_ids: row.reservation_ids,
                type: statusType // Add "overdue" or "baddebt" as type
            }));

        if (usersAboveThreshold.length > 0) {
            //console.log(`Users exceeding ${statusType} threshold:`, usersAboveThreshold);
            // call the controller to handle the punishment\
            await overdueAndBadDebtController.applyPunishment(usersAboveThreshold);

        } else {
            console.log(`No users have exceeded the ${statusType} reservation threshold.`);
        }

    } catch (error) {
        console.error(`Error checking ${statusType} reservations:`, error);
    }
};

// Run these in a cron job
const checkOverdueReservations = async () => {
    await checkReservations('overdue', 'overdue_threshold');
};

const checkBadDebtReservations = async () => {
    await checkReservations('baddebt', 'bad_debt_threshold');
};

async function checkPunishmentExpiry() {
    try {
      // The single UPDATE query:
      const [result] = await db.query(`
        UPDATE user_punishments
        SET status = 'completed'
        WHERE status = 'active'
          AND duration_in_days IS NOT NULL
          AND DATE_ADD(applied_at, INTERVAL duration_in_days DAY) <= CURDATE()
      `);
  
      console.log(`Punishments updated to completed: ${result.affectedRows}`);
    } catch (error) {
      console.error('Error updating punishment statuses:', error);
    }
  }

//pms to run website locallt forever
//notifications to be sent to user when overdue

// Schedule the job to run every day at midnight
cron.schedule('37 10 * * *', () => {
    console.log('Running cron job');
    checkPunishmentExpiry();
    updateOverdueReservations();
    cancelNotCollectedReservations();
    resetReservationCount();
    checkOverdueReservations();
    checkBadDebtReservations();
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

app.use(async function(req, res, next) {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    //make user session data available from within view templates
    res.locals.user = req.session.user;//ejs can access the user object which has username and avatar

    
    if (req.session.user) {
        try {
            // Check punishment only if not checked recently (to prevent unnecessary API calls)
            if (!req.session.lastPunishmentCheck || Date.now() - req.session.lastPunishmentCheck > 5 * 60 * 1000) {
                const response = await axios.get(`http://localhost:3000/api/check-punishment/${req.session.user.username}`);
                req.session.hasDeactivationPunishment = response.data.deactivation;
                console.log("Punishment check response:", response.data.deactivation);
                req.session.lastPunishmentCheck = Date.now(); // Store timestamp
            }

            // If user has an active punishment (e.g., 'deactivation'), log them out immediately
            if (req.session.hasDeactivationPunishment) {
                req.flash('errors', 'Your account has been deactivated due to overdue/bad debt reservations.');
                // Remove only user-related properties so that the flash message remains
                delete req.session.user;
                delete req.session.hasDeactivationPunishment;
                req.session.save(() => {
                    return res.redirect('/');
                });
                return;
            }
            
        } catch (error) {
            console.error("Error checking user punishment:", error);
            req.session.hasPunishment = false; // Default to false in case of error
        }
    }




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






















