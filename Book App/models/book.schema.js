const mongoose = require('mongoose');
const path = require('path');

//This is the folder where the book cover images will be uplodaed.
//It will reside insid the public folder
const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: Number
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, //Id from the Authors collection
        ref: 'Authors', //Reference to the Authors collection
        required: true
    }
});

//We create a virtual property on the bookSchema which value is a combination of other properties
//This will return the full path and file name for the book cover image
bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName);
    }
});

module.exports = mongoose.model('Books', bookSchema);

//Export the path to the folers for the cover images as a variable of this module
module.exports.coverImageBasePath = coverImageBasePath;