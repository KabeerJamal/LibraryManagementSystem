import axios from 'axios';

export default class SearchAndReserve{
    constructor() {
        this.injectHTML();
        this.settings= {};
        this.fetchSettings();
        
       
        this.searchIcon = document.querySelector('.search-icon');
        this.searchIcon2 = document.querySelector('.search-icon-2');

        this.reserveBtn = document.querySelectorAll('.btn-primary');
        this.modal = document.getElementById('modal');
        this.closeBtn = document.getElementsByClassName('close');
        this.reserveFinalBtn = document.getElementById('#reserve');
        this.storeResponseData = [];
        this.storeResponseData2 = [];//to avoid add to cart more than once error.
        //to avoid error of pressing checkout twice:
        this.reservationTransactionCompleted = false;
        
        this.storeResponseDataSingle = [];

        //to determine we are in userPortal or adminPortal
        this.userPortal = false;
        this.cartItems = document.querySelector('.cart-items');
        if (!(this.cartItems == null)) {
            this.userPortal = true;
        }
        this.reserveMultiple = document.getElementById('reserve-multiple');

        this.resultOverlay = document.querySelector('.result-container');
        this.loaderIcon = document.querySelector('.loader-container');
        this.closeIcon = document.querySelector('.close-search');
        this.searchField = document.querySelector('#live-search-field');
        this.resultArea = document.querySelector('.result');
        this.typingWaitTimer;
        this.logoutButton = document.getElementById('btn-logout');
        
        
        this.previousValue = '';
        
     
        


        //display is set already so i set it to none.
        document.getElementById('flash-message').style.display = 'none';
        
        this.processedBookIds = new Set();//used in function remove book from cart and show book id
        //to make sure add to cart displays even after page refresh
        this.showBookId();

        
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

        this.logoutButton.addEventListener('click', () => {sessionStorage.clear();});

         // Event delegation: Listen for clicks on any .btn-primary buttons, even if added dynamically
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-primary')) {
                const number = e.target.getAttribute('data-number');
                this.openModal(number);
            }

            if(e.target.classList.contains('btn-add-to-cart')) {
                const number = e.target.getAttribute('data-number');
                this.storeAndShowBookId(number); //(line 230)

            }
            if(e.target.classList.contains('close')) {
                this.modal.style.display = 'none';
            }

            // Reserve button in modal
            if(e.target.id === 'reserve') {
                this.sendRequestToReserve( this.formatDataOfResponseSingle(this.storeResponseDataSingle));
                
            }

