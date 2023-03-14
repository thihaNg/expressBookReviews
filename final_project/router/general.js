const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
    const {username, password} = req.body;
    if(username && password) {
        if(!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    }

    return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const {isbn} = req.params;

    if(isbn && books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        res.status(404).json({message: "ISBN not found!"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
    const {author} = req.params;
    const isbnKeys = Object.keys(books);
    let booksByAuthor = [];
    isbnKeys.forEach(key => {
        if(books[key].author === author) {
            booksByAuthor.push(books[key]);
        }
    })

    res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const {title} = req.params;
    const isbnKeys = Object.keys(books);
    let booksByTitle = [];
    isbnKeys.forEach(key => {
        if(books[key].title === title) {
            booksByTitle.push(books[key]);
        }
    })

    res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    const {isbn} = req.params;    
    
    if(isbn && books[isbn]) {

        return res.status(200).json(books[isbn].reviews);
    }

});

const axios = require("axios");

function getAllBooks() {
    let booksRes = axios.get("/");
    booksRes.then(res => console.log(res))
}

function getBookByISBN(isbn) {
    let booksRes = axios.get(`/isbn/${isbn}`);
    booksRes.then(res => console.log(res))
}

function getBooksByAuthor(author) {
    let booksRes = axios.get(`/author/${author}`);
    booksRes.then(res => console.log(res))
}

function getBooksByTitle(title) {
    let booksRes = axios.get(`/title/${title}`);
    booksRes.then(res => console.log(res))
}

module.exports.general = public_users;
