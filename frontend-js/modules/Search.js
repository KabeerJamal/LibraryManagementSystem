

export default class Search {
    constructor(activeTables) {
 

        const tableFilterMap = {
            '.everyone-reservation-table': ['reservation-status'], // Shared filter
            '.user-reservation-table': ['reservation-status'],     // Shared filter
            '.punishments-table': ['punishment-type-filter', 'status-filter', 'reservation-status-filter'] // Multiple filters
        };//also need ot make change in filterFunctions in applyFilterAndSearch

        // Create a map where the table element is the key and the corresponding search field is the value
        this.tableSearchMap = {};
        for (let [selector, searchFieldId] of Object.entries(activeTables)) {
            const tableElement = document.querySelector(selector);
            const searchField = document.querySelector(`#${searchFieldId}`);
            const filterElements = (tableFilterMap[selector] || []).map(id => document.getElementById(id)).filter(el => el !== null); // Get multiple filters
            // Store filters as an object with element-value pairs
            const filterMap = {};
            filterElements.forEach(filter => {
                filterMap[filter.id] = filter.value; // Store filter ID and its current value
            });
    

            if (tableElement && searchField && Object.keys(filterMap).length) {
                this.tableSearchMap[selector] = {
                    tableElement,
                    searchField,
                    filters: filterMap // Store filter elements with their values
                };
            }
        }
        //console.log(this.tableSearchMap);   
    

        if (!Object.keys(this.tableSearchMap).length) {
            console.error("No valid tables or search fields found.");
            return;
        }

        this.typingWaitTimer;
        this.previousValue = '';


        //console.log(Object.entries(this.tableSearchMap));

        //display is set already so i set it to none.
        document.getElementById('flash-message').style.display = 'none';

        this.events();
    }

    events() {

        for (let [selector, { tableElement, searchField, filters }] of Object.entries(this.tableSearchMap)) {
           

            searchField.addEventListener('keyup', () => {
                 //I want to get the corresponding filterElements values in array form from this.tableSearchMap
                this.keyPressHandler(searchField, tableElement,filters)
            });

 
            Object.keys(filters).forEach(filterElement => {
                //this.tableSearchMap, i want to change the value of the corresponding  filterElement to filterElement.value
        
                document.getElementById(filterElement).addEventListener('change', () =>{

                    //change the filter value of the filter changed
                    filters[filterElement] = document.getElementById(filterElement).value;

                    this.updateTableFilter(filters,searchField, tableElement)
                } );
            });
        }//need to test if this works and then proceed.
    }

    keyPressHandler(searchField,tableElement,filters) {
        let value = searchField.value;

    
        if (value != '' && value != this.previousValue) {
            clearTimeout(this.typingWaitTimer);

            this.typingWaitTimer = setTimeout(() => {
                this.searchReservation(searchField,tableElement,filters);
                //this.sendRequest();
            }, 500);
        } else if (value == '') {
            //The else if shows all the reservations(of the filter) when the search field is empty
            clearTimeout(this.typingWaitTimer);

            this.typingWaitTimer = setTimeout(() => {
                //only shit to solve
                this.updateTableFilter(filters,searchField,tableElement);
                //this.sendRequest();
            }, 500);        
        }

        

        this.previousValue = value
    }

    //Front end search
    searchReservation(searchField,tableElement,filters) {
        this.applyFilterAndSearch(searchField,tableElement,filters); // Apply both filter and search logic
    }

    // Method to handle both search and filter together
    applyFilterAndSearch(searchField,tableElement,filters) {
        let searchTerm = searchField.value.trim().toLowerCase(); // Store search term
        //let status = this.currentFilter; // Get the current filter status

        let rows = tableElement.querySelectorAll("tbody tr");
        //console.log(Object.keys(this.tableSearchMap))
        //console.log(tableElement.className);
    // 🎯 Define a lookup object that maps table class names to their respective functions
    const filterFunctions = {
        "everyone-reservation-table": this.searchOverRowsUserAndEveryOne,
        "user-reservation-table": this.searchOverRowsUserAndEveryOne,
        "punishments-table": this.searchOverRowsPunishment
    };

    // 🎯 Get the correct function based on tableElement's class
    let filterFunction = filterFunctions[tableElement.className];
    // 🔹 Call the function dynamically if it exists, else log an error
    if (filterFunction) {
        //console.log(filters);
        filterFunction.call(this, rows, searchTerm, filters);
    } else {
        console.error(`No filter function found for table class: ${tableElement.className}`);
    }    
    }
    


