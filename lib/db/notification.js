"use server";

import pool from "./postgresDB";

export async function getAllUserNotifications(userId) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT * 
      FROM notifications
      WHERE user_id = $1
      `,
      [userId]
    );

    return result.rows;
  } finally {
    client.release();
  }
}

export async function readUserNotification(notificationId) {
  const client = await pool.connect();

  try {
    await client.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1
      `,
      [notificationId]
    );
  } finally {
    client.release();
  }
}

export async function deleteUserNotification(notificationId) {
  const client = await pool.connect();

  try {
    await client.query(
      `
      DELETE 
      FROM notifications
      WHERE id = $1
      `,
      [notificationId]
    );
  } finally {
    client.release();
  }
}

export async function addNotificationForUser(userId, title, message, type) {
  const client = await pool.connect();

  try {
    await client.query(
      `
      INSERT INTO notifications (user_id, title, message, type)
      VALUES ($1, $2, $3, $4)
    `,
      [userId, title, message, type]
    );
  } finally {
    client.release();
  }
}

export async function addNotificationForAll(title, message) {
  const client = await pool.connect();

  try {
    await client.query(
      `
      INSERT INTO notifications (user_id, title, message, type)
      SELECT id, $1, $2, 'system' FROM users
      `,
      [title, message]
    );
  } finally {
    client.release();
  }
}
