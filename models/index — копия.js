const { nanoid } = require("nanoid");
const fs = require("fs/promises");
const path = require("path");

const booksPath = path.resolve("models", "books", "books.json");

const updateBooks = (books) =>
  fs.writeFile(booksPath, JSON.stringify(books, null, 2));

const getAllBooks = async () => {
  const result = await fs.readFile(booksPath);
  return JSON.parse(result);
};

const getBookById = async (id) => {
  const books = await getAllBooks();
  const result = books.find((item) => item.id === id);
  return result || null;
};

const addBook = async ({ book, author }) => {
  const books = await getAllBooks();
  const newBook = {
    book,
    author,
    id: nanoid(),
  };
  books.push(newBook);
  await updateBooks(books);
  return newBook;
};

const updateBookById = async (id, data) => {
  const books = await getAllBooks();
  const index = books.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  books[index] = { id, ...data };
  await updateBooks(books);
  return books[index];
};

const deleteById = async (id) => {
  const books = await getAllBooks();
  const index = books.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = books.splice(index, 1);
  await updateBooks(books);
  return result;
};

module.exports = {
  updateBooks,
  getAllBooks,
  getBookById,
  addBook,
  updateBookById,
  deleteById,
};
