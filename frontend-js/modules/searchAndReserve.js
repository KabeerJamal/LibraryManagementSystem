import axios from 'axios';

export default class SearchAndReserve{
    constructor() {
        this.injectHTML();
        this.searchIcon = document.querySelector('.search-icon');
        this.searchIcon2 = document.querySelector('.search-icon-2');

        this.reserveBtn = document.querySelectorAll('.btn-primary');
        this.modal = document.getElementById('modal');
        this.closeBtn = document.getElementsByClassName('close');
        this.reserveFinalBtn = document.getElementById('#reserve');
        this.storeResponseData = null;

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

         // Event delegation: Listen for clicks on any .btn-primary buttons, even if added dynamically
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-primary')) {
                const number = e.target.getAttribute('data-number');

                this.openModal(number);
            }
            if(e.target.classList.contains('close')) {
                this.modal.style.display = 'none';
            }

            // Reserve button in modal
            if(e.target.id === 'reserve') {
                this.sendRequestToReserve();
                
            }
        });


        window.addEventListener('click', (e) => {this.closeModal(e)});
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
            if (response.data.books == undefined) {
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
                        this.resultArea.innerHTML += `<button class="btn btn-primary" data-number="${response.data.books[i].book_id}">Reserve</button>`;
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

    openModal(bookId) {
        
        this.modal.style.display = 'block';

         // Insert available copies into the modal
        const bookCopies = document.getElementById('bookCopies');
        bookCopies.innerHTML = ''; // Clear the previous list

        axios.post('/book/' + bookId, {dontRender : true}).then((response) => {
            this.storeResponseData = response.data;
            const listItem = document.createElement('li');
            listItem.textContent = response.data.bookInformation.title + ' - ' + response.data.bookInformation.author + ' - ' + response.data.bookInformation.available_copies + ' copies available';
            bookCopies.appendChild(listItem);
        }).catch((error) => {
            console.log(error);
            alert('Hello, the request failed');
        });
        
        //send an axios request, to get the available copies of the book, once you get the books, showcase them here
        //create another button in modal which says reserve, and when clicked, send a post request to the server to reserve the book
    }

    
    closeModal(e) {
        if (e.target == this.modal) {
            this.modal.style.display = 'none';
        }
    }

    /*
      gets data from handleresponse. 
      Sends this information via router to reservation controller.
      Reservation controller then sends this information to the model.
      Model then stores this information in the database.
    */
    sendRequestToReserve() {
        let data = this.storeResponseData;
        axios.post('/reserve', {bookId: data.bookInformation.book_id, userName : data.customer, numberOfCopiesToReserve: 1}).then((response) => {
            this.modal.style.display = 'none';
            if (response.data == 'Book reserved') {
                this.showFlashMessage('Book reserved');
            } else {
                this.showFlashMessage('Error reserving book', true);
            }
        }).catch((error) => {
            console.log(error);
            this.showFlashMessage('Reservation failed. Please try again.', true);
        });
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

     //Helper function to show flash message when book succesfully reserved/or not
    showFlashMessage(message, isError = false) {
        const flashMessage = document.getElementById('flash-message');
        flashMessage.textContent = message;
        flashMessage.classList.toggle('error', isError);
        flashMessage.style.display = 'block';
    
        setTimeout(() => {
            flashMessage.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }
}