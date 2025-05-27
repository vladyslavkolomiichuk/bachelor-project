"use server";

import pool from "./postgresDB";

export async function saveTestResult(userId, wpm, comprehension, time) {
  const client = await pool.connect();
  console.log(userId, wpm, comprehension, time);

  try {
    await client.query(
      `INSERT INTO tests (user_id, wpm, comprehension, time)
       VALUES ($1, $2, $3, $4)`,
      [userId, wpm, comprehension, time]
    );
  } finally {
    client.release();
  }
}
