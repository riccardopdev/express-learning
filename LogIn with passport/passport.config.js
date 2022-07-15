const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        //The getUserByEmail function is passed when we call initialize. This will return a user if the email matches with one in our register/database
        const user = getUserByEmail(email);

        //Check if we found a user in our register
        if(user == null) {
            //The first parameter of done() is the error. In this case we don't have an error, but the user was not found.
            //The second parameter is false if we don't have the user, or is the user if we have one. In this case is false because we don't have one
            //The third parameter is an object with a message
            return done(null, false, {message: 'No user with that email'});
        }

        try {
            if(await bcrypt.compare(password, user.password)) {
                //The password matches, return the user
                return done(null, user);
            } else {
                //The passwoerd does not match
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch (er) {
            //There was an error
            return done(er);
        }
    }

    passport.use(new LocalStrategy({
        usernameField: 'email', //Specify what the userNameField and passwordField are called
        passwordField: 'password'
    }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    });
};

module.exports = initialize;