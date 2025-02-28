import SearchBookAndReserve from './modules/SearchBookAndReserve.js';
import CancelReservation from './modules/CancelReservation.js';
import CollectAndReturn from './modules/CollectAndReturn.js';
import Search from './modules/Search.js';
import ReservationDisplay from './modules/ReservationDisplay.js';
import UserRecordSearch from './modules/UserRecordSearch.js';
import Punishment from './modules/Punishment.js';
import PunishmentDisplay from './modules/PunishmentDisplay.js';
import ReturnAndCollectDeadline from './modules/ReturnAndCollectDeadline.js';

const tableSearchMap = { 
    '.everyone-reservation-table': 'live-search-field-everyone',
    '.user-reservation-table': 'live-search-field-user',
    '.punishments-table': 'live-search-field-punishment'
};


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
    new ReservationDisplay();
}

// Filter only the tables that exist on the page
const activeTableSearchMap = Object.fromEntries(
    Object.entries(tableSearchMap).filter(([tableSelector]) => {
        return document.querySelector(tableSelector)
    })//if the table exists, add it to the activeTableSearchMap
    //tableSelector is the first element of the array, which is the key
    //Object.fromEntries converts the array back to an object
);

// If there are active tables, instantiate the class
if (Object.keys(activeTableSearchMap).length > 0) {
    new Search(activeTableSearchMap);
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