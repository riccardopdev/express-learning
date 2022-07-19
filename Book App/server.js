//Check if we are working in production environment
if(process.env.NODE_ENV !== 'production') {
    //We are not working in production, load dotenv variables
    require('dotenv').config();
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //Allow us to access the body values from req.body

const app = express();

const PORT = 3000;

const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');

/* ---------- WE COULD USE THIS INSTEAD OF body-parser ---------- */
//app.use(express.urlencoded({ extended: false })); //Allow us to access the body values from req.body

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Set up layouts
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

//Set up folder for static files
app.use(express.static('public'));

//Allows us to access req.body parameters and set the limit of upload to 10mb
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));

//Connect to mongo database through env variable
//The useNewURLParser needs to be set to true for older versions of Mongo. New versions might have this set to true by default
mongoose.connect(process.env.DATABASE_URL, {useNewURLParser: true});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));
db.once('open', () => console.log('Connected to MongoDB'));

//Add all the endpoints we created in the routes (Controller) folder
app.use('/', indexRouter);
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);

//The port number will be provided by the server, or be set to 3000 if we are testing locally
app.listen(process.env.PORT || PORT);