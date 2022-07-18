const express = require('express');
const router = express.Router();
const AuthorModel = require('../models/author.schema');

//Get all authors
router.get('/', async (req, res) => {
    let searchOptions = {};

    if(req.query.name !== null && req.query.name !== '') {
        //The i parameter tells the RegExp that this is not case sensitive
        searchOptions.name = new RegExp(req.query.name, 'i');
    }

    try {
        const authors = await AuthorModel.find(searchOptions);

        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        });

    } catch (error) {
        res.render('/');
    }
    
});

//Display page to create a new author
router.get('/new', (req, res) => {
    res.render('authors/new', {author: new AuthorModel()})
});

//Endpoint to send data to create new author
router.post('/', async (req, res) => {
    const author = new AuthorModel({name: req.body.name});

    try {
        const newAuthor = await author.save();
        // res.redirect(`authors/${newAuthor.id}`);
        res.redirect('authors');
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        });
    }
});

module.exports = router;