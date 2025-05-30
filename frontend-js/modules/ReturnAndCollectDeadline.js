import axios from 'axios';

export default class ReturnAndCollectDeadline{
    constructor(){
        this.forms = document.querySelectorAll('.return-deadline form, .collect-deadline form');

        this.settings= {};
        this.fetchSettings();
        this.events();
    
    };

    events(){
       // Attach event listener to each form dynamically
       this.forms.forEach(form => {
        form.addEventListener('submit', (e) => this.handleDeadlineSubmit(e));
       });
    };

    handleDeadlineSubmit(e) {
        e.preventDefault();

        // Get the form that triggered the event
        const form = e.target;

        // Determine whether it is return or collect deadline
        const inputField = form.querySelector('input[type="number"]');
        const deadlineType = inputField.id; // This will be 'return-days' or 'collect-days'
        const deadlineValue = inputField.value;

        if (deadlineValue < 0) {
            console.error("Input value cannot be negative");
            this.showFlashMessage("Deadline value cannot be negative", true);
            return;
        } 
        if (deadlineValue > 365) {
            console.error("Input value cannot be greater than 365");
            this.showFlashMessage("Deadline value cannot be greater than 365", true);
            return;
        }


        if(deadlineType === 'return-days') {
            //the value should be greater then collect days
            const collectDaysInput = document.getElementById('collect-days');
            const collectDaysValue = collectDaysInput ? collectDaysInput.value : 0;
            if (parseInt(deadlineValue, 10) <= parseInt(collectDaysValue, 10)) {
                console.error("Return days must be greater than collect days");
                this.showFlashMessage("Return date deadline must be after collect date deadline, so values needs to be bigger than current value for collect date", true);
                return;
            }
        }

        if(deadlineType === 'collect-days') {
            //the value should be less then return days
            const returnDaysInput = document.getElementById('return-days');
            const returnDaysValue = returnDaysInput ? returnDaysInput.value : 0;
            if (parseInt(deadlineValue, 10) >= parseInt(returnDaysValue, 10)) {
                console.error("Collect days must be less than return days");
                this.showFlashMessage("Collect date deadline must be after return date deadline, so values needs to be bigger than current value for return date", true);
                return;
            }
        }

        if (!deadlineValue) {
            console.error("Input value is missing");
            return;
        }

        //console.log(`Updating ${deadlineType} to:`, deadlineValue);

        // Send an axios post request to update deadline
        axios.post(`/updateDeadline`, {
            type: deadlineType, 
            value: deadlineValue
        })
        .then(response => {
            if (response.data.success) {  //  Check the success flag instead of a string
                this.showFlashMessage(response.data.message);
            } else {
                this.showFlashMessage(response.data.message, true);
            }
        })
        .catch(err => {
            console.error("Error:", err);
            this.showFlashMessage("An error occurred while updating the deadline", true);
        });
    }


    showPreviousDeadline() {
        // Get input fields
        const returnDaysInput = document.getElementById('return-days');
        const collectDaysInput = document.getElementById('collect-days');
    
        //  Use direct property lookup instead of .find()
        const returnDays = this.settings['return-days']|| ""; // Default: 14 days
        const collectDays = this.settings['collect-days'] || "" ; // Default: 7 days

    
        // Set values
        if (returnDaysInput) returnDaysInput.value = returnDays;
        if (collectDaysInput) collectDaysInput.value = collectDays;
    }
    
    async fetchSettings() {
        try {
           const response = await axios.get('/api/settings')

            this.settings = response.data;
            console.log('Settings:', this.settings);
            // Use the settings in your front-end application
            this.showPreviousDeadline();
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
       
    }


    
    //Helper function to show flash message when book succesfully reserved/or not
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