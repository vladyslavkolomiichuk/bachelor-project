"use server";

import pool from "./postgresDB";

export async function addNote(
  title,
  description,
  startPage,
  endPage,
  timer,
  content,
  bookId,
  userId
) {
  const client = await pool.connect();

  const sql = `
      WITH new_note AS (
        INSERT INTO notes (title, description, note_text)
        VALUES ($1, $2, $3)
        RETURNING id
      ),
      inserted_session AS (
        INSERT INTO note_sessions (user_id, book_id, "time", start_page, finish_page, note_id)
        SELECT $4, $5, $6, $7, $8, id
        FROM new_note
        RETURNING book_id
      )
      SELECT isbn13 FROM books
      WHERE id = (SELECT book_id FROM inserted_session);
    `;

  const params = [
    title,
    description,
    content,
    userId,
    bookId,
    timer,
    startPage,
    endPage,
  ];

  const result = await client.query(sql, params);
  client.release();
  return result.rows[0].isbn13;
}

export async function updateNote(
  noteId,
  sessionId,
  title,
  description,
  startPage,
  endPage,
  timer,
  content,
  bookId
) {
  const client = await pool.connect();

  try {
    const sql = `
      WITH updated_note AS (
        UPDATE notes
        SET title = $1,
            description = $2,
            note_text = $3
        WHERE id = $4
        RETURNING id
      ),
      updated_session AS (
        UPDATE note_sessions
        SET book_id = $5,
            "time" = $6,
            start_page = $7,
            finish_page = $8
        WHERE id = $9 AND note_id = (SELECT id FROM updated_note)
        RETURNING book_id
      )
      SELECT isbn13 FROM books
      WHERE id = (SELECT book_id FROM updated_session);
    `;

    const params = [
      title,
      description,
      content,
      noteId,
      bookId,
      timer,
      startPage,
      endPage,
      sessionId,
    ];

    const result = await client.query(sql, params);
    return result.rows[0]?.isbn13;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getNotesByBook(bookId, userId) {
  const client = await pool.connect();

  try {
    const sql = `
      SELECT 
        ns.id AS session_id,
        n.id AS note_id,
        n.title,
        n.description,
        n.note_text,
        ns.time,
        ns.start_page,
        ns.finish_page,
        ns.date,
        b.title AS book_title,
        b.image AS book_image,
        b.id AS book_id
      FROM note_sessions ns
      JOIN notes n ON ns.note_id = n.id
      JOIN books b ON ns.book_id = b.id
      WHERE ns.book_id = $1 AND ns.user_id = $2
      ORDER BY ns.date DESC
    `;

    const result = await client.query(sql, [bookId, userId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching notes by book:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteNote(noteId, sessionId) {
  const client = await pool.connect();

  try {
    const sql = `
      WITH deleted_session AS (
        DELETE FROM note_sessions
        WHERE id = $1 AND note_id = $2
      ),
      deleted_note AS (
        DELETE FROM notes
        WHERE id = $2
      )
      SELECT 1;
    `;

    await client.query(sql, [sessionId, noteId]);
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getAllNotesByUser(userId) {
  const client = await pool.connect();

  try {
    const sql = `
      SELECT 
        ns.id AS session_id,
        n.id AS note_id,
        n.title,
        n.description,
        n.note_text,
        ns.time,
        ns.start_page,
        ns.finish_page,
        ns.date,
        b.title AS book_title,
        b.image AS book_image,
        b.id AS book_id
      FROM note_sessions ns
      JOIN notes n ON ns.note_id = n.id
      JOIN books b ON ns.book_id = b.id
      WHERE ns.user_id = $1
      ORDER BY ns.date DESC;
    `;

    const result = await client.query(sql, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching all user notes:", error);
    throw error;
  } finally {
    client.release();
  }
}
