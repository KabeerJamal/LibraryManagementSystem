const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const router = require('./router');

// Set the public folder as static
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('views', 'views');
app.set('view engine', 'ejs');

//Use the router for handling routes
app.use('/', router)

//Start the server and listen on port defined in .env file
app.listen(process.env.PORT);


//add umer code in database
//start implementing login and register for user