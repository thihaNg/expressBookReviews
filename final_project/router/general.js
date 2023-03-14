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
  res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const {isbn} = req.params;

    if(isbn && books[isbn]) {
        return res.status(200).json(JSON.stringify(books[isbn]));
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

    res.status(200).json(JSON.stringify(booksByAuthor));
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

    res.status(200).json(JSON.stringify(booksByTitle));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
