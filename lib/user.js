import pool from "./postgresDB";

export async function createUser(name, surname, username, email, password) {
  const result = await pool.query(
    "INSERT INTO users (name, surname, username, email, hashed_password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id",
    [name, surname, username, email, password]
  );

  return result.rows[0].user_id;
}

export async function getUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  
  return result.rows[0];
}