    updateTableFilter(filters, searchField,tableElement) {
        //this.currentFilter = status; // Set the current filter
        this.applyFilterAndSearch(searchField, tableElement,filters); // Apply both filter and search logic
    }

    // //Helper function
    // // Function to format dates in YYYY-MM-DD format
    // formatDate(dateString) {
    //     if (!dateString) {
    //         return '';
    //     }

    //     return new Date(dateString).toISOString().slice(0, 10) 
        
    // }

    searchOverRowsUserAndEveryOne(rows, searchTerm, filters) {
        //console.log(searchTerm);
        rows.forEach(row => {
          
            const statusCell = row.querySelector('.status').textContent.trim();

            //get the reservation id
            const reservationId = row.querySelector('.status').getAttribute('data-number');


            let fieldsToSearch = [];

            fieldsToSearch.push(reservationId);
        
            // Determine if the row matches the current filter
            const matchesFilter = (filters['reservation-status'] === 'all') || (statusCell === filters['reservation-status']);
    
            // Determine if the row matches the search term in any of the specified fields
            const matchesSearch = (!searchTerm) || fieldsToSearch.some(field => field.includes(searchTerm));
    
            // Show or hide the row based on filter and search match
            row.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
        });
    }

    searchOverRowsPunishment(rows, searchTerm, filters) {
        rows.forEach(row => {
            const statusCell = row.querySelector('.status').textContent.trim();//overdue or baddebt
            const typeOfPunishmentCell = row.querySelector('.punishment-type').textContent.trim();//fine or baddebt
            const punishmentStatus = row.querySelector('.punishment-status').textContent.trim();//active or inactive

            //get the punishment id
            const punishmentId = row.querySelector('.punishment-number').getAttribute('data-number');


            let fieldsToSearch = [];

            fieldsToSearch.push(punishmentId);//fix searhcing numbers numerically

            const filterMapping ={
                "reservation-filter" : filters["reservation-status-filter"],
                "punishment-type-filter" : filters["punishment-type-filter"],
                "punishment-status-filter" : filters["status-filter"]
            }

            
            // 🎯 Match filters dynamically
            const matchesStatus = this.isStatusMatch(filterMapping["reservation-filter"], statusCell);
            const matchesTypeOfPunishment = this.isStatusMatch(filterMapping["punishment-type-filter"], typeOfPunishmentCell);
            const matchesPunishmentStatus = this.isStatusMatch(filterMapping["punishment-status-filter"], punishmentStatus);

            // 🎯 A row is visible only if it matches all active filters
            const matchesAllFilters = matchesStatus && matchesTypeOfPunishment && matchesPunishmentStatus;
            const matchesSearch = (!searchTerm) || fieldsToSearch.some(field => field.includes(searchTerm));

            row.style.display = (matchesAllFilters && matchesSearch) ? "" : "none";
        });
    }
    
    //helper function
    // Helper function to check if two statuses match using equivalence groups
    isStatusMatch(filterValue, cellValue) {
        const statusEquivalents = {
            'active': ['active', 'Active', 'ACTIVE'],
            'inactive': ['inactive', 'Inactive', 'INACTIVE', 'completed', 'Completed', 'COMPLETED'],
            'baddebt': ['baddebt', 'Baddebt', 'BADDEBT', 'bad debt', 'Bad debt', 'BAD DEBT', 'bad-debt', 'Bad-debt', 'BAD-DEBT'],
            'overdue': ['overdue', 'Overdue', 'OVERDUE', 'over-due', 'Over-due', 'OVER-DUE'],
            'fine': ['fine', 'Fine', 'FINE'],
            'noReservations': ['no-reservations', 'No-reservations', 'NO-RESERVATIONS', 'no reservations', 'No reservations', 'NO RESERVATIONS', "No Reservations"],
            'deativation-all': ['deactivation-all', 'Deactivation-all', 'DEACTIVATION-ALL', 'deactivation all', 'Deactivation all', 'DEACTIVATION ALL', 'Deactivation All']
        };

        if (filterValue === "all") return true;
    
        // If there's a group defined for the filter, check if cellValue is included.
        if (statusEquivalents[filterValue]) {
        return statusEquivalents[filterValue].includes(cellValue);
        }
        
        // Fallback to a direct comparison if no group is defined.
        return filterValue === cellValue;
    }
  
}


