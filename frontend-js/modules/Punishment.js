import axios from 'axios';

export default class Punishment {
    constructor() {

        this.punishmentForms = document.querySelectorAll('.punishmentForm');
        this.punishmentElements = [
            { select: 'punishmentTypeBadDebt', durationField: 'durationFieldBadDebt' },
            { select: 'punishmentTypeOverdue', durationField: 'durationFieldOverdue' }
        ];
        this.events();
    }

    events() {
        this.punishmentElements.forEach(element => {
            const selectElement = document.getElementById(element.select);
            const durationField = document.getElementById(element.durationField);

            selectElement.addEventListener('change', () => {
                this.toggleDurationField(selectElement, durationField);
            });
        });
        this.punishmentForms.forEach((form) => {
            form.addEventListener('submit', (e) => this.sendRequest(e, form));
        });

        this.punishmentElements.forEach((element) => {
            const selectElement = document.getElementById(element.select);
            const durationField = document.getElementById(element.durationField);

            selectElement.addEventListener('change', (event) => {
                const selectedValue = event.target.value; // Correct way to get selected value
                this.removeDuration(durationField, selectedValue); // Ensure removeDuration is properly defined
            });
        });   
    }


    async sendRequest(e, form) {
        e.preventDefault(); // Prevent the form from reloading the page

        const formData = new FormData(form); // Create a FormData object from the specific form
        const data = Object.fromEntries(formData); // Convert FormData to a plain object

        try {
            const response = await axios.post('/punishment', data); // Send the data using Axios
            this.showFlashMessage('Punishment added successfully!', false);
        } catch (error) {
            console.error('Error:', error);
            this.showFlashMessage('An error occurred while adding punishment.', true);
        }
    }

    toggleDurationField(selectElement, durationField) {
        if (selectElement.value === 'deactivation' || selectElement.value === 'noReservations') {
            durationField.style.display = 'block';
        } else {
            durationField.style.display = 'none';
        }
    }

    removeDuration(durationField,selectedValue) {
        
        if (selectedValue === 'fine') {
            durationField.style.display = 'none';
            // Find the duration input field inside the durationField container
            const durationInput = durationField.querySelector('input[name="duration"]');

            if (durationInput) {
                durationInput.value = ""; // Clear the value when hidden
            }
        } else {
            durationField.style.display = 'block';
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