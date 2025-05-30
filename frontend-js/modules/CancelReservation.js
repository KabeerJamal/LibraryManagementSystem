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
    // showFlashMessage(message, isError = false) {
    //     const flashMessage = document.getElementById('flash-message');
    //     flashMessage.textContent = message;
    //     flashMessage.classList.toggle('error', isError);
    //     flashMessage.style.display = 'block';
    
    //     setTimeout(() => {
    //         flashMessage.style.display = 'none';
    //     }, 30000); // Hide after 3 seconds
    // }

      showFlashMessage(message, isError = false) {
        const flashMessage = document.getElementById('flash-message');
        flashMessage.classList.remove('flash-messages-login-register');
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
}