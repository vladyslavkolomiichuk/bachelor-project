"use server";

import { fetchBookByISBN } from "../api/books";
import { verifyAuth } from "../auth";
import { deleteImage } from "../cloudinary";
import { supabase } from "../supabase";
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

    const bookResult = await client.query(
      "INSERT INTO books (isbn13, title, image, date_published, synopsis, subjects, language, buy_link, binding, authors, title_long, pages, publisher, dimensions, person_share_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id, isbn13, image, title, person_share_id",
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

    const bookId = bookResult.rows[0].id;

    const uaedBookResult = await client.query(
      "INSERT INTO used_books (user_id, book_id) VALUES ($1, $2)",
      [userId, bookId]
    );

    return bookResult.rows[0];
  } finally {
    client.release();
  }
}

export async function addArticleToUserLib(article, isPersonShareId = false) {
  const client = await pool.connect();

  try {
    const existingArticleResult = await client.query(
      "SELECT id FROM books WHERE doi = $1",
      [article.doi]
    );

    if (existingArticleResult.rows.length > 0) {
      const existingArticleId = existingArticleResult.rows[0].id;

      const {
        user: { id: userId },
      } = await verifyAuth();

      await client.query(
        "INSERT INTO used_books (user_id, book_id) VALUES ($1, $2)",
        [userId, existingArticleId]
      );

      return;
    }

    const {
      user: { id: userId },
    } = await verifyAuth();

    const articleResult = await client.query(
      "INSERT INTO books (doi, title, image, date_published, subjects, language, authors, title_long, pages, person_share_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, doi, image, title, person_share_id",
      [
        article.doi,
        article.title,
        article.image,
        article.date_published,
        article.subjects,
        article.language,
        article.authors,
        article.title_long,
        article.pages,
        isPersonShareId ? userId : null,
      ]
    );

    const articleId = articleResult.rows[0].id;

    await client.query(
      "INSERT INTO used_books (user_id, book_id) VALUES ($1, $2)",
      [userId, articleId]
    );

    return articleResult.rows[0];
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
      WHERE isbn13 = $1 AND person_share_id IS NULL`,
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
      `SELECT b.id, b.isbn13, b.doi, b.image, b.title, b.person_share_id, ub.category 
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

export async function deleteBookFromDb(isbn, isOwnBook) {
  const client = await pool.connect();

  try {
    const {
      user: { id: userId },
    } = await verifyAuth();

    // Get book info including image and PDF URL
    const bookResult = await client.query(
      `SELECT b.id AS book_id, b.image, ub.pdf_file_url
       FROM books b
       LEFT JOIN used_books ub ON b.id = ub.book_id AND ub.user_id = $2
       WHERE b.isbn13 = $1`,
      [isbn, userId]
    );

    const { book_id: bookId, image, pdf_file_url } = bookResult.rows[0];

    await client.query("BEGIN");

    try {
      // Delete PDF from Supabase if exists
      if (pdf_file_url) {
        const folderPath = `books/${bookId}/${userId}/`;

        const { data: list, error: listError } = await supabase.storage
          .from("books-pdf")
          .list(folderPath, { limit: 100 });

        if (listError) {
          console.error("Error listing files:", listError);
          throw listError;
        }

        if (list && list.length > 0) {
          const filesToDelete = list.map((file) => `${folderPath}${file.name}`);
          const { error: deleteError } = await supabase.storage
            .from("books-pdf")
            .remove(filesToDelete);

          if (deleteError) {
            console.error("Error deleting PDF files:", deleteError);
            throw deleteError;
          }
        }
      }

      // Delete from used_books
      await client.query(
        `DELETE FROM used_books WHERE book_id = $1 AND user_id = $2`,
        [bookId, userId]
      );

      // If it's user's own book, delete image and book record
      if (isOwnBook) {
        if (image) {
          await deleteImage(image);
        }

        await client.query(`DELETE FROM books WHERE id = $1`, [bookId]);
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } finally {
    client.release();
  }
}

export async function deleteArticleFromDb(doi) {
  const client = await pool.connect();

  try {
    const {
      user: { id: userId },
    } = await verifyAuth();

    // Get article info and PDF URL
    const articleResult = await client.query(
      `SELECT b.id AS article_id, b.image, ub.pdf_file_url
       FROM books b
       LEFT JOIN used_books ub ON b.id = ub.book_id AND ub.user_id = $2
       WHERE b.doi = $1`,
      [doi, userId]
    );

    const {
      article_id: articleId,
      image,
      pdf_file_url,
    } = articleResult.rows[0];

    await client.query("BEGIN");

    try {
      // Delete PDF from Supabase if exists
      if (pdf_file_url) {
        const folderPath = `books/${articleId}/${userId}/`;

        const { data: list, error: listError } = await supabase.storage
          .from("books-pdf")
          .list(folderPath, { limit: 100 });

        if (listError) {
          console.error("Error listing files:", listError);
          throw listError;
        }

        if (list && list.length > 0) {
          const filesToDelete = list.map((file) => `${folderPath}${file.name}`);
          const { error: deleteError } = await supabase.storage
            .from("books-pdf")
            .remove(filesToDelete);

          if (deleteError) {
            console.error("Error deleting PDF files:", deleteError);
            throw deleteError;
          }
        }
      }

      // Delete image from Cloudinary if exists
      if (image) {
        await deleteImage(image);
      }

      // Delete from used_books and books tables
      await client.query(
        `DELETE FROM used_books WHERE book_id = $1 AND user_id = $2`,
        [articleId, userId]
      );

      await client.query(`DELETE FROM books WHERE id = $1`, [articleId]);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } finally {
    client.release();
  }
}

export async function updateBookLastOpened(userId, bookId) {
  const client = await pool.connect();

  const currentDate = new Date().toISOString();
  try {
    // // 1. Отримуємо book_id за isbn13
    // const bookResult = await client.query(
    //   `SELECT id FROM books WHERE isbn13 = $1`,
    //   [isbn]
    // );

    // if (bookResult.rows.length === 0) {
    //   throw new Error("Book not found");
    // }

    // const bookId = bookResult.rows[0].id;

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

export async function uploadBookPDFUrl(file, bookId, userId) {
  const client = await pool.connect();

  try {
    await client.query(
      `
      UPDATE used_books
      SET pdf_file_url = $1
      WHERE book_id = $2 AND user_id = $3;
      `,
      [file, bookId, userId]
    );
  } finally {
    client.release();
  }
}

export async function getBookPDFUrl(bookId, userId) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT pdf_file_url
      FROM used_books
      WHERE book_ID = $1 AND user_id = $2
      `,
      [bookId, userId]
    );
    return result.rows[0].pdf_file_url;
  } finally {
    client.release();
  }
}

export async function removeBookPDFUrl(bookId, userId) {
  const client = await pool.connect();

  try {
    await client.query(
      `
      UPDATE used_books
      SET pdf_file_url = NULL
      WHERE book_id = $1 AND user_id = $2;
      `,
      [bookId, userId]
    );
  } finally {
    client.release();
  }
}
