export default class ReservationDisplay {
    constructor() {
        //console.log(reservations);//we pass this data using a script in borrowerDetails.ejs
        this.modal = document.querySelector('.modal');
        this.events();
    }

    events() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('show-books')) {
                const number = e.target.getAttribute('data-number');
                this.openModal(number);
            }
        });

        window.addEventListener('click', (e) => {this.closeModal(e)});
    }


    openModal(number) {
        const reservation = reservations.find(reservation => reservation.reservation_id == number);//get the reservation id consistent with the button clicked
        this.modal.style.display = 'block';

        // Insert available copies into the modal
        const bookCopies = document.getElementById('bookCopies');
        bookCopies.innerHTML = ''; // Clear the previous list
        reservation.books.forEach(book => {
            const listItem = document.createElement('li');
            listItem.textContent = `Author: ${book.author}, Title: ${book.book_title}, Number of Copies: ${book.number_of_copies}`;
            listItem.setAttribute('data-number', book.book_id);
            bookCopies.appendChild(listItem);
        });        
    }

    
    closeModal(e) {
        if (e.target == this.modal) {
            this.modal.style.display = 'none';
        }
    }


}