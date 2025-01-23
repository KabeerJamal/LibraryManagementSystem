const Reservation = require('../../models/Reservation');

exports.getReservationDataAdmin = async () => {
    let reservations = await Reservation.borrowerDetails();
    return getReservationDataHelper(reservations);
};
exports.getReservationDataUser = async (userName) => {
    const userId = await Reservation.getUserIdWoCreatingObject(userName);
    let reservations = await Reservation.getUserReservations(userId);
    return getReservationDataHelper(reservations);
};

exports.getUserRecordData = async () => {
    let reservations = await Reservation.borrowerDetails();
    //console.log("Reservations: ", reservations); // Debug log
    reservations = userRecordTable(reservations);
    //console.log(reservations);
    let reservationLimit = await Reservation.getReservationLimit();
    let bookLimit = reservationLimit[0].value;
    let copyLimit = reservationLimit[1].value;
    let reservationLimitDay = reservationLimit[2].value;

    return {
        reservations,
        bookLimit,
        copyLimit,
        reservationLimitDay
    };
};

function getReservationDataHelper(reservations) {
    //console.log("Reservations: ", reservations); // Debug log
    reservations = modifyReservationsTable(reservations);
    reservations.forEach(reservation => {
        //console.log(reservation.books);
        reservation.reserve_date = formatDate(reservation.reserve_date);
        reservation.collect_date = formatDate(reservation.collect_date);
        reservation.collect_date_deadline = formatDate(reservation.collect_date_deadline);
        reservation.return_date = formatDate(reservation.return_date);
        if (reservation.returned_at) {
            reservation.returned_at = formatDate(reservation.returned_at);
        }
    });
    return reservations;
}



//Helper function
/**
 * Modifies the reservations table by grouping reservations based on reservation_id.
 * Each reservation will have a list of books associated with it.
 *
 * @param {Array} reservations - An array of reservation objects.
 * @param {number} reservations[].reservation_id - The ID of the reservation.
 * @param {number} reservations[].user_id - The ID of the user who made the reservation.
 * @param {string} reservations[].borrower_name - The name of the borrower.
 * @param {string} reservations[].status - The status of the reservation.
 * @param {string} reservations[].reserve_date - The date the reservation was made.
 * @param {string} reservations[].collect_date - The date the reservation was collected.
 * @param {string} reservations[].collect_date_deadline - The deadline for collecting the reservation.
 * @param {string} reservations[].return_date - The date the reservation was returned.
 * @param {number} reservations[].book_id - The ID of the book.
 * @param {number} reservations[].number_of_copies - The number of copies of the book.
 * @param {string} reservations[].book_title - The title of the book.
 * @param {string} reservations[].author - The author of the book.
 *
 * @returns {void}
 */
function modifyReservationsTable(reservations) {
    //console.log(reservations);
    const groupedReservations = reservations.reduce((acc, reservation) => {
        // Check if the reservation_id already exists in the accumulator
        if (!acc[reservation.reservation_id]) {
          // Initialize the structure for a new reservation_id
          acc[reservation.reservation_id] = {
            reservation_id: reservation.reservation_id,
            user_id: reservation.user_id,
            borrower_name: reservation.borrower_name,
            status: reservation.status,
            reserve_date: reservation.reserve_date,
            collect_date: reservation.collect_date,
            collect_date_deadline: reservation.collect_date_deadline,
            return_date: reservation.return_date,
            returned_at: reservation.returned_at,
            books: [] // Initialize books array
          };
        }
      
        // Add the current book details to the books array
        acc[reservation.reservation_id].books.push({
          book_id: reservation.book_id,
          number_of_copies: reservation.number_of_copies,
          book_title: reservation.book_title,
          author: reservation.author
        });
      
        return acc;
      }, {});
      
      // Convert the accumulator object into an array
      const result = Object.values(groupedReservations);
      return result;
      
}


//Helper function
// Function to format dates in YYYY-MM-DD format
function formatDate(dateString) {
    if (!dateString) {
        return null;
    }
    return new Date(dateString).toISOString().slice(0, 10);
}



/**
 * Generates a table of user records with counts of reservation statuses.
 *
 * @param {Array} reservations - An array of reservation objects.
 * @param {string} reservations[].borrower_name - The name of the borrower.
 * @param {string} reservations[].status - The status of the reservation.
 * @returns {Object} An object where each key is a borrower's name and the value is an object
 *                   with keys as statuses and values as counts of those statuses.
 */
function userRecordTable(reservations) {
    const statuses = ['completed', 'overdue', 'baddebt', 'reserved', 'collected', 'cancelled']; // Define all possible statuses

    const statusCounts = reservations.reduce((acc, reservation) => {
    const { borrower_name, status } = reservation;

    // Initialize the borrower with all statuses set to 0
    if (!acc[borrower_name]) {
        acc[borrower_name] = {};
        statuses.forEach(s => acc[borrower_name][s] = 0); // Set all statuses to 0
    }

    // Increment the specific status count
    acc[borrower_name][status]++;
    
    return acc;
    }, {});

    return statusCounts;
}


