//Check if we are working in production environment
if(process.env.NODE_ENV !== 'production') {
    //We are not working in production, load dotenv variables
    require('dotenv').config();
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

const PORT = 3000;

const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Set up layouts
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

//Set up folder for static files
app.use(express.static('public'));

//Connect to mongo database through env variable
//The useNewURLParser needs to be set to true for older versions of Mongo. New versions might have this set to true by default
mongoose.connect(process.env.DATABASE_URL, {useNewURLParser: true});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));
db.once('open', () => console.log('Connected to MongoDB'));

app.use('/', indexRouter);

//The port number will be provided by the server, or be set to 3000 if we are testing locally
app.listen(process.env.PORT || PORT);