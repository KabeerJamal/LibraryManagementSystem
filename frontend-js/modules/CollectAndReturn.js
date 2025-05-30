import axios from 'axios';

export default class CollectAndReturn {
    constructor() {
        this.settings= {};
        this.fetchSettings();
        this.events();
    }
    events() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('collect')) {
                const number = e.target.getAttribute('data-number');
                this.sendRequestToCollect(number);
            }
            if (e.target.classList.contains('return')) {
                const number = e.target.getAttribute('data-number');
                //get the book id
                this.sendRequestToReturn(number);
            }
            if(e.target.classList.contains('bad-debt')) {
                //console.log("bad debt button clicked"); 
                const number = e.target.getAttribute('data-number');
                
                this.sendRequestToBadDebt(number);
            }
        });
    }

    
    sendRequestToCollect(number){
        axios.post('/collect/' + number).then((response) => {
        //this.showFlashMessage('Book collected');
        //generate current date and add it with collect button
        let date = new Date();
        let collectDate = date.toISOString().slice(0,10);
        //return date needs to be consistent with what admin selects********
        //use fetchSettings to get return date and add that
        //console.log("settings", this.settings);
        let returnDate = new Date(date.getTime() + this.settings['return-days'] * 24 * 60 * 60 * 1000).toISOString().slice(0,10);
        //let returnDate = new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0,10);

        const collectButton = document.querySelector('.collect[data-number="' + number + '"]');
        
        const parentElementCollect = collectButton.parentElement;
        const parentElementReturn = document.querySelector('.return-date[data-number="' + number + '"]');


        //Appending the collect date and return date to the specific columns.The specifc columsn is thanks to unique reservation number assigned to these columns(data-number)
        const collectDateElement = document.createElement('p');
        collectDateElement.textContent = `${collectDate}`;
        parentElementCollect.appendChild(collectDateElement);

        const returnDateElement = document.createElement('p');
        const returnButton = document.createElement('button');
        returnButton.textContent = 'Returned?';
        returnButton.classList.add('return');
        returnButton.setAttribute('data-number', number);
        parentElementReturn.appendChild(returnButton);
        returnDateElement.textContent = `${returnDate}`;
        parentElementReturn.appendChild(returnDateElement);

        let changeStatus = document.querySelector('.status[data-number="' + number + '"]');
        changeStatus.textContent = 'collected';



        collectButton.remove();
        //remove the collect button

        //for furture put if condition in ejs to remove collect
        }).catch((error) => {
           console.log(error);
        });

    }

    //pass the current reseravtion status, then go to router.js
    sendRequestToReturn(number){
       
        axios.post('/return/' + number).then((response) => {
            let status = document.querySelector('.status[data-number="' + number + '"]');

            //console.log(status.textContent);
            //this.showFlashMessage('Book returned');
            //generate current date and add it with collect button
            let date = new Date();
            let returnDate = date.toISOString().slice(0,10);
    
            const returnButton = document.querySelector('.return[data-number="' + number + '"]');
            const parentElementReturn = document.querySelector('.returned-at[data-number="' + number + '"]');
    
            const returnDateElement = document.createElement('p');
            returnDateElement.textContent = `${returnDate}`;
            parentElementReturn.appendChild(returnDateElement);


            //2 things, doing overdue and then pressing return doesnt cahnge text content and removes baddebt button.
            //console isnt logging need to fix this tomm.
           if(!(response.data == 'OverdueBookReturned')) {
                status.textContent = 'completed';
           } else {
                const badDebtButton = document.querySelector('.bad-debt[data-number="' + number + '"]');
                badDebtButton.remove();
           }
    
            returnButton.remove();
            //remove the collect button
    
            //for furture put if condition in ejs to remove collect
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

    sendRequestToBadDebt(number) {
        axios.post('/badDebt/' + number).then((response) => {
            //this.showFlashMessage('Bad Debt');
            console.log("response received from server");
            let status = document.querySelector('.status[data-number="' + number + '"]');
            status.textContent = 'baddebt';
            const badDebtButton = document.querySelector('.bad-debt[data-number="' + number + '"]');
            const returnButton = document.querySelector('.return[data-number="' + number + '"]');
            badDebtButton.remove();
            returnButton.remove();
        }).catch((error) => {
            console.log(error);
        });
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
}