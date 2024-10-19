import axios from 'axios';

export default class ReservationSearch {
    constructor() {
        this.searchField = document.querySelector('#live-search-field');
        this.typingWaitTimer;
        this.previousValue = '';
        this.reservationResults = document.querySelectorAll('.all-reservations-table-body')[0];

        this.reservationStatus = document.getElementById('reservation-status');
        this.rows = document.querySelectorAll('.all-reservations-table-body tr');
        this.currentFilter = "all"; // Track the current filter
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
                this.searchReservation();
                //this.sendRequest();
            }, 500);
        } else if (value == '') {
            //The else if shows all the reservations(of the filter) when the search field is empty
            clearTimeout(this.typingWaitTimer);

            this.typingWaitTimer = setTimeout(() => {
                this.updateTableFilter(this.currentFilter);
                //this.sendRequest();
            }, 500);        
        }

        

        this.previousValue = value
    }

    //Backend search
    sendRequest() {
        axios.post('/searchReservation', {searchTerm: this.searchField.value}).then((response) => {
            //I want to render the reservations to the page
            console.log(response.data.reservation);
            this.updateTable(response.data.reservation);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }
    

    //Front end search
    searchReservation() {
        let arr = [];

        // Apply the filter first to ensure we search through all filtered rows, not just previously visible ones
        this.updateTableFilter(this.currentFilter);

        //could use this.currentFilter to filter the rows
        const rowsToSearch = Array.from(this.rows).filter(row => row.style.display !== 'none');

        rowsToSearch.forEach(row => {
            let obj = {};
            // Assuming row is an HTML element, row.children will give you the child elements
            //obj.author = row.children[0].textContent.trim();
            obj.username = row.children[0].textContent.trim();
            obj.book_id = row.children[1].getAttribute('data-number');
            obj.collect_date =  row.children[6].textContent.trim();
            obj.collect_date_deadline = row.children[7].textContent.trim();
            obj.reservation_id = row.children[2].getAttribute('data-number');
            obj.reserve_date = row.children[3].textContent.trim();
            obj.return_date =  row.children[6].textContent.trim();
            obj.returned_at =  row.children[5].textContent.trim();
            obj.status = row.children[2].textContent.trim();
            obj.title =  row.children[1].textContent.trim(); 
            obj.user_id = row.children[0].getAttribute('data-number');

            arr.push(obj);
        });
        this.filterData(arr, this.searchField.value);
    }
    
    filterData(arr, value) {
        let filteredData = arr.filter(row => {
            return row.username.toLowerCase().includes(value.toLowerCase()) || row.title.toLowerCase().includes(value.toLowerCase());
        });
        this.updateTable(filteredData);
    }

    //Helper method to update the table
    updateTable(reservations) {
        // Clear existing rows
        //this.reservationResults.innerHTML = '';
        if (reservations == null) {
            return;
        }

        /*
        // Append new rows
        reservations.forEach(reservation => {
            /*
            if (reservation.status !== 'completed' && reservation.status !== 'overdue') {
                const row = `
                    <tr>
                        <td class="name" data-number="${reservation.user_id}">
                        ${reservation.username}
                        </td>
                        <td class = "title" data-number="${reservation.book_id}">
                        ${reservation.title}
                        </td>
                        <td class="status" data-number="${reservation.reservation_id}">
                        ${reservation.status}
                        </td>
                        <td class = "reserve-date" >${this.formatDate(reservation.reserve_date)}</td>
                        <td class = "collect-date" >
                             ${(reservation.collect_date) ? this.formatDate(reservation.collect_date) : '<button class="collect" data-number="' + reservation.reservation_id + '">Collect</button>'}
                        </td>
                        <td class="returned-at" data-number="${reservation.reservation_id}">
                        ${reservation.returned_at ? this.formatDate(reservation.returned_at) : ''}
                        </td>
                        <td class="return-date" data-number="${reservation.reservation_id}">
                            ${this.formatDate(reservation.return_date)}
                            ${reservation.returned_at == null && reservation.collect_date != null ? '<button class="return" data-number="' + reservation.reservation_id + '">Returned?</button>' : ''}
                        </td>
                        <td class="collect-date-deadline">${this.formatDate(reservation.collect_date_deadline)}</td>
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
        */
        this.rows.forEach(row => {
            // Get the unique identifier (reservation_id) from the row
            const reservationId = row.querySelector('.status').getAttribute('data-number');
    
            // Check if this row exists in the filtered data
            const match = reservations.find(reservation => reservation.reservation_id == reservationId);
    
            // If there's a match, show the row; otherwise, hide it
            if (match) {
                row.style.display = ''; // Show the row
            } else {
                row.style.display = 'none'; // Hide the row
            }
        });
        
    }

    updateTableFilter(status, searchValue) {
        this.currentFilter = status; // Track the current filter
        if (status === 'all') {
            this.rows.forEach(row => {
                row.style.display = ''; // Show all rows
                console.log("hi");
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


