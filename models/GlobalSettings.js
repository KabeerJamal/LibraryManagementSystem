const db = require('../db.js');

class GlobalSettings {
    constructor(booklimit, copylimit, reservationLimitDay) {
        this.booklimit = booklimit;
        this.copylimit = copylimit;
        this.reservationLimitDay = reservationLimitDay;
    }

    //Reservation line 322 and 340
    async updateReservationLimit() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `
                INSERT INTO settings (key_name, value)
                VALUES ('book_limit', ?), ('copy_limit', ?), ('reservation_limit_day',?)
                ON DUPLICATE KEY UPDATE 
                    value = VALUES(value);
                `;
                const values = [this.booklimit, this.copylimit, this.reservationLimitDay];
                await db.query(query, values);
                resolve();
            } catch(e) {
                reject(e);
            }
        });
    }

    static async getReservationLimit() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM settings WHERE key_name = "book_limit" OR key_name = "copy_limit" OR key_name = "reservation_limit_day"';
                let [rows] = await db.query(query);
                resolve(rows);
            } catch(e) {
                reject(e);
            }
        });
    }


    //Now code for choosing the days for collect and return deadline.
    static async updateDeadline(type, value) {
        const connection = await db.getConnection(); // Get a database connection for transactions
        try {
            await connection.beginTransaction(); // Start transaction
    
            // Step 1: Update the settings table
            const updateSettingsQuery = `
                INSERT INTO settings (key_name, value)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE 
                    value = VALUES(value);
            `;
            await connection.query(updateSettingsQuery, [type, value]);
    
            // Step 2: Modify the return_date virtual column
            const alterTableQuery = `
                ALTER TABLE reservations 
                MODIFY COLUMN return_date DATE GENERATED ALWAYS AS (DATE_ADD(collect_date, INTERVAL ? DAY)) VIRTUAL;
            `;
            await connection.query(alterTableQuery, [value]); // Apply new interval
    
            await connection.commit(); // Commit transaction if both succeed
            connection.release();
        } catch (error) {
            await connection.rollback(); // Rollback transaction on failure
            connection.release();
            throw error; // Re-throw error for handling
        }
    }
    


}

module.exports = GlobalSettings;