const mongoose = require('mongoose');

const uri = 'mongodb://localhost/LearnMongoose01';

const User = require('./models/users.schema');

//Connect to the database
mongoose.connect(uri);

//Check the first time we have connected to the database
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB database');
});

//Check if there are errors when connecting to the database
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB database: ', err);
});

//Create a new user with the save() method
async function saveNewUser() {

    try {
        //Create a local user. This does not save the user to the database
        const user = new User({name: 'Saved User', age: 32});

        //Save the user to the database
        await user.save();

        //Update the user
        user.name = user.name + '_Updated';
        user.save();

        console.log('User ---SAVED--- with save(): ', user);
    } catch (err) {
        console.log('Error saving user: ', err.message);
    }
}

//Create a new user with the create() method
async function createNewUser() {

    try {
        //Shortcut to create and save a user to the database
        const user = await User.create({
            name: 'Created User',
            age: 34,
            address: {
                street: 'Main st',
                city: 'Cityland'
            }
        });

        //Update the user
        user.name = user.name + '_Updated';
        const updatedUser = await user.save();

        console.log('User ---CREATED--- with create(): ', updatedUser);
    } catch (err) {
        console.log('Error creating user: ', err.message);
    }
    
}

saveNewUser();
createNewUser();