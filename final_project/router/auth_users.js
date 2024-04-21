const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if the username meets certain criteria, such as length, allowed characters, etc.
    return username.length >= 5;
};


const authenticatedUser = (username, password) => {
    // Assuming you have a users array with objects containing username and password
    const user = users.find(user => user.username === username && user.password === password);
    return !!user; // Return true if user is found, false otherwise
};


// Login endpoint for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Please provide both username and password" });
    }
    
    // Check if the user is valid and authenticated
    if (!isValid(username) || !authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Create and sign a JWT token for the user session
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    return res.status(200).json({ accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username; // Assuming the user is already authenticated
    const book = books.find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (!review) {
        return res.status(400).json({ message: "Review missing in request" });
    }
    // Check if the user has already reviewed this book
    if (book.reviews[username]) {
        // Modify existing review
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review modified successfully" });
    } else {
        // Add new review
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review added successfully" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
