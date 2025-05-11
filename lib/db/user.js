import pool from "./postgresDB";

export async function createUser(name, surname, username, email, password) {
  const client = await pool.connect();

  const result = await client.query(
    "INSERT INTO users (name, surname, username, email, hashed_password) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [name, surname, username, email, password]
  );

  client.release();
  return result.rows[0].id;
}

export async function getUserByEmail(email) {
  const client = await pool.connect();

  const result = await client.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  client.release();
  return result.rows[0];
}

export async function getUsername(userId) {
  const client = await pool.connect();

  const result = await client.query(
    "SELECT username FROM users WHERE id = $1",
    [userId]
  );

  if (result.rows.length > 0) {
    return result.rows[0].username;
  }

  client.release();
  return null;
}

export async function updateUserVisitStreak(userId) {
  const client = await pool.connect();
  const currentDate = new Date().toISOString().split("T")[0];

  try {
    const result = await client.query(
      `SELECT flame_score, date_of_last_visit FROM users WHERE id = $1`,
      [userId]
    );

    const { flame_score, date_of_last_visit } = result.rows[0];
    const currentDateObj = new Date(currentDate);
    const lastVisitDateObj = new Date(date_of_last_visit);

    let newStreak = flame_score;

    if (!date_of_last_visit) {
      newStreak = 1;
    } else {
      const diffInDays = Math.floor(
        (currentDateObj - lastVisitDateObj) / (1000 * 3600 * 24)
      );

      if (diffInDays === 1) {
        newStreak = visit_streak + 1;
      } else if (diffInDays > 1) {
        newStreak = 1;
      }
    }

    await client.query(
      `UPDATE users SET flame_score = $1, date_of_last_visit = $2 WHERE id = $3`,
      [newStreak, currentDate, userId]
    );

    return newStreak;
  } catch (error) {
    console.error("Error updating visit streak:", error);
    throw error;
  } finally {
    client.release();
  }
}
