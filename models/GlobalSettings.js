const db = require('../db.js');

class GlobalSettings {
    constructor(data){
        this.data = data;
    }

    //Reservation line 322 and 340
    async updateReservationLimit(booklimit,copylimit, reservationLimitDay) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `
                INSERT INTO settings (key_name, value)
                VALUES ('book_limit', ?), ('copy_limit', ?), ('reservation_limit_day',?)
                ON DUPLICATE KEY UPDATE 
                    value = VALUES(value);
                `;
                const values = [booklimit, copylimit, reservationLimitDay];
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
        return new Promise(async (resolve, reject) => {
            try {
                const query = `
                INSERT INTO settings (key_name, value)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE 
                    value = VALUES(value);
                `;
                const values = [type, value];
                await db.query(query, values);
                resolve();
            } catch(e) {
                reject(e);
            }
        });
    }



}

module.exports = GlobalSettings;