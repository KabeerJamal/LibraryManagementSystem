export default class UserRecordSearch {
    constructor() {
        this.searchIcon = document.querySelector('.search-icon');
        this.searchField = document.querySelector('#live-search-field-userRecord');
        this.typingWaitTimer;
        
        this.previousValue = '';
        this.rows = document.querySelectorAll('.user-record-table tr');

        this.events();
    }

    events() {
        this.searchField.addEventListener('keyup', () => this.keyPressHandler());
        console.log('UserRecordSearch module loaded');
    }


    keyPressHandler() {
        let value = this.searchField.value;
    

        if (value != '' && value != this.previousValue) {
            clearTimeout(this.typingWaitTimer);

            //this.showLoaderIcon();
            //this.resultArea.innerHTML = '';
            this.typingWaitTimer = setTimeout(() => {
                this.searchUser();
            }, 500);
        } else if (value == '') {
            //The else if shows all the reservations(of the filter) when the search field is empty
            clearTimeout(this.typingWaitTimer);

            //this.showLoaderIcon();
            //this.resultArea.innerHTML = '';
            this.typingWaitTimer = setTimeout(() => {
                this.searchUser();
            }, 500);        
        }

        this.previousValue = value
    }



    searchUser() {
        let searchTerm = this.searchField.value;

        if(searchTerm == '') {
            this.rows.forEach(row => {
                row.style.display = '';
            });
            return;
        }   
        this.rows.forEach(row => {
            if(!row.classList.contains('record-row')) return;
            if (row.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}