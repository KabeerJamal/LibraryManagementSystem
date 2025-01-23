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
                        this.resultArea.innerHTML += `<button class="btn btn-primary" data-number="${response.data.books[i].book_id}">Reserve</button>`;//(line 45)
                        this.resultArea.innerHTML += `<button class="btn btn-add-to-cart" data-number="${response.data.books[i].book_id}">Add to Cart</button>`;//(below line 45)
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
    sendRequestToReserve(data) {     
        //console.log(data);

        if(!this.checkNumberOfCopies(data)) {
            this.showFlashMessage(`You can only reserve up to ${this.settings.copy_limit} copies in total`, true);
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
        document.body.insertAdjacentHTML('beforeend', 
          `<div class="search-icon-2 ">
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
                        <div class="cart-item">
                        <button data-number="${response.data.bookInformation.book_id}" class= "remove-book" >Remove from cart</button>
                        <p>${response.data.bookInformation.title} 
                        ${response.data.bookInformation.author}</p>
                        <p>${response.data.bookInformation.available_copies} copies available</p>
                        <label for="copies_${response.data.bookInformation.book_id}">Number of copies:</label>
                        <input type="number" class="copies" 
                               name="copies" min="1" max="${response.data.bookInformation.available_copies}" value="">
                        </div>
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
            }
        
            // Remove the book from the UI
            this.processedBookIds.delete(bookIdToRemove);
            target.parentElement.remove();
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
        //console.log(this.storeResponseData);
        //console.log(sessionStorage);

       

       
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

        this.storeResponseData = [];
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
        let button = value.querySelector('button'); // Select the button element within the div
        let bookIdToUpdate = button.getAttribute('data-number'); // Get the value of the data-number attribute
        let bookIds = sessionStorage.getItem('bookIds').split(',');
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
        let bookIds = sessionStorage.getItem('bookIds');
        if(bookIds) {
            bookIds = bookIds.split(',');
            let numberOfCopiesToReserve = JSON.parse(sessionStorage.getItem('numberOfCopiesToReserve'));
            let cartItems = document.querySelectorAll('.cart-item');
            
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

        } else {

            flashMessage.classList.add('message-success');

        }

        flashMessage.style.display = 'block';
    
        setTimeout(() => {
            flashMessage.style.display = 'none';
            if(isError){
                flashMessage.classList.remove('message-error');
            } else {
                flashMessage.classList.remove('message-success');
            }
        }, 3000); // Hide after 3 seconds

       
    }


    async fetchSettings() {
        try {
           const response = await axios.get('/api/settings')

            this.settings = response.data;
            //console.log('Settings:', this.settings);
            // Use the settings in your front-end application
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    }

    checkNumberOfCopies(data) {
        
        let totalCopiesToReserve = 0;

        data.customer.books.forEach(book => {
            //book.numberOfCopiesToReserve = parseInt(book.numberOfCopiesToReserve, 10);
            //console.log(book);
            totalCopiesToReserve += book.numberOfCopiesToReserve;
        });
        //console.log(totalCopiesToReserve);
        if (totalCopiesToReserve > this.settings.copy_limit) { 
            return false
        }
        return true;
    }
}








//Question: when we refresh how do we get data from session storage to show number of copies in the cart.
/**Originally, the page reload was defaulting the number of copies to 0. To fix this, I created the updateNumberOfCopiesPageReload function.
 *  However, since the .cart-item elements were added dynamically, the function didn't work initially. To address this, I used a MutationObserver 
 * to observe changes in the body and trigger the function when the cart items were added. This approach resolved the issue.
 *  */


//(tomm) test cron job code. do similar for bad debt. you are in step 2 of gpt session storage.







//Tasks

//(1) So in reservation details, in overdue, i have the option of collected(option to select form paid fine/lost book).(done)
// also can do a user search which gives record of how many bad debts, good debts.(done)
// a option where admin can select amount of fines/penalties for a limit to overdue books automatically(like a no show option or pay money).
// a option to set reservation limit(how many books and how many copies of each book can be reserved at a time)(done)
//a option to deactivate\activate users at a time 
// if user has status overdue, he cant reserve more books.
//Deactive and activate users option/disable option(user gets logged out).
//pressing checkouy twice can lead to error.(this.storeResponseData)
//userRecord-> if you press the user, see that users reservation details with his name in search field.
//helper function in controller
//There should be active and inactive types of reservations(for bad debt and overdue), also those which are inactive, go to past reservaitons(which is implemented later). once punishment completed, current active overdue and baddebt become inactive. eventually shit becomes inactive.

//2)
//admin can set how many days after the reservation and after collecting, the book is supposed to be collected and returned respectfully.(then need to make change in both frontend and backend. admin decides and we set those numbers in database and in frontend CollectAndReturn.js)
//current reservations follow old deadline while new reservations follow new deadline.^
//send notifications when deadline is close.
//also automatically, if after a certain extra days, the book is not returned, marked as bad debt.(admin can select this as well)
//both fronbt end and back end need to have same return date which admin selects(no consistency atm)
//if admin selects new punishment, it must apply to upcoming overdue and baddebts, not current.

//3)User portal should show past completed + overdue + bad debts(different ejs)(for both admin and user, show old reservations somewhere, and new somewhere else)?



//4)Security aspect



//csrf using sameSite is strict(done)
//use bcrypt for password hashing(done)
//use dotenv for environment variables(done)
//For email check, use validator(done)

//To be done:

//apply mustBeLoggedInAdmin to all admin routes and similarly for user
//deal with the fact that you cant just get the password from the database when doing a call to the database
//For SQL injection: Use parameterized queries(? and pass value in array) or prepared statements
//For XSS: Use Markdown and HTML sanitization libraries.(lecture 88)
//watch lecture 88, and take care of xss and sql injection, whevever input is taken from user.

//5)
//You can further filter\sort the results based on the date of reservation
//you can search by reservation number as well
//extra section for reservation number in search stuff?


//6)



//if user delete his id, what happens to his reservations?
//What hapens to reserved books if books removed.

//add publication year as well in search
//user returns some books and not all books.(if deadline passed, put whats not returned in overdue)
//Multiple admin
//if some book is bad dept, decrease the number of total copies of that book



//7)


//Adjustments in css + clean code:

//small things, z-index of flash messages and overdue logic check.
//Work on flash messages when increasing and decreasing copies
//flash messages when user portal, flash shows even if sucessfully booked.
//deal with negative copies
//you can combine code for modal.(used in userportal and borrower details ejs)

//    for below code, instead of static bnumbers, i want something more robust , error prone to future design change.(reservationsearch.js)
//    const fieldsToSearch = !this.userDetails 
//    ? [row.children[0].textContent.trim().toLowerCase(), row.children[2].textContent.trim().toLowerCase()] 
//    : [row.children[7].textContent.trim().toLowerCase()];


//8) Front end designing


//9) //Contacting the admin?
//Main page books and search there as well.
//User profile page

//10) error handling , .catch

//11) customer can only register and create an account after he pays or something 

//12) option to undo a reservation


//10) testing and deployment