const Reservation = require('../models/Reservation');
const reservationHelper = require('./helpers/reservationHelper');

exports.borrowerDetails = async (req, res) => {
  try {
    // let reservations = await Reservation.borrowerDetails();
    // //console.log("Reservations: ", reservations); // Debug log
    // reservations = modifyReservationsTable(reservations);
    // reservations.forEach(reservation => {
    //     //console.log(reservation.books);
    //     reservation.reserve_date = formatDate(reservation.reserve_date);
    //     reservation.collect_date = formatDate(reservation.collect_date);
    //     reservation.collect_date_deadline = formatDate(reservation.collect_date_deadline);
    //     reservation.return_date = formatDate(reservation.return_date);
    //     if (reservation.returned_at) {
    //         reservation.returned_at = formatDate(reservation.returned_at);
    //     }
    // });
    //console.log(reservations);
    let reservations = await reservationHelper.getReservationDataAdmin();

    
    res.render('borrowerDetails.ejs', { reservations, AvailableCopiesText: false , partialSearchFilter: false});
  } catch (error) {
    console.error("Error loading reservation details:", error); // Log error to console
    res.status(500).send("Error loading reservation details");
  }
};
    //Over here you create an object of Reservation model(or the function in reservation model is static and then you dont need to create an object) and then you call the function borrowerDetails from the model
    //Use try,catch block to handle errors(So in model if the function resolves, try block runs and if it rejects, catch block runs)
    //make sure to use await keyword.

    //then go to Reservation.js in models folder

    //you will receive data from reservation model, you render that data to the borrowerDetails.ejs file(you have to create new file)
    //and then you show the data in the ejs file

    //for reference look into bookDetails function in the bookController.js file and see how it works in cojunction with the book model "receiveBookDetails" function and also see how it renders data to the ejs file


//create a function reserveBook in reservationController.js 
exports.reserveBook = async (req, res) => {
    //over here you create object of reservation model, where you pass in hte information
    try {
        const reservation = new Reservation(req.body);
        
        let reservationCount = await reservation.reserveBook();
        res.send({ success: true, reservationCount });
    } catch(e) {
        console.log(e);
        res.send({ success: false, message: e });
    }
    
};

exports.userReservationDetails = async (req, res) => {
    try {
        let reservations = await reservationHelper.getReservationDataUser(req.session.user.username);

        // const userId = await Reservation.getUserIdWoCreatingObject(req.session.user.username);
        // let reservations = await Reservation.getUserReservations(userId);
        // reservations = modifyReservationsTable(reservations);
        // reservations.forEach(reservation => {
        //     reservation.reserve_date = formatDate(reservation.reserve_date);
        //     reservation.collect_date = formatDate(reservation.collect_date);
        //     reservation.collect_date_deadline = formatDate(reservation.collect_date_deadline);
        //     reservation.return_date = formatDate(reservation.return_date);
        //     if (reservation.returned_at) {
        //         reservation.returned_at = formatDate(reservation.returned_at);
        //     }
        // });

        res.render('userReservationDetails.ejs', { reservations, AvailableCopiesText: false , partialSearchFilter: false});
    } catch(e) {
        console.log(e);
        res.send('Error getting user reservations');
    }
};

exports.collectBook = async (req, res) => { 
    try {
        //send reservation id to Reservation model function.
        await Reservation.bookCollected(req.params.reservation_id);

        //the model function wil get that specific reservation and in it ,update the collect date and chnage status

        res.json('Book collected');
        
    } catch(e) {
        res.json('Error collecting book');
    }
}

exports.returnBook = async (req, res) => {
    try {
        //in req, you will get the variable telling if the status was overdue or not, pass it to model
        //send reservation id to Reservation model function.
        const result = await Reservation.bookReturned(req.params.reservation_id);
        //the model function wil get that specific reservation and in it ,update the return date and chnage status
        //response should be based on if status was overdue or not(then line 81, collect and return)
        if (result == 'overdue') {
            res.json('OverdueBookReturned');
        } else {
            res.json('Book returned');
        }
    } catch(e) {
        res.json('Error returning book');
    }
}

exports.cancelReservation = async (req, res) => {
    try {
        //send reservation id to Reservation model function.
        await Reservation.cancelReservation(req.params.reservation_id);
        //the model function wil get that specific reservation and in it ,update the status to cancelled
        res.json('Reservation cancelled');
    } catch(e) {
        res.json('Error cancelling reservation');
    }
}


exports.searchReservations = async (req, res) => {
    try {
        const reservationInfo = await Reservation.searchReservations(req.body.searchTerm);
        //console.log(reservationInfo);
        if (reservationInfo.length == 0) {
            res.json('');
            return;
        }
        res.json({reservation: reservationInfo})
        //    , role: req.session.user.role}); -> could implement this in fuuture.


    } catch (error) {
        console.log(error);
    }
}


exports.badDebt = async (req, res) => {
    try {
        //send reservation id to Reservation model function.
        await Reservation.badDebt(req.params.reservation_id);
        //the model function wil get that specific reservation and in it ,update the status to bad debt
        res.json('Bad debt recorded');
    } catch(e) {
        res.json('Error recording bad debt');
    }
}

exports.userRecord = async (req, res) => {
    try {
        let userRecordData = await reservationHelper.getUserRecordData();
        
        res.render('userRecord.ejs', { 
            reservationsUser: userRecordData.reservations,
            bookLimit: userRecordData.bookLimit,
            copyLimit: userRecordData.copyLimit,
            reservationLimitDay: userRecordData.reservationLimitDay
        });
    } catch (error) {
        console.error("Error loading reservation details:", error); // Log error to console
        res.status(500).send("Error loading reservation details");
    }
}



exports.updateReservationLimit = async (req, res,next) => {
    try {
        const { bookLimit, copyLimit, reservationLimitDay } = req.body; // Extract limits from the request body

        // Call the function to update the reservation limits
        await Reservation.updateReservationLimit(bookLimit, copyLimit, reservationLimitDay);
        next();
    } catch(e) {
        res.json('Error updating reservation limit');
    }
}