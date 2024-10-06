import axios from 'axios';

export default class CollectAndReturn {
    constructor() {
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
                this.sendRequestToReturn(number);
            }
        });
    }

    
    sendRequestToCollect(number){
        axios.post('/collect/' + number).then((response) => {
        this.showFlashMessage('Book collected');
        //generate current date and add it with collect button
        let date = new Date();
        let collectDate = date.toISOString().slice(0,10);
        let returnDate = new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0,10);

        const collectButton = document.querySelector('.collect[data-number="' + number + '"]');

        
        const parentElementCollect = collectButton.parentElement;
        const parentElementReturn = document.querySelector('.return-date[data-number="' + number + '"]');


        //Appending the collect date and return date to the specific columns.The specifc columsn is thanks to unique reservation number assigned to these columns(data-number)
        const collectDateElement = document.createElement('p');
        collectDateElement.textContent = `${collectDate}`;
        parentElementCollect.appendChild(collectDateElement);

        const returnDateElement = document.createElement('p');
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

    sendRequestToReturn(number){
        axios.post('/return/' + number).then((response) => {
            this.showFlashMessage('Book returned');
            //generate current date and add it with collect button
            let date = new Date();
            let returnDate = date.toISOString().slice(0,10);
    
            const returnButton = document.querySelector('.return[data-number="' + number + '"]');
            const parentElementReturn = document.querySelector('.returned-at[data-number="' + number + '"]');
    
            const returnDateElement = document.createElement('p');
            returnDateElement.textContent = `${returnDate}`;
            parentElementReturn.appendChild(returnDateElement);

            let changeStatus = document.querySelector('.status[data-number="' + number + '"]');
            changeStatus.textContent = 'completed';
    
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
}