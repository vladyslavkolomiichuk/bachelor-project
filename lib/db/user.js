import pool from "./postgresDB";

export async function createUser(name, surname, username, email, password) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "INSERT INTO users (name, surname, username, email, hashed_password) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, surname, username, email, password]
    );

    return result.rows[0].id;
  } finally {
    client.release();
  }
}

export async function getUserByEmail(email) {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getUsername(userId) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "SELECT username FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length > 0) {
      return result.rows[0].username;
    }

    return null;
  } finally {
    client.release();
  }
}

export async function getUserVisitData(userId) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT flame_score, date_of_last_visit FROM users WHERE id = $1`,
      [userId]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateUserVisitStreak(userId) {
  const client = await pool.connect();
  const currentDate = new Date().toISOString().split("T")[0];
  const currentDateObj = new Date(currentDate);

  try {
    const { flame_score, date_of_last_visit } = await getUserVisitData(userId);
    const lastVisitDateObj = date_of_last_visit
      ? new Date(date_of_last_visit)
      : null;

    let newStreak = flame_score ?? 0;

    if (!lastVisitDateObj) {
      newStreak = 1;
    } else {
      const diffInDays = Math.floor(
        (currentDateObj - lastVisitDateObj) / (1000 * 3600 * 24)
      );

      if (diffInDays === 1) {
        newStreak += 1;
      } else if (diffInDays > 1) {
        newStreak = 1;
      }
    }

    await client.query(
      `UPDATE users
       SET flame_score = $1,
           date_of_last_visit = $2
       WHERE id = $3`,
      [newStreak, currentDate, userId]
    );
  } finally {
    client.release();
  }
}

export async function getFullUserInfo(userId) {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function changeGeneralUserInfo(
  userId,
  name,
  surname,
  username,
  email
) {
  const client = await pool.connect();

  try {
    await client.query(
      `UPDATE users SET name = $1, surname = $2, username = $3, email = $4 WHERE id = $5`,
      [name, surname, username, email, userId]
    );
  } finally {
    client.release();
  }
}

export async function changeUserPassword(userId, hashedPassword) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `UPDATE users SET hashed_password = $1 WHERE id = $2 RETURNING username`,
      [hashedPassword, userId]
    );

    return result.rows[0].username;
  } finally {
    client.release();
  }
}

export async function changeUserImage(userId, imageUrl) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `UPDATE users SET image = $1 WHERE id = $2 RETURNING username`,
      [imageUrl, userId]
    );

    return result.rows[0].username;
  } finally {
    client.release();
  }
}