            if(e.target.classList.contains('remove-book')) {
                this.removeBookFromCart(e.target);
            }

           
            
        });

        document.addEventListener('DOMContentLoaded', () => {
            // Code to run when the page is loaded or refreshed
            const observer = new MutationObserver((mutationsList, observer) => {
                const cartItems = document.querySelectorAll('.cart-item');
                if (cartItems.length > 0) {
                   // console.log(cartItems);  // Now .cart-item elements should be available
                    this.updateNumberOfCopiesPageReload();//the input for number of copies for each book in the cart is updated(using session storage)
                    observer.disconnect(); // Stop observing after the items are found
                }
            });
        
            // Start observing the body for added nodes
            observer.observe(document.body, { childList: true, subtree: true });
        });

        document.body.addEventListener('change', (e) => {
            if(e.target.classList.contains('copies')){
                this.addCopiesToSessionStorage(e.target.parentElement);
            }
        });

        this.reserveMultiple.addEventListener('click', () => {
            if(!this.checkIfCartIsEmpty()) {
                this.sendRequestToReserve( this.formatDataOfResponse(this.storeResponseData));
            }
            //this.emptyCart();
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

        if(value == '') {
            this.resultArea.innerHTML = '';
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
                    // this.resultArea.innerHTML += `<div class="result-item">
                    // <p>${i+1}</p>
                    // <a href="/book/${response.data.books[i].book_id}" class="search-overlay__result">
                    // <p class="search-overlay__result-title">${response.data.books[i].title}</p>
                    // <p class="search-overlay__result-author">${response.data.books[i].author}</p>
                    // </a>`;
                    
                    // if(response.data.role == 'customer') {
                    //     this.resultArea.innerHTML += `<button class="btn btn-primary" data-number="${response.data.books[i].book_id}">Reserve</button>`;//(line 45)
                    //     this.resultArea.innerHTML += `<button class="btn btn-add-to-cart" data-number="${response.data.books[i].book_id}">Add to Cart</button>
                    //     </div>`;//(below line 45)
                    // } else {
                    //     this.resultArea.innerHTML += `</div>`;  // Closing the div for non-customers
                    // }

                    // Open the div for each result item
                    let bookHtml = `<div class="result-item">
                    <a href="/book/${response.data.books[i].book_id}" class="search-overlay__result">
                        <p class="search-overlay__result-title">${response.data.books[i].title}</p>
                        <p class="search-overlay__result-author">By ${response.data.books[i].author}</p>
                    </a>`;

                    // If user is a customer, add buttons inside the same div
                    if (response.data.role == 'customer') {
                    bookHtml += `
                    <button class="btn btn-primary" data-number="${response.data.books[i].book_id}">Reserve</button>
                    <button class="btn btn-add-to-cart" data-number="${response.data.books[i].book_id}">Add to Cart</button>`;
                    }

                    // Close the div regardless of role
                    bookHtml += `</div>`;

                    // Append the full HTML for the book
                    this.resultArea.innerHTML += bookHtml;

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

        //gets info of book from database and showcase it in the modal
        axios.post('/book/' + bookId, {dontRender : true}).then((response) => {
            this.storeResponseDataSingle.push(response.data);
           
            const listItem = document.createElement('li');
            listItem.textContent = response.data.bookInformation.title + ' - ' + response.data.bookInformation.author + ' - ' + response.data.bookInformation.available_copies + ' copies available';
            bookCopies.appendChild(listItem);
        }).catch(() => {
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
    async sendRequestToReserve(data) {
        //console.log('sendRequestToReserve called');
        //console.log(data)     

        if(!this.checkNumberOfCopies(data)) {
            //console.log('this code running');
            this.showFlashMessage(`You can only reserve up to ${this.settings.copy_limit} copies in total`, true);
            return;
        }

        
        // Check if the user has an active "No Reservations" punishment
        const hasNoReservationsPunishment = await this.checkUserPunishment(data.customer.userName);
        if (hasNoReservationsPunishment.noReservations) {
            this.showFlashMessage("You cannot make a reservation due to an active punishment.", true);
            return;
        }


        axios.post('/reserve', {userName: data.customer.userName,
            books: data.customer.books}).then((response) => {
            this.modal.style.display = 'none';
            //console.log(response.data);
            if (response.data.success) {
                this.showFlashMessage('Book reserved');
                sessionStorage.clear();
                this.processedBookIds = new Set();
                this.reservationTransactionCompleted = true;
                this.showBookId(); 
            } else {
                this.showFlashMessage(response.data.message, true);
                //CAN IMPROVE USER INTERFACE HERE
                sessionStorage.clear();
                this.processedBookIds = new Set();
                
                this.showBookId(); 
            }
        }).catch((error) => {
            this.showFlashMessage('Reservation failed. Please try again.', true);
        });
    }

    injectHTML() {
        //console.log('HTML injected');
    }



    storeAndShowBookId(bookId) {
        
        let bookIds = sessionStorage.getItem('bookIds');
        let numberOfCopiesToReserve = sessionStorage.getItem('numberOfCopiesToReserve');
        // Initialize `numberOfCopiesToReserve` if not set
        if (!numberOfCopiesToReserve) {
            numberOfCopiesToReserve = [];
        } else {
            numberOfCopiesToReserve = JSON.parse(numberOfCopiesToReserve);
        }

        if (bookIds == "" || bookIds == null) {
            sessionStorage.setItem('bookIds', bookId);
            numberOfCopiesToReserve.push("1"); // Default to 1 copy for the first book
            sessionStorage.setItem('numberOfCopiesToReserve', JSON.stringify(numberOfCopiesToReserve));
        } else {
            bookIds = bookIds.split(',');
            if (bookIds.length >= this.settings.book_limit) {
                this.showFlashMessage(`You can only reserve up to ${this.settings.book_limit} books at a time`, true);
                return;
            }
            // Check if the copy limit has been reached
            const totalCopies = numberOfCopiesToReserve.reduce((acc, copies, idx) => {
                return  acc + parseInt(copies);
            }, 0);

            if (totalCopies + 1 > this.settings.copy_limit) {
                this.showFlashMessage(`You can only reserve up to ${this.settings.copy_limit} copies in total`, true);
                return;
            }
            if (!bookIds.includes(bookId)) {
                bookIds.push(bookId);
                sessionStorage.setItem('bookIds', bookIds);
                numberOfCopiesToReserve.push(1); // Add default 1 copy for the new book
                sessionStorage.setItem('numberOfCopiesToReserve', JSON.stringify(numberOfCopiesToReserve));
                //console.log(sessionStorage);
            } else {
                //console.log('this code running');
                this.showFlashMessage('Book already added to cart', true);
            }
        }
        
        //store such that it is an array of bookIds
        //if already reserved book add to cart, Just give a flash message.
        //show the bookId in the console
        this.showBookId();

    }

    showBookId() {
        //console.log("testing")
        //get inforamtion from database of the book by for looping through the bookIds,
        //showcase it here.
        //increase or decrease the number of copies.
        //show available copies of the book

        
            //then send a request to reserve the book.
        let bookIds = sessionStorage.getItem('bookIds');
        //console.log(bookIds);
        if(bookIds) {
            bookIds = bookIds.split(',');
            //console.log(bookIds);

            // Maintain a set of already displayed book IDs
            this.processedBookIds = this.processedBookIds;

            const newBookIds = bookIds.filter(bookId => !this.processedBookIds.has(bookId));


            if (newBookIds.length === 0) {
                return; // No new books to fetch
            }
            Promise.all(

                newBookIds.map(bookId => axios.post('/book/' + bookId, { dontRender: true }))
            ).then((responses) => {
                // `responses` is an array of responses from the axios calls
                responses.forEach((response,index) => {
                    const bookId = newBookIds[index];
                    this.processedBookIds.add(bookId); // Mark this book as processed
                    this.storeResponseData.push(response.data);//store the response data,which we use later to send a request to reserve the book.
                    // Append each book's information to the front-end display
                    this.cartItems.innerHTML += `
                        <tr class="cart-item">
                        <td>
                        <p>${response.data.bookInformation.title} 
                        ${response.data.bookInformation.author}</p>
                        </td>
                        <td>
                        <p>${response.data.bookInformation.available_copies} copies available</p>
                        </td>
                        <td>
                            <label for="copies_${response.data.bookInformation.book_id}">Number of copies:</label>
                            <input type="number" class="copies" 
                                name="copies" min="1" max="${response.data.bookInformation.available_copies}" value="">
                        </td>
                        <td>
                            <button data-number="${response.data.bookInformation.book_id}" class= "remove-book" >Remove from cart</button>
                        </td>
                        </tr>
                    `;

                });
                this.updateNumberOfCopiesPageReload();
            }).catch((error) => {
                console.error("Error fetching book information:", error);
            });
        }
        else {
            if (this.userPortal) {
                this.cartItems.innerHTML = '';//if no books in session storage
            }
        }
}

    /*
    removeBookFromCart(target) {
        let bookIdToRemove = target.getAttribute('data-number');
        let bookIds = sessionStorage.getItem('bookIds').split(',');
        bookIds = bookIds.filter(bookId => bookId != bookIdToRemove);
        this.processedBookIds.delete(bookIdToRemove);
        sessionStorage.setItem('bookIds', bookIds);
        target.parentElement.remove();
    }*/
    removeBookFromCart(target) {
            let bookIdToRemove = target.getAttribute('data-number');
            let bookIds = sessionStorage.getItem('bookIds').split(',');
            let numberOfCopiesToReserve = JSON.parse(sessionStorage.getItem('numberOfCopiesToReserve'));
        
            // Find the index of the bookId to remove
            const indexToRemove = bookIds.indexOf(bookIdToRemove);
        
            if (indexToRemove !== -1) {
                // Remove the bookId and its corresponding number of copies
                bookIds.splice(indexToRemove, 1);
                numberOfCopiesToReserve.splice(indexToRemove, 1);
        
                // Update sessionStorage
                sessionStorage.setItem('bookIds', bookIds.join(','));
                sessionStorage.setItem('numberOfCopiesToReserve', JSON.stringify(numberOfCopiesToReserve));

                this.storeResponseData = this.storeResponseData.filter(data => data.bookInformation.book_id != bookIdToRemove);

            }
            
            // Remove the book from the UI
            this.processedBookIds.delete(bookIdToRemove);

            target.parentElement.parentElement.remove();
    }
        
    formatDataOfResponseSingle(data) {
        let formattedData = data.reduce((result, data) => {
        
            // Check if the username already exists in the result object
            if (!result["customer"]) {
                result["customer"] = {
                    userName: data.customer,
                    books: []
                };
            }

            // Add the book to the user's books array
            result["customer"].books.push({
                bookId: data.bookInformation.book_id,
                numberOfCopiesToReserve: 1
            });

            return result;
        }, {});

        this.storeResponseDataSingle = [];
        return formattedData;
    }

    formatDataOfResponse(data){
        //console.log('formatDataOfResponse called');
        // console.log(this.storeResponseData);
        // console.log("should be same")
        // console.log(data);
        //console.log(sessionStorage);
        //console.log('hello');
        //console.log(data);

       
        this.storeResponseData2 = data;
        let formattedData = data.reduce((result, data) => {
            // Parse session storage data
            let bookIds = sessionStorage.getItem('bookIds').split(',');
            let numberOfCopiesToReserve = JSON.parse(sessionStorage.getItem('numberOfCopiesToReserve'));
        
            // Find the index of the current bookId
            const index = bookIds.indexOf(data.bookInformation.book_id.toString());
            const numberOfCopies = numberOfCopiesToReserve[index];
        
            // Check if the username already exists in the result object
            if (!result["customer"]) {
                result["customer"] = {
                    userName: data.customer,
                    books: []
                };
            }

            // Add the book to the user's books array
            result["customer"].books.push({
                bookId: data.bookInformation.book_id,
                numberOfCopiesToReserve: numberOfCopies
            });

            return result;
        }, {});

        if(this.reservationTransactionCompleted){
            this.storeResponseData = [];
        }
        return formattedData;
        
        //this.storeResponseData2 = formattedData;
        //SINCE YOU ARE CHANGING THIS.RESPONSEDATA, PRESSING CHECKOUT TWICE CAN LEAD TO AN ERROR.

        /*
        Expected Output:
        {
            "customerName1": {
                userName: "customerName1",
                books: [
                    { bookId: "1", numberOfCopiesToReserve: 2 },
                    { bookId: "2", numberOfCopiesToReserve: 1 }
                ]
            },
            "customerName2": {
                userName: "customerName2",
                books: [
                    { bookId: "3", numberOfCopiesToReserve: 4 }
                ]
            }
        }
        */
        
        /*
            [{username:customer name,books: [{bookid: numberOfCopies}]}]
        */ 
    }

    addCopiesToSessionStorage(value) {
        let button = value.parentElement.querySelector('button'); // Select the button element within the div
        // console.log("button");
        // console.log(button);
        let bookIdToUpdate = button.getAttribute('data-number'); // Get the value of the data-number attribute
        // console.log("bookIdToUpdate");
        // console.log(bookIdToUpdate);

        // let input = value.querySelector('input'); // or value.querySelector('.copies');
        // let bookIdToUpdate = input.value;
        // console.log("bookIdToUpdate");
        // console.log(bookIdToUpdate);

        let bookIds = sessionStorage.getItem('bookIds').split(',');
        console.log("bookIds");
        console.log(bookIds);
        let numberOfCopiesToReserve = JSON.parse(sessionStorage.getItem('numberOfCopiesToReserve'));

        const indexToUpdate = bookIds.indexOf(bookIdToUpdate);

        if (indexToUpdate !== -1) {
            // Add value.querySelector('input').value with all values in numberOfCopiesToReserve and subtract
            // from it numberOfCopiesToReserve[indexToUpdate]
            const newValue = parseInt(value.querySelector('input').value);
            const totalCopies = numberOfCopiesToReserve.reduce((acc, copies, idx) => {
                return idx === indexToUpdate ? acc : acc + parseInt(copies);
            }, 0);

            if (totalCopies + newValue > this.settings.copy_limit) {
                this.showFlashMessage(`You can only reserve up to ${this.settings.copy_limit} copies in total`, true);
                //return;
            }

            numberOfCopiesToReserve[indexToUpdate] = newValue;
            numberOfCopiesToReserve[indexToUpdate] = value.querySelector('input').value;
    
            // Update sessionStorage
            sessionStorage.setItem('bookIds', bookIds.join(','));
            sessionStorage.setItem('numberOfCopiesToReserve', JSON.stringify(numberOfCopiesToReserve));
        }

    }

    updateNumberOfCopiesPageReload() {
       // console.log('updateNumberOfCopiesPageReload called');
        let bookIds = sessionStorage.getItem('bookIds');
        if(bookIds) {
            bookIds = bookIds.split(',');
            let numberOfCopiesToReserve = JSON.parse(sessionStorage.getItem('numberOfCopiesToReserve'));
            //console.log(numberOfCopiesToReserve);
            let cartItems = document.querySelectorAll('.cart-item');
            //console.log(cartItems);
            
            cartItems.forEach((item, index) => {
                item.querySelector('input').value = numberOfCopiesToReserve[index];
            });
        }
    }

    checkIfCartIsEmpty() {
        if(sessionStorage.getItem('bookIds') == null) {
            this.showFlashMessage('Cart is empty', true);
            return true;
        } else {
            return false;
        }
    }

    
    //Helper function to show flash message when book succesfully reserved/or not
    showFlashMessage(message, isError = false) {
        const flashMessage = document.getElementById('flash-message');
        flashMessage.textContent = message;
        if(isError){

            flashMessage.classList.add('message-error');
            flashMessage.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {

            flashMessage.classList.add('message-success');
            flashMessage.style.animation = 'fadeIn 0.5s ease-in-out';

        }

        flashMessage.style.display = 'block';
    
        setTimeout(() => {
            flashMessage.style.animation = 'fadeOut 0.5s ease-in-out';
          }, 3000);

        setTimeout(() => {
            flashMessage.style.display = 'none';
            if(isError){
                flashMessage.classList.remove('message-error');
            } else {
                flashMessage.classList.remove('message-success');
            }
        }, 3500); // Hide after 3 seconds

       
    }


    async fetchSettings() {
        try {
           const response = await axios.get('/api/settings')
            //console.log('Settings fetched:', response.data);
            this.settings = response.data;
            // console.log('Settings:', this.settings);
            //console.log('Settings:', this.settings);
            // Use the settings in your front-end application
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    }

    checkNumberOfCopies(data) {
        
        let totalCopiesToReserve = 0;
        
        data.customer.books.forEach(book => {
            book.numberOfCopiesToReserve = parseInt(book.numberOfCopiesToReserve, 10);
            //console.log(book);
            totalCopiesToReserve += book.numberOfCopiesToReserve;
        });
        console.log(totalCopiesToReserve);
        if (totalCopiesToReserve > this.settings.copy_limit) { 
            return false
        }
        return true;
    }

    async checkUserPunishment(userName) {
        try {
            const response = await axios.get(`/api/check-punishment/${userName}`);
            const result = response.data;
            return result; // true or false
        } catch (error) {
            console.error("Error checking punishment:", error);
            return false; // Assume no punishment in case of an error
        }
    }
}








//Question: when we refresh how do we get data from session storage to show number of copies in the cart.
/**Originally, the page reload was defaulting the number of copies to 0. To fix this, I created the updateNumberOfCopiesPageReload function.
 *  However, since the .cart-item elements were added dynamically, the function didn't work initially. To address this, I used a MutationObserver 
 * to observe changes in the body and trigger the function when the cart items were added. This approach resolved the issue.
 *  */

