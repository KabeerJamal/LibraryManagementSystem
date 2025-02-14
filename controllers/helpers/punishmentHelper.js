const Punishment = require('../../models/Punishment');

//create a function called getAllPunishments which gets all punishment information from the database
exports.getAllPunishments = async () => {
    try{
        let punishments = await Punishment.getAllPunishments();
        punishments.forEach(punishment => {
            punishment.punishmentActivationDate = formatDate(punishment.punishmentActivationDate);
        });
        return punishments;
    } catch (error) {
        console.error(error);
    }
   
};



//Helper function
// Function to format dates in YYYY-MM-DD format
function formatDate(dateString) {
    if (!dateString) {
        return null;
    }
    return new Date(dateString).toISOString().slice(0, 10);
}