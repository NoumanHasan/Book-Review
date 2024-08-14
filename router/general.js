const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Resgister user
public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let newuser = { username: username, password: password };
  if (username && password) {
    if (!isValid(username)) {
      users.push(newuser);
      return res.status(200).json({ message: "User has been registerd" });
    } else {
      return res.status(404).json({ message: "User is already registerd" });
    }
  }
  return res.status(404).json({ message: "Error: please check data" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(300).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  return res.status(300).json(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Get the title from the request parameters
  const author = req.params.author.toString().toLowerCase();
  // Array to hold the matching books
  let allBooks = [];
  let booksByAuthor = [];
  // Loop through each book
  for (const book in books) {
    // Check if the book's title matches the query
    allBooks.push(books[book]);
  }

  allBooks.forEach((book) => {
    if (book.author.toString().toLowerCase() === author) {
      booksByAuthor.push(book);
    }
  });
  // If no books are found, respond with a 404 status code
  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found with that Author" });
  }
  // Return the found books with a 200 status code
  return res.status(200).json({ booksByAuthor });
});

//Get books by author
public_users.get("/title/:title", function (req, res) {
  // Get the title from the request parameters
  const title = req.params.title.toString().toLowerCase();
  // Array to hold the matching books
  let allBooks = [];
  let booksByTitle = [];
  // Loop through each book
  for (const book in books) {
    // Check if the book's title matches the query
    allBooks.push(books[book]);
  }
  allBooks.forEach((book) => {
    if (book.title.toString().toLowerCase() === title) {
      booksByTitle.push(book);
    }
  });
  // If no books are found, respond with a 404 status code
  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "No books found with that title" });
  }
  // Return the found books with a 200 status code
  return res.status(200).json({ booksByTitle });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let review = books[isbn].reviews;
  return res.status(300).json(review);
  //return res.status(300).json({ message: "Book has not review" });
});

module.exports.general = public_users;
