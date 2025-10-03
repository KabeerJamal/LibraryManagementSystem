const Punishment = require('../../models/Punishment');

//create a function called getAllPunishments which gets all punishment information from the database
exports.getAllPunishments = async () => {
    try{
        let punishments = await Punishment.getAllPunishments();
        punishments = addEndingDate(punishments);
        punishments.forEach(punishment => {
            punishment.punishmentActivationDate = formatDate(punishment.punishmentActivationDate);
            punishment.punishmentEndDate = formatDate(punishment.punishmentEndDate);
        });
        return punishments;
    } catch (error) {
        console.error(error);
        return []; // Return empty array instead of undefined
    }
   
};



function addEndingDate(punishments) {
    return punishments.map(punishment => {
        if (punishment.duration) {
            let endDate = new Date(punishment.punishmentActivationDate);
            endDate.setDate(endDate.getDate() + punishment.duration);
            punishment.punishmentEndDate = endDate;
        }
        return punishment;
    });
}


//Helper function
// Function to format dates in YYYY-MM-DD format
function formatDate(dateString) {
    if (!dateString) {
        return null;
    }
    return new Date(dateString).toISOString().slice(0, 10);
}