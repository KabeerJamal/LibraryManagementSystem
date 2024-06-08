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

app.use('/', router)


app.listen(process.env.PORT);


//Change the database workbench, such that it satisfies the User class
//run the code and check if database upadated