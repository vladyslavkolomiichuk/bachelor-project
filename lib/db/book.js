"use server";

import { fetchBookByISBN } from "../api/books";
import { verifyAuth } from "../auth";
import pool from "./postgresDB";

export async function addBookToUserLib(book, isPersonShareId = false) {
  const client = await pool.connect();

  try {
    const existingBookResult = await client.query(
      "SELECT id FROM books WHERE isbn13 = $1",
      [book.isbn13]
    );

    if (existingBookResult.rows.length > 0) {
      const existingBookId = existingBookResult.rows[0].id;

      const {
        user: { id: userId },
      } = await verifyAuth();

      await client.query(
        "INSERT INTO used_books (user_id, book_id) VALUES ($1, $2)",
        [userId, existingBookId]
      );
      return;
    }

    const {
      user: { id: userId },
    } = await verifyAuth();

    const result = await client.query(
      "INSERT INTO books (isbn13, title, image, date_published, synopsis, subjects, language, buy_link, binding, authors, title_long, pages, publisher, dimensions, person_share_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id",
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
        isPersonShareId ? userId : null,
      ]
    );

    const bookId = result.rows[0].id;

    await client.query(
      "INSERT INTO used_books (user_id, book_id) VALUES ($1, $2)",
      [userId, bookId]
    );
  } finally {
    client.release();
  }
}

export async function addBookToDbFromApi(bookIsbn) {
  const bookApi = await fetchBookByISBN(bookIsbn);

  const client = await pool.connect();

  try {
    const result = await client.query(
      "INSERT INTO books (isbn13, title, image, date_published, synopsis, subjects, language, buy_link, binding, authors, title_long, pages, publisher, dimensions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id",
      [
        bookApi.isbn13,
        bookApi.title,
        bookApi.image,
        bookApi.date_published,
        bookApi.synopsis,
        bookApi.subjects,
        bookApi.language,
        bookApi.buy_link,
        bookApi.binding,
        bookApi.authors,
        bookApi.title_long,
        bookApi.pages,
        bookApi.publisher,
        bookApi.dimensions,
      ]
    );

    return result.rows[0].id;
  } finally {
    client.release();
  }
}

export async function isBookInDbByIsbn(bookIsbn) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT *
      FROM books 
      WHERE isbn13 = $1`,
      [bookIsbn]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    return null;
  } finally {
    client.release();
  }
}

export async function isBookInDbById(bookId) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT *
      FROM books 
      WHERE id = $1`,
      [bookId]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    return null;
  } finally {
    client.release();
  }
}

export async function getUserBookDb(bookId, userId) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT *
     FROM books b
     JOIN used_books ub ON b.id = ub.book_id
     WHERE b.id = $1 AND ub.user_id = $2`,
      [bookId, userId]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getUserBooks(userId) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT b.id, b.isbn13, b.image, b.title, b.person_share_id, ub.category 
     FROM used_books ub
     JOIN books b ON ub.book_id = b.id
     WHERE ub.user_id = $1`,
      [userId]
    );

    if (result.rows.length > 0) {
      return result.rows;
    }

    return [];
  } finally {
    client.release();
  }
}

export async function deleteBookFromDb(isbn) {
  const client = await pool.connect();

  try {
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
  } finally {
    client.release();
  }
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

  try {
    const result = await client.query(
      `SELECT b.id, b.isbn13, b.title, b.image, b.person_share_id
     FROM used_books ub
     JOIN books b ON ub.book_id = b.id
     WHERE ub.user_id = $1
     ORDER BY ub.last_opened_at DESC
     LIMIT 8`,
      [userId]
    );

    return result.rows;
  } finally {
    client.release();
  }
}

export async function getUserBookSubjects(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT DISTINCT subject
      FROM (
        SELECT UNNEST(b.subjects) AS subject
        FROM used_books ub
          JOIN books b ON ub.book_id = b.id
        WHERE ub.user_id = $1
      ) AS all_subjects
      ORDER BY subject;
      `,
      [userId]
    );
    return result.rows.map((r) => r.subject);
  } finally {
    client.release();
  }
}

export async function getUserBookAuthors(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT DISTINCT author
      FROM (
        SELECT UNNEST(b.authors) AS author
        FROM used_books ub
          JOIN books b ON ub.book_id = b.id
        WHERE ub.user_id = $1
      ) AS all_authors
      ORDER BY author;
      `,
      [userId]
    );
    return result.rows.map((r) => r.author);
  } finally {
    client.release();
  }
}

export async function updateUserBookCategory(userId, bookId, category) {
  const client = await pool.connect();
  try {
    await client.query(
      `
      UPDATE used_books
      SET category = $1  
      WHERE book_id = $2
        AND user_id = $3
      `,
      [category, bookId, userId]
    );
  } finally {
    client.release();
  }
}

export async function getRatingByBookIsbn(bookIsbn) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT rating 
      FROM books
      WHERE isbn13 = $1
      `,
      [bookIsbn]
    );

    return result.rows[0]?.rating ?? 0;
  } finally {
    client.release();
  }
}
