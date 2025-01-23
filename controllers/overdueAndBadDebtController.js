const Reservation = require('../models/Reservation');
const reservationHelper = require('./helpers/reservationHelper');

exports.overdueManagementPage = async (req, res) => {
    let reservations = await reservationHelper.getReservationDataAdmin();
    reservations = onlyOverdueAndBadDebt(reservations);
    let userRecordData = await reservationHelper.getUserRecordData();
            
    res.render('overdueAndBadDebt.ejs', { 
        reservationsUser: userRecordData.reservations,
        reservations: reservations,
        AvailableCopiesText: false,
        partialSearchFilter: true
    });
    
}


function onlyOverdueAndBadDebt(reservations) {
    return reservations.filter(reservation => {
        return reservation.status === 'overdue' || reservation.status === 'baddebt';
    });
}