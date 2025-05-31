export default class AddToCartAndReserve {
    constructor() {
        this.reserveFinalBtn = document.getElementById('#reserve');
        this.storeResponseData = [];
        this.storeResponseData2 = [];//to avoid add to cart more than once error.
        
        //this.storeResponseDataSingle = [];
        this.cartItems = document.querySelector('.cart-items');
        this.reserveMultiple = document.getElementById('reserve-multiple');

         
        this.processedBookIds = new Set();//used in function remove book from cart and show book id
        //to make sure add to cart displays even after page refresh
        this.showBookId();
    }

    events() {
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

        document.body.addEventListener('click', (e) => {
            //console.log(document.body);
            if(e.target.classList.contains('btn-add-to-cart')) {
                const number = e.target.getAttribute('data-number');
                this.storeAndShowBookId(number); 
            }
            if(e.target.classList.contains('remove-book')) {
                this.removeBookFromCart(e.target);
            }
        });

        this.reserveMultiple.addEventListener('click', () => {
            if(!this.checkIfCartIsEmpty()) {
                this.sendRequestToReserve( this.formatDataOfResponse(this.storeResponseData));
            }
        });

    }

    sendRequestToReserve(data) {     
        //console.log(data);

        axios.post('/reserve', {userName: data.customer.userName,
            books: data.customer.books}).then((response) => {
            if (response.data == 'Book reserved') {

                this.showFlashMessage('Book reserved');
                sessionStorage.clear();
                /*The below lines of code are in AddToCartAndReserve sendRequestToReserveFunction */
                this.processedBookIds = new Set();
                this.showBookId(); 
            } else {

                this.showFlashMessage('Error reserving book', true);
            }
        }).catch((error) => {
            this.showFlashMessage('Reservation failed. Please try again.', true);
        });
    }


    addCopiesToSessionStorage(value) {
        let button = value.querySelector('button'); // Select the button element within the div
        let bookIdToUpdate = button.getAttribute('data-number'); // Get the value of the data-number attribute
        let bookIds = sessionStorage.getItem('bookIds').split(',');
        let numberOfCopiesToReserve = JSON.parse(sessionStorage.getItem('numberOfCopiesToReserve'));

        const indexToUpdate = bookIds.indexOf(bookIdToUpdate);

        if (indexToUpdate !== -1) {
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
        //get inforamtion from database of the book by for looping through the bookIds,
        //showcase it here.
        //increase or decrease the number of copies.
        //show available copies of the book

        
            //then send a request to reserve the book.
        let bookIds = sessionStorage.getItem('bookIds');
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
            this.cartItems.innerHTML = '';//if no books in session storage
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
}