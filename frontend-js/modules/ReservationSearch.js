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
        this.applyFilterAndSearch(); // Apply both filter and search logic
    }

    // Method to handle both search and filter together
    applyFilterAndSearch() {
        let searchTerm = this.searchField.value.trim().toLowerCase(); // Store search term
        let status = this.currentFilter; // Get the current filter status

        // Iterate over all rows
        this.rows.forEach(row => {
            const statusCell = row.querySelector('.status').textContent.trim();
            const username = row.children[0].textContent.trim().toLowerCase();
            const title = row.children[1].textContent.trim().toLowerCase();

            // Determine if the row matches the current filter
            const matchesFilter = (status === 'all') || (statusCell === status);

            // Determine if the row matches the search term (check both username and title)
            const matchesSearch = (!searchTerm) || username.includes(searchTerm) || title.includes(searchTerm);

            // If both filter and search match, show the row, otherwise hide it
            if (matchesFilter && matchesSearch) {
                row.style.display = ''; // Show row
            } else {
                row.style.display = 'none'; // Hide row
            }
        });
    }
    


    updateTableFilter(status, searchValue) {
        this.currentFilter = status; // Set the current filter
        this.applyFilterAndSearch(); // Apply both filter and search logic
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


