import SearchBookAndReserve from './modules/SearchBookAndReserve.js';
import CancelReservation from './modules/CancelReservation.js';
import CollectAndReturn from './modules/CollectAndReturn.js';
import ReservationSearch from './modules/ReservationSearch.js';


if (document.querySelector('.search-icon')) {
    new SearchBookAndReserve();
}

if(document.querySelector('.user-reservation-table')) {
    new CancelReservation();
}

if(document.querySelector('.everyone-reservation-table')) {
    new CollectAndReturn();
}

//User reservation details.ejs and borrower details.ejs
if(document.querySelector('.everyone-reservation-table') || document.querySelector('.user-reservation-table')) {
    new ReservationSearch();
}