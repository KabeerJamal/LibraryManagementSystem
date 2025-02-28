import axios from "axios";

export default class PunishmentDisplay {
    constructor(){
        this.modalPunishment = document.getElementById('modal-punishment'); 
        this.modalShowReservations = document.getElementById('modal-show-reservations'); 
        this.events();
    }

    events() {
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('manage')) {
                const number = e.target.getAttribute('data-number');
                // Find the closest <tr> (the parent row)
                const row = e.target.closest('tr');
                const punishmentTypeCell = row.querySelector('.punishment-type');//
                const userPunishmentId = row.querySelector('.punishment-number').getAttribute('data-number');
                this.modalPunishment.setAttribute('data-user-punishment-id', userPunishmentId);

                // Get the data-number from the status cell
                const punishmentTypeDataNumber = punishmentTypeCell ? punishmentTypeCell.getAttribute('data-number') : null;
                let punishmentType = punishmentTypeDataNumber;

                this.openModalPunishment(number,punishmentType);
              
            }
            if (e.target.classList.contains('show-reservations')) {
                let number = e.target.getAttribute('data-number');
                number = number === 'null' ? null : number.split(', ').map(id => id.trim());
                this.openModalShowReservations(number);
            }
            
            if(e.target.classList.contains('fine-paid-btn')) {
                //get the userpunishment id of the row
                this.finePaid(this.modalPunishment.getAttribute('data-user-punishment-id'));
            }

            if(e.target.classList.contains('cancel-punishment-btn')) {
                //get the userpunishment id of the row
                this.cancelPunishment(this.modalPunishment.getAttribute('data-user-punishment-id'));
            }
            
        window.addEventListener('click', (e) => {this.closeModalPunishment(e)});
        });
    }

    openModalPunishment(number,punishmentType) {
        this.modalPunishment.style.display = 'block';
        const finePaidButton = document.getElementById('finePaidButton');   


        if (!(punishmentType === 'fine')) {
            finePaidButton.style.display = 'none'; // Hides the button
            // OR
            // finePaidButton.remove(); // Completely removes the button from the DOM
        } else {
            finePaidButton.style.display = 'block'; // Show the button for other punishment types
        }
    }

    openModalShowReservations(number) {
        this.modalShowReservations.style.display = 'block';

        try{
            axios.post('/reservations-with-books', {number}).then((response) => {
                this.populateReservationModal(response.data);
            }).catch((err) => {
                console.log(err);
            });
        } catch(err) {
            console.log(err);
        }
    }

    closeModalPunishment(e) {
        if (e.target == this.modalPunishment) {
            this.modalPunishment.style.display = 'none';
        }
        if (e.target == this.modalShowReservations) {
            this.modalShowReservations.style.display = 'none';
        }
    }   

    finePaid(userPunishmentId) {
        try{
            axios.post('/punishmentCompletedFine', {userPunishmentId}).then((response) => {
                const row = document.querySelector(`td.punishment-number[data-number="${userPunishmentId}"]`)?.closest('tr');
                row.querySelector('.punishment-status').textContent = 'completed';
                row.querySelector('.manage').remove();
                //add an option to undo?
      
                this.modalPunishment.style.display = 'none';
                this.showFlashMessage(response.data.message);
            }).catch((err) => {
                console.log(err);
            });
        } catch(err) {
            console.log(err);
        }
    }

    cancelPunishment(userPunishmentId) {
        axios.post('/punishmentCancelled', {userPunishmentId}).then((response) => {
            const row = document.querySelector(`td.punishment-number[data-number="${userPunishmentId}"]`)?.closest('tr');
            row.querySelector('.punishment-status').textContent = 'completed';
            row.querySelector('.manage').remove();
            //add an option to undo?
  
            this.modalPunishment.style.display = 'none';
            this.showFlashMessage(response.data.message);
        }).catch((err) => {
            console.log(err);
        });
    }



    //helper function
    populateReservationModal(reservations) {
        const modalContent = document.querySelector('#modal-show-reservations .modal-content');
    
        // Clear previous content
        modalContent.innerHTML = `
            <span class="close">&times;</span>
            <h2>Reservation Details</h2>
        `;
    
        if (!reservations || reservations.length === 0) {
            modalContent.innerHTML += `<p>No reservations found.</p>`;
            return;
        }
    
        let groupedReservations = {};
    
        // Group books by reservation_id
        reservations.forEach(reservation => {
            if (!groupedReservations[reservation.reservation_id]) {
                groupedReservations[reservation.reservation_id] = [];
            }
            groupedReservations[reservation.reservation_id].push({
                book_id: reservation.book_id,
                title: reservation.title,
                author: reservation.author,
                number_of_copies: reservation.number_of_copies
            });
        });
        //console.log(groupedReservations);
    
        // Generate HTML for each reservation and its books
        Object.entries(groupedReservations).forEach(([reservation_id, books]) => {
            let reservationSection = document.createElement('div');
            reservationSection.classList.add('reservation-section');
    
            let reservationHeader = document.createElement('h3');
            reservationHeader.textContent = `Reservation ID: ${reservation_id}`;
            reservationSection.appendChild(reservationHeader);
    
            let bookList = document.createElement('ul');
            bookList.classList.add('book-list');
    
            books.forEach(book => {
                let bookItem = document.createElement('li');
                bookItem.innerHTML = `
                    <strong>Title:</strong> ${book.title} <br>
                    <strong>Author:</strong> ${book.author} <br>
                    <strong>Copies Reserved:</strong> ${book.number_of_copies}
                `;
                bookList.appendChild(bookItem);
            });
    
            reservationSection.appendChild(bookList);
            modalContent.appendChild(reservationSection);
            modalContent.appendChild(document.createElement('hr'));
        });
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