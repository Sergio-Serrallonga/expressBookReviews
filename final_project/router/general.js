const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    await setTimeout(() => {
      res.send(books);
    }, 1000);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  // Create a new promise to search for the book by ISBN
  const searchByISBNPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    }, 1000);
  });

  // Handle the promise resolution and rejection
  searchByISBNPromise
    .then((book) => {
      res.json(book);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  // Create a new promise to search for books by author
  const searchByAuthorPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = Object.values(books).filter(
        (book) => book.author === author
      );

      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found for the author");
      }
    }, 1000);
  });

  // Handle the promise resolution and rejection
  searchByAuthorPromise
    .then((booksByAuthor) => {
      res.json(booksByAuthor);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const searchByTitlePromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksWithTitle = Object.values(books).filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      if (booksWithTitle.length > 0) {
        resolve(booksWithTitle);
      } else {
        reject("No books found with the specified title");
      }
    }, 1000);
  });

  searchByTitlePromise
    .then((booksWithTitle) => {
      res.json(booksWithTitle);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
