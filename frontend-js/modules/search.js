import axios from 'axios';

export default class Search{
    constructor() {
        this.injectHTML();
        this.searchIcon = document.querySelector('.search-icon');
        this.searchIcon2 = document.querySelector('.search-icon-2');

        this.resultOverlay = document.querySelector('.result-container');
        this.loaderIcon = document.querySelector('.loader-container');
        this.closeIcon = document.querySelector('.close-search');
        this.searchField = document.querySelector('#live-search-field');
        this.resultArea = document.querySelector('.result');
        this.typingWaitTimer;
        this.previousValue = '';
        this.events();
    }
    //dom to interact with the search form


    events() {
        this.searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            this.openOverlay();
        });
        this.closeIcon.addEventListener('click', () => this.closeOverlay());
        this.searchField.addEventListener('keyup', () => this.keyPressHandler());
    }

    //3. Methods
    keyPressHandler() {
        let value = this.searchField.value;
    

        if (value != '' && value != this.previousValue) {
            clearTimeout(this.typingWaitTimer);

            this.showLoaderIcon();
            this.resultArea.innerHTML = '';
            this.typingWaitTimer = setTimeout(() => {
                this.sendRequest();
            }, 500);
        }

        this.previousValue = value
    }

    sendRequest() {
        axios.post('/search', {searchTerm: this.searchField.value}).then((response) => {
            //over here we get the response from the server, which is information of the book.
            //we then display this information in the result container by using .innerHTML

        
            if (response.data.books.length == 0) {
                this.resultArea.innerHTML = `<p class="alert alert-danger text-center shadow-sm">No results found</p>`;
                this.hideLoaderIcon();
            } else {
                for (let i = 0; i < response.data.books.length; i++) {
                    this.resultArea.innerHTML += `<p>${i+1}</p>
                    <a href="/book/${response.data.books[i].book_id}" class="search-overlay__result">
                    <p class="search-overlay__result-title">${response.data.books[i].title}</p>
                    <p class="search-overlay__result-author">${response.data.books[i].author}</p>
                    </a>`;
                    
                    if(response.data.role == 'customer') {
                        this.resultArea.innerHTML += `<button class="btn btn-primary">Reserve</button>`;
                    }
                }
                this.hideLoaderIcon();
            }
        }).catch((error) => {
            console.log(error);
            alert('Hello, the request failed');
        })
    }

    showLoaderIcon() {
        this.loaderIcon.classList.add('loader-container--visible');
    }

    hideLoaderIcon() {
        this.loaderIcon.classList.remove('loader-container--visible');
    }

    openOverlay() {
        this.searchIcon2.classList.add('search-icon-2--visible');
        this.resultOverlay.classList.add('result-container--visible');

        setTimeout(() => this.searchField.focus(), 50); 
    }

    closeOverlay() {
        this.searchIcon2.classList.remove('search-icon-2--visible');
        this.resultOverlay.classList.remove('result-container--visible');
    }

    injectHTML() {
        document.body.insertAdjacentHTML('beforeend', 
         `<div class="search-icon-2 ">
             <i class="fas fa-search"></i>
             <input type="text" placeholder="Search" id="live-search-field">
             <span class="close-search"><i class="fas fa-times-circle"></i></span>
         </div>
         <div class="result-container ">
             <div class="loader-container">
                 <div class="loader"></div>
             </div>
 
             <div class="result">
             </div>
         </div>`);
     }
}