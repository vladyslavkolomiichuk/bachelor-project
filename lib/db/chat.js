"use server";

import pool from "./postgresDB";

export async function getUnreadMessageCount(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT COUNT(*) FROM message_reads
      WHERE user_id = $1 AND read = false
      `,
      [userId]
    );
    return parseInt(result.rows[0].count, 10);
  } finally {
    client.release();
  }
}
