import axios from 'axios';

export default class CancelReservation {
    constructor() {
        this.events();
    }

    events() {
         //If user clicks cancel reservation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cancel-reservation')) {
            const number = e.target.getAttribute('data-number');
            this.sendRequestToCancel(number);
            }
        });
    }

    sendRequestToCancel(number){
        axios.post('/cancelReservation/' + number).then((response) => {
            console.log(response.data);
            this.showFlashMessage('Reservation cancelled');
            //I want to remove the entire row of the reservation
            const row = document.querySelector('.reservation-row[data-number="' + number + '"]');
            row.remove();
        }).catch((error) => {
            console.log(error);
        });
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