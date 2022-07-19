const express = require('express');
const router = express.Router();
const BookModel = require('../models/book.schema');

router.get('/', async (req, res) => {
    let books = [];

    try {
        //Get recent 10 books and pass it to the index page
        books = await BookModel.find().sort({createdAt: 'desc'}).limit(10).exec();
    } catch (error) {
        console.error(error);
        books = [];
    }

    res.render('index', {
        books: books
    });
});

module.exports = router;
