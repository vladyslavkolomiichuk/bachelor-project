"use server";

import pool from "./postgresDB";

export async function getSiteStatistics() {
  const client = await pool.connect();

  try {
    const stats = {
      totalUsers: 0,
      activeUsers7d: 0,
      newUsers30d: 0,
      totalBooks: 0,
      uniqueUsedBooks: 0,
      totalReviews: 0,
      avgReviewRating: 0,
      totalNoteSessions: 0,
      totalDictionaryWords: 0,
      totalTestsTaken: 0,
      totalChallenges: 0,
    };

    {
      const { rows } = await client.query(`
        SELECT COUNT(*)::int AS count
        FROM users;
      `);
      stats.totalUsers = rows[0].count;
    }

    {
      const { rows } = await client.query(`
        SELECT COUNT(*)::int AS count
        FROM users
        WHERE date_of_last_visit >= CURRENT_DATE - INTERVAL '7 days';
      `);
      stats.activeUsers7d = rows[0].count;
    }

    {
      const { rows } = await client.query(`
        SELECT COUNT(*)::int AS count
        FROM users
        WHERE date_of_first_visit >= CURRENT_DATE - INTERVAL '30 days';
      `);
      stats.newUsers30d = rows[0].count;
    }

    {
      const { rows } = await client.query(`
        SELECT COUNT(*)::int AS count
        FROM books;
      `);
      stats.totalBooks = rows[0].count;
    }

    {
      const { rows } = await client.query(`
        SELECT COUNT(DISTINCT book_id)::int AS count
        FROM used_books;
      `);
      stats.uniqueUsedBooks = rows[0].count;
    }

    {
      const { rows } = await client.query(`
        SELECT COUNT(*)::int AS count
        FROM reviews;
      `);
      stats.totalReviews = rows[0].count;
    }

    {
      const { rows } = await client.query(`
        SELECT COALESCE(ROUND(AVG(review_rating)::numeric, 2), 0) AS avg
        FROM reviews;
      `);
      stats.avgReviewRating = parseFloat(rows[0].avg);
    }

    {
      const { rows } = await client.query(`
        SELECT COUNT(*)::int AS count
        FROM note_sessions;
      `);
      stats.totalNoteSessions = rows[0].count;
    }

    {
      const { rows } = await client.query(`
        SELECT COUNT(*)::int AS count
        FROM dictionary_words;
      `);
      stats.totalDictionaryWords = rows[0].count;
    }

    {
      const { rows } = await client.query(`
        SELECT COUNT(*)::int AS count
        FROM tests;
      `);
      stats.totalTestsTaken = rows[0].count;
    }

    {
      const { rows } = await client.query(`
        SELECT COUNT(*)::int AS count
        FROM challenges;
      `);
      stats.totalChallenges = rows[0].count;
    }

    return stats;
  } catch (error) {
    console.error("Error fetching site statistics:", error);
    throw error;
  } finally {
    client.release();
  }
}
