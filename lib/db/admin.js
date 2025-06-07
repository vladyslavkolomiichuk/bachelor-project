"use server";

import pool from "./postgresDB";

export async function getAllBooksFromDb() {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT id, isbn13, image, title, title_long, authors, subjects, synopsis, pages, language, date_published, publisher, rating, buy_link, binding, dimensions, person_share_id
      FROM books
      `,
      []
    );

    return result.rows;
  } finally {
    client.release();
  }
}

export async function getAllUsersFromDb() {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT id, role, image, name, surname, username, email, date_of_first_visit, date_of_last_visit, flame_score
      FROM users
      `
    );

    return result.rows;
  } finally {
    client.release();
  }
}

export async function adminDeleteFromDb(type, itemId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (type === "users") {
      //
      // … (інші блоки видалення) …
      //

      // 1) Видаляємо ті голоси, які поставив користувач, і перераховуємо рейтинг
      await client.query(
        `
        WITH affected AS (
          DELETE FROM review_votes
          WHERE user_id = $1
          RETURNING review_id
        )
        UPDATE reviews
        SET review_rating = COALESCE((
          SELECT SUM(
            CASE 
              WHEN vote_type = 'upvote'   THEN  1
              WHEN vote_type = 'downvote' THEN -1
              ELSE 0
            END
          )
          FROM review_votes
          WHERE review_id = reviews.id
        ), 0)
        WHERE id IN (SELECT DISTINCT review_id FROM affected);
        `,
        [itemId]
      );

      // 2) Видаляємо голоси за відгуки, що належать цьому користувачу
      await client.query(
        `
        DELETE FROM review_votes
        WHERE review_id IN (
          SELECT id
          FROM reviews
          WHERE user_id = $1
        );
        `,
        [itemId]
      );

      // 3) Видаляємо самі відгуки користувача
      await client.query(
        `
        DELETE FROM reviews
        WHERE user_id = $1;
        `,
        [itemId]
      );

      // 4) Видаляємо used_books цього користувача
      await client.query(
        `
        DELETE FROM used_books
        WHERE user_id = $1;
        `,
        [itemId]
      );

      //
      // 5) Спочатку – видаляємо всі записи з note_sessions для цього користувача,
      //     з поверненням note_id, а потім – самі нотатки з таблиці notes.
      //
      await client.query(
        `
        WITH deleted_sessions AS (
          DELETE FROM note_sessions
          WHERE user_id = $1
          RETURNING note_id
        )
        DELETE FROM notes
        WHERE id IN (SELECT note_id FROM deleted_sessions);
        `,
        [itemId]
      );

      // 6) Видаляємо словникові слова користувача
      await client.query(
        `
        DELETE FROM dictionary_words
        WHERE user_id = $1;
        `,
        [itemId]
      );

      // 7) Видаляємо челенджі користувача
      await client.query(
        `
        DELETE FROM challenges
        WHERE user_id = $1;
        `,
        [itemId]
      );

      // 8) Видаляємо тести користувача
      await client.query(
        `
        DELETE FROM tests
        WHERE user_id = $1;
        `,
        [itemId]
      );

      // 9) Видаляємо сесії користувача (user_sessions)
      await client.query(
        `
        DELETE FROM user_sessions
        WHERE user_id = $1;
        `,
        [itemId]
      );

      // 10) Видаляємо сповіщення користувача
      await client.query(
        `
        DELETE FROM notifications
        WHERE user_id = $1;
        `,
        [itemId]
      );

      // 11) Видаляємо записи з підписок (subscribers)
      await client.query(
        `
        DELETE FROM subscribers
        WHERE follower_id = $1
          OR user_id     = $1;
        `,
        [itemId]
      );

      // 12) Видаляємо самого користувача
      await client.query(
        `
        DELETE FROM users
        WHERE id = $1;
        `,
        [itemId]
      );
    } else if (type === "books") {
      //
      // … (логіка видалення для книг, без змін) …
      //

      // Видаляємо used_books
      await client.query(
        `
        DELETE FROM used_books
        WHERE book_id = $1;
        `,
        [itemId]
      );

      // Видаляємо note_sessions для цієї книги
      // Покищо нотатки залишаються в базі даних!!!!!!!!!!!!
      await client.query(
        `
        DELETE FROM note_sessions
        WHERE book_id = $1;
        `,
        [itemId]
      );

      // Видаляємо голоси за відгуки цієї книги
      await client.query(
        `
        DELETE FROM review_votes
        WHERE review_id IN (
          SELECT id
          FROM reviews
          WHERE book_id = $1
        );
        `,
        [itemId]
      );

      // Видаляємо самі відгуки
      await client.query(
        `
        DELETE FROM reviews
        WHERE book_id = $1;
        `,
        [itemId]
      );

      // Видаляємо книгу
      await client.query(
        `
        DELETE FROM books
        WHERE id = $1;
        `,
        [itemId]
      );
    } else {
      throw new Error(`Unknown type for deletion: ${type}`);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in adminDeleteFromDb:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function adminAddBookToDb(book) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "INSERT INTO books (isbn13, title, image, date_published, synopsis, subjects, language, buy_link, binding, authors, title_long, pages, publisher, dimensions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
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

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function adminUpdateBookInDb(book) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      UPDATE books
      SET
        title = $1,
        image = $2,
        date_published = $3,
        synopsis = $4,
        subjects = $5,
        language = $6,
        buy_link = $7,
        binding = $8,
        authors = $9,
        title_long = $10,
        pages = $11,
        publisher = $12,
        dimensions = $13,
        isbn13 = $14
      WHERE id = $15
      RETURNING *;
      `,
      [
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
        book.isbn13,
        book.bookId,
      ]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function adminUpdateUserInDb(user) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      UPDATE users
      SET
        name = $1,
        surname = $2,
        email = $3,
        date_of_first_visit = $4,
        date_of_last_visit = $5,
        flame_score = $6,
        username = $7,
        role = $8,
        image = $9
      WHERE id = $10
      RETURNING *;
      `,
      [
        user.name,
        user.surname,
        user.email,
        user.dateOfFirstVisit,
        user.dateOfLastVisit,
        user.flameScore,
        user.username,
        user.role,
        user.image,
        user.id,
      ]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}
