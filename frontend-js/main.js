import SearchAndReserve from './modules/SearchAndReserve.js';
import CancelReservation from './modules/CancelReservation.js';
import CollectAndReturn from './modules/CollectAndReturn.js';
import ReservationSearch from './modules/ReservationSearch.js';


if (document.querySelector('.search-icon')) {
    new SearchAndReserve();
}

if(document.querySelector('.user-reservation-table')) {
    new CancelReservation();
}

if(document.querySelector('.everyone-reservation-table')) {
    new CollectAndReturn();
}

if(document.querySelector('.everyone-reservation-table')) {
    new ReservationSearch();
}