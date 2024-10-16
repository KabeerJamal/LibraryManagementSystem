import axios from 'axios';

export default class ReservationSearch {
    constructor() {
        this.searchField = document.querySelector('#live-search-field');
        this.typingWaitTimer;
        this.previousValue = '';
        this.reservationResults = document.querySelectorAll('.all-reservations-table-body')[0];

        this.reservationStatus = document.getElementById('reservation-status');
        this.rows = document.querySelectorAll('.all-reservations-table-body tr');
        this.events();
    }

    events() {
        this.searchField.addEventListener('keyup', () => this.keyPressHandler());

        this.reservationStatus.addEventListener('change',() => {
            this.updateTableFilter(this.reservationStatus.value);
        })

    }

    keyPressHandler() {
        let value = this.searchField.value;
    

        if (value != '' && value != this.previousValue) {
            clearTimeout(this.typingWaitTimer);

            this.typingWaitTimer = setTimeout(() => {
                this.sendRequest();
            }, 500);
        }

        this.previousValue = value
    }

    sendRequest() {
        axios.post('/searchReservation', {searchTerm: this.searchField.value}).then((response) => {
            //I want to render the reservations to the page
            //console.log(response.data.reservation);
            this.updateTable(response.data.reservation);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }


    //Helper method to update the table
    updateTable(reservations) {
        // Clear existing rows
        this.reservationResults.innerHTML = '';

        // Append new rows
        reservations.forEach(reservation => {
            if (reservation.status !== 'completed' && reservation.status !== 'overdue') {
                const row = `
                    <tr>
                        <td data-number="${reservation.user_id}">
                        ${reservation.username}
                        </td>
                        <td data-number="${reservation.book_id}">
                        ${reservation.title}
                        </td>
                        <td class="status" data-number="${reservation.reservation_id}">
                        ${reservation.status}
                        </td>
                        <td>${this.formatDate(reservation.reserve_date)}</td>
                        <td>
                             ${(reservation.collect_date) ? this.formatDate(reservation.collect_date) : '<button class="collect" data-number="' + reservation.reservation_id + '">Collect</button>'}
                        </td>
                        <td class="returned-at" data-number="${reservation.reservation_id}">
                        ${reservation.returned_at ? this.formatDate(reservation.returned_at) : ''}
                        </td>
                        <td class="return-date" data-number="${reservation.reservation_id}">
                            ${this.formatDate(reservation.return_date)}
                            ${reservation.returned_at == null && reservation.collect_date != null ? '<button class="return" data-number="' + reservation.reservation_id + '">Returned?</button>' : ''}
                        </td>
                        <td>${this.formatDate(reservation.collect_date_deadline)}</td>
                    </tr>
                `;  
                this.reservationResults.innerHTML += row;
            }
            else {
                const row = `
                    <tr>
                        <td data-number="${reservation.user_id}">
                        ${reservation.username}
                        </td>
                        <td data-number="${reservation.book_id}">
                        ${reservation.title}
                        </td>
                        <td class="status" data-number="${reservation.reservation_id}">
                        ${reservation.status}
                        </td>
                        <td>${this.formatDate(reservation.reserve_date)}</td>
                        <td>
                        ${this.formatDate(reservation.collect_date)}
                        ${reservation.collect_date == null ? '<button class="collect" data-number="' + reservation.reservation_id + '">Collect</button>' : ''}
                        </td>
                        <td class="returned-at" data-number="${reservation.reservation_id}">
                         ${reservation.returned_at ? this.formatDate(reservation.returned_at) : ''}
                        </td>
                        <td class="return-date" data-number="${reservation.reservation_id}">
                        ${this.formatDate(reservation.return_date)}
                        ${reservation.status !== 'overdue' 
                        ? (reservation.returned_at === null 
                        ? '<button class="return" data-number="' + reservation.reservation_id + '">Returned?</button>' 
                        : '') 
                        : ''
                        }
                        </td>
                        <td>${this.formatDate(reservation.collect_date_deadline)}</td>
                        `;  
                this.reservationResults.innerHTML += row;
            }
        });
    }

    updateTableFilter(status) {
        if (status === 'all') {
            this.rows.forEach(row => {
                row.style.display = ''; // Show all rows
            });
            return;
        }

        this.rows.forEach(row => {
            row.style.display = ''; // Show all rows
        });

        this.rows.forEach(row => {
            const statusCell = row.querySelector('.status');
            if (!(statusCell.textContent.trim() == status)) {
                row.style.display = 'none';
            }
        })
    }

    //Helper function
    // Function to format dates in YYYY-MM-DD format
    formatDate(dateString) {
        if (!dateString) {
            return '';
        }

        return new Date(dateString).toISOString().slice(0, 10) 
        
        
    }
    
}


