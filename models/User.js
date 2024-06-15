const db = require('../db.js');
const validator = require('validator');
//this is where we interact with the database


/**
 * Represents a user in the system.
 */
class User {
    constructor(data, role) {
        this.errors = [];
        this.data = data;
        this.role = role;
    }

    // Add methods and properties here

    /**
     * Registers a new user by adding their information to the database.
     * 
     * @returns {Promise<void>} A promise that resolves when the user is successfully registered.
     * @throws {Error} If an error occurs while registering the user.
     */
    register() {
        return new Promise(async (resolve, reject) => {
            this.cleanUp();
            await this.validate();
            //add information in database
            if (this.errors.length == 0) {
                try {
                    await db.query('INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)', [this.data.username, this.data.email, this.data.password, this.role, new Date()]);
                    resolve();
                } catch (error) {
                    console.error('Error occurred in User model:', error);
                    reject();
                }
            } else {
                reject(this.errors);
            }
           
        });
    }

    /**
     * Logs in the user.
     * @returns {Promise<string>} A promise that resolves to a success message if the login is successful, or rejects with an error message if the login fails.
     */
    login() {
        return new Promise(async (resolve, reject) => {
            this.cleanUp();
            let user = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [this.data.username, this.data.password]);
            console.log(user);
            if (user[0].length > 0) {
                resolve('Successfully logged in');
            } else {
                reject('Invalid username or password');
            }
        });
    }

    /**
     * Cleans up the user data by removing any bogus properties and ensuring that the username, email, and password are of type string.
     */
    cleanUp() {
        if (typeof(this.data.username) != "string") {this.data.username = "";}
        if (typeof(this.data.email) != "string") {this.data.email = "";}
        if (typeof(this.data.password) != "string") {this.data.password = "";}

        //get rid of any bogus properties
        this.data = {
            username: this.data.username.trim().toLowerCase(),
            email: this.data.email.trim().toLowerCase(),
            password: this.data.password
        }
    }

    /**
     * Validates the user data.
     * @returns {Promise<void>} A promise that resolves when the validation is complete.
     */
    validate() {
        return new Promise(async (resolve, reject) => {
            if(this.data.username == "") {this.errors.push("You must provide a username")}
            if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers")}
            if(!validator.isEmail(this.data.email)) {this.errors.push("You must provide a email")}
            if(this.data.password == "") {this.errors.push("You must provide a password")}
            if(this.data.password.length > 0 && this.data.password.length < 6) {this.errors.push("Password must be at least 6 characters")}
            if(this.data.password.length > 50) {this.errors.push("Password cannot exceed 50 characters")}
            if(this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("Username must be at least 3 characters")}
            if(this.data.username.length > 30) {this.errors.push("Password cannot exceed 30 characters")}

            //only if username is valid then check to see if it is already taken
            if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
                    let usernameExists = await db.query('SELECT * FROM users WHERE username = ?', [this.data.username]);
                    console.log(usernameExists);
                    if (usernameExists[0].length > 0) {this.errors.push("That username is already taken.")}
            }

            //only if email is valid then check to see if it is already taken
            if (validator.isEmail(this.data.email)) {
                    let emailExists = await db.query('SELECT * FROM users WHERE email = ?', [this.data.email]);
                    if (emailExists[0].length > 0) {this.errors.push("That email is already being used.")}
            }
            resolve();
        })
    }
}
module.exports = User;