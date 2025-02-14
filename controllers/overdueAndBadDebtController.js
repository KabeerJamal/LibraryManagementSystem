const Reservation = require('../models/Reservation');
const Punishment = require('../models/Punishment');
const reservationHelper = require('./helpers/reservationHelper');
const punishmentHelper = require('./helpers/punishmentHelper');


exports.overdueManagementPage = async (req, res) => {
    let reservations = await reservationHelper.getReservationDataAdmin();
    reservations = onlyOverdueAndBadDebt(reservations);
    let userRecordData = await reservationHelper.getUserRecordData();

    //call a function which gets data about the punishment selected by the admin 
    let punishmentData = await Punishment.getPunishmentData();
    console.log(punishmentData);
    const transformedPunishmentData = transformPunishmentData(punishmentData);
    console.log(transformedPunishmentData);

    //create a function which gets all punishment information from the database
    let getAllPunishments = await punishmentHelper.getAllPunishments();
    //console.log(getAllPunishments);

    
            
    res.render('overdueAndBadDebt.ejs', { 
        reservationsUser: userRecordData.reservations,
        reservations: reservations,
        AvailableCopiesText: false,
        partialSearchFilter: true,
        punishmentData: transformedPunishmentData,
        punishments: getAllPunishments
    });
}
    
exports.punishment = async (req, res) => {
    try {
        // Get the data from the form and send it to the database called punishment.js
        let data = req.body;
        let cleanData = Object.assign({}, data);
        let reservation = new Punishment(cleanData);
        await reservation.addSelectedPunishmentType();

        res.status(200).send({ message: 'Punishment added successfully' });
    } catch (error) {
        // Handle any errors that occur
        console.error(error);
        res.status(500).send({ message: 'An error occurred while adding punishment' });
    }
}

exports.applyPunishment = async (reqOrUsersAboveThreshold, res = null) => {
    let usersAboveThreshold;

    // Check if the function was called via an API request or directly
    if (Array.isArray(reqOrUsersAboveThreshold)) {
        // Called directly from app.js (cron job)
        usersAboveThreshold = reqOrUsersAboveThreshold;
    } else {
        // Called via an HTTP request
        usersAboveThreshold = reqOrUsersAboveThreshold.body.usersAboveThreshold;
    }

    //console.log("Users Above Threshold:", usersAboveThreshold);

    try {
        if (!usersAboveThreshold || usersAboveThreshold.length === 0) {
            console.log("No users to apply punishments.");
            if (res) return res.status(400).json({ message: "No users to apply punishments." });
            return;
        }

        // Call model function to add punishment data
        await Punishment.addUserAndReservation(usersAboveThreshold);

        if (res) {
            return res.status(200).json({ message: "Punishments applied successfully!" });
        }
    } catch (error) {
        console.error("Error applying punishments:", error);
        if (res) {
            return res.status(500).json({ message: "Internal server error." });
        }
    }
};

exports.punishmentCompletedFine = async (req, res) => {
    try{
        let userPunishmentId = req.body.userPunishmentId;
        await Punishment.punishmentCompletedFine(userPunishmentId);

        res.json({ message: 'Fine paid successfully' });
    } catch(err) {
        console.log(err);
    }
}

exports.punishmentCancelled = async (req, res) => {
    try{
        let userPunishmentId = req.body.userPunishmentId;
        await Punishment.punishmentCancelled(userPunishmentId);

        res.json({ message: 'Punishment cancelled successfully' });
    } catch(err) {
        console.log(err);
    }
}


function onlyOverdueAndBadDebt(reservations) {
    return reservations.filter(reservation => {
        return reservation.status === 'overdue' || reservation.status === 'baddebt';
    });
}



// Transform punishment data to the required format
// {
//     bad_debt: {
//       punishment_type: 'deactivation',
//       threshold: 7,
//       duration_in_days: 8
//     },
//     overdue: {
//       punishment_type: 'fine',
//       threshold: 9
//     }
//   }
function transformPunishmentData(punishmentData) {
    return punishmentData.reduce((acc, item) => {
        if (item.context === 'baddebt') {
            acc.BadDebt = {
                punishment_type: item.punishment_type,
                threshold: item.threshold,
                ...(item.duration_in_days && { duration_in_days: item.duration_in_days }) // Include duration_in_days only if it exists
            };
        } else if (item.context === 'overdue') {
            acc.Overdue = {
                punishment_type: item.punishment_type,
                threshold: item.threshold,
                ...(item.duration_in_days && { duration_in_days: item.duration_in_days }) // Include duration_in_days only if it exists
            };
        }
        return acc;
    }, {});
}
