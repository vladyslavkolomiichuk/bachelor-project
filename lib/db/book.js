"use server";

import { verifyAuth } from "../auth";
import pool from "./postgresDB";

export async function addBookToDb(book) {
  const client = await pool.connect();

  const existingBookResult = await client.query(
    "SELECT id FROM books WHERE isbn13 = $1",
    [book.isbn13]
  );

  if (existingBookResult.rows.length > 0) {
    const existingBookId = existingBookResult.rows[0].id;
    const existingBookTitle = existingBookResult.rows[0].title;

    const {
      user: { id: userId },
    } = await verifyAuth();

    await client.query(
      "INSERT INTO used_books (user_id, book_id) VALUES ($1, $2)",
      [userId, existingBookId]
    );

    return existingBookTitle;
  }

  const result = await client.query(
    "INSERT INTO books (isbn13, title, image, date_published, synopsis, subjects, language, buy_link, binding, authors, long_title, pages, publisher, dimensions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id, title",
    [
      book.isbn13,
      book.title,
      book.image,
      book.date_published,
      book.synopsis,
      book.subjects,
      book.language,
      book.buy_link,
      book.binding,
      book.authors,
      book.title_long,
      book.pages,
      book.publisher,
      book.dimensions,
    ]
  );

  const bookId = result.rows[0].id;
  const bookTitle = result.rows[0].title;

  const {
    user: { id: userId },
  } = await verifyAuth();

  await client.query(
    "INSERT INTO used_books (user_id, book_id) VALUES ($1, $2)",
    [userId, bookId]
  );

  client.release();
  return bookTitle;
}

export async function isBookInDb(isbn, userId) {
  const client = await pool.connect();

  const result = await client.query(
    `SELECT *
     FROM books b
     JOIN used_books ub ON b.id = ub.book_id
     WHERE b.isbn13 = $1 AND ub.user_id = $2`,
    [isbn, userId]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  client.release();
  return null;
}

export async function getUserBooks(userId) {
  const client = await pool.connect();

  const result = await client.query(
    `SELECT b.isbn13, b.image, b.title 
     FROM used_books ub
     JOIN books b ON ub.book_id = b.id
     WHERE ub.user_id = $1`,
    [userId]
  );

  if (result.rows.length > 0) {
    return result.rows;
  }

  client.release();
  return null;
}

export async function deleteBookFromDb(isbn) {
  const client = await pool.connect();

  const {
    user: { id: userId },
  } = await verifyAuth();

  const bookResult = await client.query(
    `SELECT id AS book_id
     FROM books
     WHERE isbn13 = $1`,
    [isbn]
  );

  const bookId = bookResult.rows[0].book_id;

  await client.query(
    `DELETE FROM used_books WHERE book_id = $1 AND user_id = $2`,
    [bookId, userId]
  );

  client.release();
}

export async function updateBookLastOpened(userId, isbn) {
  const client = await pool.connect();

  const currentDate = new Date().toISOString();
  try {
    // 1. Отримуємо book_id за isbn13
    const bookResult = await client.query(
      `SELECT id FROM books WHERE isbn13 = $1`,
      [isbn]
    );

    if (bookResult.rows.length === 0) {
      throw new Error("Book not found");
    }

    const bookId = bookResult.rows[0].id;

    // 2. Оновлюємо last_opened_at в таблиці used_books
    await client.query(
      `UPDATE used_books
       SET last_opened_at = $1
       WHERE user_id = $2 AND book_id = $3`,
      [currentDate, userId, bookId]
    );
  } catch (error) {
    console.error("Error updating book last opened:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getLastOpenedBooks(userId) {
  const client = await pool.connect();

  const result = await client.query(
    `SELECT b.isbn13, b.title, b.image
     FROM used_books ub
     JOIN books b ON ub.book_id = b.id
     WHERE ub.user_id = $1
     ORDER BY ub.last_opened_at DESC
     LIMIT 8`,
    [userId]
  );

  client.release();
  return result.rows;
}
