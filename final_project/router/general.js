const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if a username already exists
const doesExist = (username) => {
  return users.some(user => user.username === username);
};

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"}); // Conflict status code for user already exists
    }
  }
  return res.status(400).json({message: "Unable to register user. Username or password missing."}); // Bad request status code for missing username or password
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify(books));
  });
  

  public_users.get('/isbn/:isbn', function (req, res) {
    const book_isbn = books.find((book) => book.isbn === req.params.isbn);
    if (book_isbn) {
        res.status(200).json(book_isbn);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const booksByAuthor = books.filter(book => book.author === req.params.author);
    res.send(booksByAuthor);
  });
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const booksByTitle = books.filter(book => book.title === req.params.title);
    res.send(booksByTitle);
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = books.find(book => book.isbn === req.params.isbn);
    if (book && book.review) {
      return res.status(200).json({review: book.review});
    } else {
      return res.status(404).json({message: "Review not found"});
    }
  });

module.exports.general = public_users;
