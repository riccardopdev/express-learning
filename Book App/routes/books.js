const express = require('express');
const router = express.Router();
const fs = require('fs');
const BookModel = require('../models/book.schema');
const AuthorModel = require('../models/author.schema');
const path = require('path');
const uploadPath = path.join('public', BookModel.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; //Type of images we will accept in the server
const multer = require('multer');

const upload = multer({
    dest: uploadPath,
    //Filter which files our server accepts
    fileFilter: (req, file, callback) => {
        //The second parameter is a boolean stating if the file is accepted or no
        //We compare the mimetype of the file uploaded with the array imageMimeTypes tp check if the file's type is one of jpeg, png or gif
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

//Get all books
router.get('/', async (req, res) => {
    //We create a mongoose query to filter the books and populate it below
    let query = BookModel.find();
    
    //Check if we have a title parameter in the query URL and that is not empty
    if(req.query.title != null && req.query.title != '') {
        //We tell the filter to check if we match part of the title ignoring case sensitivity
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }

    //Check if we have a publishedBefore parameter in the query URL and that is not empty
    if(req.query.publishedBefore != null && req.query.publishedBefore != '') {
        //We tell the filter to check if the published date is before the query date
        query = query.lte('publishDate', req.query.publishedBefore);
    }

    //Check if we have a publishedAfter parameter in the query URL and that is not empty
    if(req.query.publishedAfter != null && req.query.publishedAfter != '') {
        //We tell the filter to check if the published date is after the query date
        query = query.gte('publishDate', req.query.publishedAfter);
    }

    try {
        //Execute the query and filter the Books collection
        const books = await query.exec();

        res.render('books/index', {
            books: books,
            searchOptions: req.query
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
    
});

//Display page to create a new book
router.get('/new', async (req, res) => {
    //Call a function that will run the logic
    renderNewBookPage(res, new BookModel());
});

//Endpoint to send data to create new book
//Using multer we are declaring that we upload a single file with name cover
router.post('/', upload.single('cover'), async (req, res) => {
    //The file operator is populated by multer. We check if there is a file
    const fileName = req.file != null ? req.file.filename : null;

    const book = new BookModel({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    });

    try {
        //Save the book to the database
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`);
        res.redirect('books');
    } catch (error) {
        console.log(error);
        //If a book cover image was uploaded and we have an error saving the book, remove the image
        if(book.coverImageName) removeBookCover(book.coverImageName);
        renderNewBookPage(res, book, true);
    }
});

async function renderNewBookPage(res, book, hasError = false) {
    try {
        //Retrieve the list of authors from the database
        const authors = await AuthorModel.find({});
        //Set parameters to be sent to the new book page
        const params = {
            authors: authors,
            book: book
        }

        //If we have an error add it to the parameters
        if(hasError) params.errorMessage = 'Error creating book';

        //Send the parameters with book and list of authors to the page so it can populoate the HTML dropdown
        res.render('books/new', params);
    } catch (error) {
        res.redirect('/books');
    }
}

//This function will remove the file for a book cover if we had an error saving the book but still uploaded a book cover image
function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), (err) => {
        if(err) console.error(err);
    });
}

module.exports = router;