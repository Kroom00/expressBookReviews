const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

// Array to store registered users
let users = [];

const isValid = (username) => {
    return username.length >= 5;
};

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

// Login endpoint for registered users
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
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

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn]
    if (book) { //Check is friend exists
        let author = req.body.author;
        let title = req.body.title;
        let reviews = req.body.reviews;

        if(author) {
            book["author"] = author
        }
        if(title) {
            book["title"] = title
        }if(reviews) {
            book["reviews"] = reviews
        }
          
        books[isbn]=book;
        res.send(`Book review for ISBN  ${isbn}  has been successfully updated.`);
    }
  });



regd_users.delete("/auth/review/:isbn", (req, res) => {
        const isbn = req.params.isbn;
        const review_ = req.params.review;
        if (review_){
            delete books[review_]
        }
        res.send(`Book review for ISBN  ${isbn}  has been successfully deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
