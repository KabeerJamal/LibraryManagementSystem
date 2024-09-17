const Reservation = require('../models/Reservation');

//UMER INSTRUCTIONS
exports.borrowerDetails = (req, res) => {
    //Over here you create an object of Reservation model(or the function in reservation model is static and then you dont need to create an object) and then you call the function borrowerDetails from the model
    //Use try,catch block to handle errors(So in model if the function resolves, try block runs and if it rejects, catch block runs)
    //make sure to use await keyword.

    //then go to Reservation.js in models folder

    //you will receive data from reservation model, you render that data to the borrowerDetails.ejs file(you have to create new file)
    //and then you show the data in the ejs file

    //for reference look into bookDetails function in the bookController.js file and see how it works in cojunction with the book model "receiveBookDetails" function and also see how it renders data to the ejs file
};

//create a function reserveBook in reservationController.js 
exports.reserveBook = async (req, res) => {
    //over here you create object of reservation model, where you pass in hte information
    try {
        const reservation = new Reservation(req.body);
        await reservation.reserveBook();
        res.send('Book reserved');
    } catch(e) {
        console.log(e);
        res.send('Error reserving book');
    }
    
};

exports.userReservationDetails = async (req, res) => {
    try {
        //console.log(req.session.user.username);
        const userId = await Reservation.getUserIdWoCreatingObject(req.session.user.username);
        const reservations = await Reservation.getUserReservations(userId);
        console.log(reservations);
        res.render('userReservationDetails.ejs', {reservations});
    } catch(e) {
        console.log(e);
        res.send('Error getting user reservations');
    }
};