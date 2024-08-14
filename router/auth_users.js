const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "Hasan",
    password: "pass",
  },
];

//check is the username is valid
const isValid = (username) => {
  let user = users.filter((user) => {
    return user.username === username;
  });
  if (user.length > 0) {
    return true;
  } else {
    return false;
  }
};
//check is the username is authenticated
const authenticatedUser = (username, password) => {
  let validuser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validuser.length > 0) {
    return true;
  } else {
    return false;
  }
};
//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "Error: username or password missing" });
  }

  if (authenticatedUser(username, password)) {
    //Generate token
    let accessToken = jwt.sign({ data: password }, "secret", {
      expiresIn: "10m",
    });
    // store token and user in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;
  console.log(isbn + " " + review);
  books[isbn].reviews = { review };
  console.log(books[isbn].reviews);
  return res.status(300).json(books[isbn].reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
