const express = require('express');
const router = express.Router();
const AuthorModel = require('../models/author.schema');
const BookModel = require('../models/book.schema');

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
    res.render('authors/new', {author: new AuthorModel()});
});

//Endpoint to send data to create new author
router.post('/', async (req, res) => {
    const author = new AuthorModel({name: req.body.name});

    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`);
    } catch (error) {
        console.error(error);
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        });
    }
});

//Get one author by ID
router.get('/:id', async (req, res) => {
    try {
        const author = await AuthorModel.findById(req.params.id);
        const books = await BookModel.find({author: author.id}).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

//Get page to edit an author
router.get('/:id/edit', async (req, res) => {

    try {
        const author = await AuthorModel.findById(req.params.id);

        res.render('authors/edit', {author: author});
    } catch (error) {
        console.error(error);
        res.redirect('/authors');
    }
    
});

//Update an author
router.put('/:id', async (req, res) => {
    let author;

    try {
        author = await AuthorModel.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch (error) {
        console.error(error);
        if(author == null) {
            res.redirect('/');
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating author'
            });
        }
    }
});

//Delete an author
router.delete('/:id', async (req, res) => {
    let author;

    try {
        author = await AuthorModel.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    } catch (error) {
        console.error(error);
        if(author == null) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
});

module.exports = router;