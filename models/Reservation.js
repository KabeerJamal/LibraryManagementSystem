const db = require('../db.js');

class Reservation{
    constructor(data) {
        this.data = data;
        this.errors = [];
    }
    
    //You can make the function static, that way you can call the function without creating an object of the class
    //Over here you create a function borrower details which you already called  in the controller
    //Make sure you are returning a promise from the function, look other functions in the model for reference
    //in the function you get all data of reservation from the database via sql query and then you resolve the promise

    //It should be similar to receiveBookDetails function in the Books model(only difference is that you are getting all the data of reservation from the database)
    //So look into the Books model receiveBookdetials funciton for reference
}