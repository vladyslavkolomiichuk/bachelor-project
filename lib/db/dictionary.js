"use server";

import pool from "./postgresDB";

export async function getDictionaryWords(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, word, meaning, category, date 
       FROM dictionary_words
       WHERE user_id = $1
       ORDER BY date DESC`,
      [userId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function addWordToDb(userId, word, meaning, category, date) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO dictionary_words(user_id, word, meaning, category, date)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, word, meaning, category, date`,
      [userId, word, meaning, category, date]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function deleteWordFromDb(id) {
  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM dictionary_words WHERE id = $1`, [id]);
  } finally {
    client.release();
  }
}

export async function updateWordToDb(
  userId,
  id,
  word,
  meaning,
  category,
  date
) {
  const client = await pool.connect();
  try {
    if (id) {
      await client.query(
        `UPDATE public.dictionary_words
         SET word = $2, meaning = $3, category = $4, date = $5
         WHERE id = $1`,
        [id, word, meaning, category, date]
      );
    } else {
      await client.query(
        `INSERT INTO public.dictionary_words (user_id, word, meaning, category, date)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, word, meaning, category, date]
      );
    }
  } finally {
    client.release();
  }
}
