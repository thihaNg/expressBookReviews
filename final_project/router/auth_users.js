const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const user = users.filter(user => user.username === username);

    return user.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean

    const validUsers = users.filter(user => user.username === username && user.password === password);

    return validUsers.length > 0;

}

//only registered users can login
regd_users.post("/login", (req,res) => {

    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(404).json("Error logging in!");
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("User successfully logged in");
      } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
      }

});

//1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {} }
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const username = req.session.authorization.username;
    const review = req.query.review;
  
    let {isbn} = req.params;
    if(isbn && books[isbn] && review) {
        books[isbn].reviews[username] = review;
        
        return res.status(200).json(books[isbn])
    }

    res.status(404).json("Something went wrong");

});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const {isbn} = req.params;
    const username = req.session.authorization.username;

    if(isbn && books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];

        return res.status(200).json(books[isbn]);
    }

    res.status(404).json({message: "Something went wrong!"})

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
