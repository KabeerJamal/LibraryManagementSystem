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
            if (response.data.success) {  // ✅ Check the success flag instead of a string
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
    
        // ✅ Use direct property lookup instead of .find()
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