"use server";

import pool from "./postgresDB";

export async function getRatingCounts(bookId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT
        book_rating,
        COUNT(*) AS count
      FROM reviews
      WHERE book_id = $1
      GROUP BY book_rating
      ORDER BY book_rating DESC
      `,
      [bookId]
    );

    const counts = {};
    for (const row of result.rows) {
      counts[row.book_rating] = parseInt(row.count, 10);
    }

    return counts;
  } catch {
    console.error("Error getting counts:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getBookReviews(bookId, userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT
        r.id,
        u.id AS user_id,
        u.image,
        u.name,
        u.surname,
        r.date,
        r.book_rating,
        r.review_rating,
        r.text,
        rv.vote_type
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN review_votes rv ON rv.review_id = r.id AND rv.user_id = $2
      WHERE r.book_id = $1;
      `,
      [bookId, userId]
    );

    return result.rows;
  } finally {
    client.release();
  }
}

export async function createReview(userId, bookId, rating, text) {
  const client = await pool.connect();

  try {
    await client.query(
      `
      INSERT INTO reviews (user_id, book_id, book_rating, text)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, bookId, rating, text]
    );
  } finally {
    client.release();
  }
}

export async function getReviewVote(userId, reviewId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT *
      FROM review_votes  
      WHERE user_id = $1 AND review_id = $2
      `,
      [userId, reviewId]
    );

    return result;
  } finally {
    client.release();
  }
}

export async function createReviewVote(userId, reviewId, action) {
  const client = await pool.connect();
  try {
    await client.query(
      `
      INSERT INTO review_votes (user_id, review_id, vote_type)
      VALUES ($1, $2, $3)
      `,
      [userId, reviewId, action]
    );
  } finally {
    client.release();
  }
}

export async function updateUserReviewVote(userId, reviewId, action) {
  const client = await pool.connect();
  try {
    await client.query(
      `
      UPDATE review_votes
      SET vote_type = $3
      WHERE user_id = $1 AND review_id = $2
      `,
      [userId, reviewId, action]
    );
  } finally {
    client.release();
  }
}

export async function updateReviewRating(rating, reviewId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      UPDATE reviews
      SET review_rating = review_rating + $1
      WHERE id = $2
      RETURNING review_rating
      `,
      [rating, reviewId]
    );

    return result.rows[0].review_rating;
  } finally {
    client.release();
  }
}

export async function deleteReviewFromDb(reviewId) {
  const client = await pool.connect();

  try {
    await client.query(
      `
      DELETE FROM review_votes
      WHERE review_id = $1
      `,
      [reviewId]
    );

    await client.query(
      `
      DELETE FROM reviews
      WHERE id = $1
      `,
      [reviewId]
    );
  } finally {
    client.release();
  }
}

export async function getReviewById(reviewId) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `
      SELECT r.*, b.title AS book_title
      FROM reviews r
      JOIN books b ON r.book_id = b.id
      WHERE r.id = $1
    `,
      [reviewId]
    );
    return res.rows[0];
  } finally {
    client.release();
  }
}
