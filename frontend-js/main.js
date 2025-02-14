import SearchBookAndReserve from './modules/SearchBookAndReserve.js';
import CancelReservation from './modules/CancelReservation.js';
import CollectAndReturn from './modules/CollectAndReturn.js';
import ReservationSearch from './modules/ReservationSearch.js';
import ReservationDisplay from './modules/ReservationDisplay.js';
import UserRecordSearch from './modules/UserRecordSearch.js';
import Punishment from './modules/Punishment.js';
import PunishmentDisplay from './modules/PunishmentDisplay.js';
import ReturnAndCollectDeadline from './modules/ReturnAndCollectDeadline.js';


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
    new ReservationDisplay();
}

if(document.querySelector('.user-record-table')) {
    new UserRecordSearch();
}

if(document.getElementById('punishmentTypeBadDebt') || document.getElementById('punishmentTypeOverdue')) {
    new Punishment();
}

if(document.querySelector('.all-punishments-table-body')) {
    new PunishmentDisplay();
}

if(document.querySelector('.return-deadline') || document.querySelector('.collect-deadline')) {
    new ReturnAndCollectDeadline();
}