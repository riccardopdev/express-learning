const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: String,
    city: String
})

//Create a Schema which defines the fields and types of one user Document for the Users collection
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: Number,
    email: String,
    createdAt: Date,
    bestFriend: {
        type: mongoose.SchemaTypes.ObjectId, //Reference to the _id in another document
        ref: 'users' //Collection to which reference the _id
    },
    hobbies: [String],
    address: addressSchema //Using another mongoose.Schema here will generate an _id for this field
});

//This will associate the users collection in the database to the userSchema
//The first parameter will be used to create the collection. Mongoose will take the string we insert, lowercase it and make it plural.
module.exports = mongoose.model('users', userSchema);