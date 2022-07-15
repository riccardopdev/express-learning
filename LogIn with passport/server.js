//Check if we are in production or dev environment and load the .env file if we are in dev
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const PORT = 3000;
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./passport.config');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

initializePassport(
    passport,
    (email) => users.find(user => user.email === email), //getUserByEmail function: Check if the user email is in our users array
    (id) => users.find(user => user.id === id) //getUserById function: Check if the user id is in our users array
);

// --------------- REPLACE WITH DATABASE ---------------
const users = []; //Array to hold the registered users

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false })); //Git permission to access req.body parameters in the post methods
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


//Method and endpoint to show home page
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name});
});

//Method and endpoint to show login page
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

//Method and endpoint to receive data from login page form
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

//Method and endpoint to show register page
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

//Method and endpoint to receive data from register page form
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        res.redirect('/login');
    } catch (err) {
        res.redirect('/register');
    }
});

//This method is implemented with method-overrid in the form with the Log out button. DELETE will be called instead of POST
app.delete('/logout',(req, res) => {
    //The logOut method on the req object is set by passport and logs out the user
    req.logOut(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
})

//Middleware to check if the user is authenticated
function checkAuthenticated(req, res, next) {
    //Below isAuthenticated function on the req object is from passport
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login'); //User is not logged in, go to login page
}

//Middleware to check if the user is not authenticated
function checkNotAuthenticated(req, res, next) {
    //Below isAuthenticated function on the req object is from passport
    if(req.isAuthenticated()) {
        return res.redirect('/'); //User is already logged in, go to home page
    }
    next();
}

app.listen(PORT);

