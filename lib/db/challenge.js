"use server";

import pool from "./postgresDB";

export async function getChallengesByUser(userId) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT id, message, start_date, end_date, category, status, date
       FROM challenges
       WHERE user_id = $1
       ORDER BY date DESC`,
      [userId]
    );

    return result.rows;
  } finally {
    client.release();
  }
}

export async function addChallenge(
  message,
  startDate,
  endDate,
  category,
  status,
  userId
) {
  const client = await pool.connect();

  try {
    await client.query(
      `INSERT INTO challenges (user_id, message, start_date, end_date, category, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, message, startDate, endDate, category, status]
    );
  } finally {
    client.release();
  }
}

export async function updateChallenge(
  id,
  message,
  startDate,
  endDate,
  category,
  status
) {
  const client = await pool.connect();

  try {
    await client.query(
      `UPDATE challenges
       SET message = $1,
           start_date = $2,
           end_date = $3,
           category = $4,
           status = $5
       WHERE id = $6`,
      [message, startDate, endDate, category, status, id]
    );
  } finally {
    client.release();
  }
}

export async function updateExpiredChallenges() {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE challenges
       SET status = 'failed'
       WHERE status = 'in-progress' AND end_date::date <= CURRENT_DATE;`
    );
  } finally {
    client.release();
  }
}

export async function getInProgressCount(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT COUNT(*) FROM challenges
       WHERE user_id = $1 AND status = 'in-progress'`,
      [userId]
    );
    return parseInt(result.rows[0].count, 10);
  } finally {
    client.release();
  }
}

export async function getTodayInProgressChallenges(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM challenges
       WHERE user_id = $1 AND status = 'in-progress'`,
      [userId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getTodayFailedChallenges(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT message FROM challenges
       WHERE user_id = $1 AND status = 'failed'
       AND end_date::date = CURRENT_DATE`,
      [userId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function completeChallenge(challengeId) {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE challenges SET status = 'completed' WHERE id = $1`,
      [challengeId]
    );
  } finally {
    client.release();
  }
}

export async function deleteChallenge(challengeId) {
  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM challenges WHERE id = $1`, [challengeId]);
  } finally {
    client.release();
  }
}
