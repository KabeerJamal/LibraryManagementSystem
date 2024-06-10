const db = require('../db.js');
//this is where we interact with the database
class User {
    constructor(name, age, email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }

    // Add methods and properties here

    //Just to test if running this function actually inserts the user into the database
    async testing() {
        try {
            // Insert user information into the database
            const query = 'INSERT INTO users (name, age, email) VALUES (?, ?, ?)';
            const values = [this.name, this.age, this.email];
            await db.query(query, values);
            console.log('User information inserted successfully');
        } catch (error) {
            console.error('Error inserting user information:', error);
        }
    }
}

module.exports = User