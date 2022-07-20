const mongoose = require('mongoose');
const BookModel =  require('./book.schema');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

//When trying to remove an author first check if the author had been linked to a book
authorSchema.pre('remove', function(next) {
    //Check if this author was assigned to a book
    BookModel.find({author: this.id}, (err, books) => {
        //There was an error, pass it to the next function. This will prevent us from removing this author
        if(err) {
            next(err);
        } else if(books.length > 0) {
            //This author was assigned to 1 or more books. Prevent removing the author
            next(new Error('This author is assigned to books and cannot be deleted'));
        } else {
            //This author was not assigned to any book. We can remove the author
            next();
        }
    });
});

module.exports = mongoose.model('Authors', authorSchema);