import pool from "@/lib/db/postgresDB";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  const { user } = await verifyAuth();
  const userId = user?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const client = await pool.connect();

  // Вибрати чати, де є користувач
  const res = await client.query(
    `SELECT c.id, c.name
     FROM chats c
     JOIN chat_users cu ON cu.chat_id = c.id
     WHERE cu.user_id = $1`,
    [userId]
  );

  client.release();
  return new Response(JSON.stringify(res.rows), { status: 200 });
}

export async function POST(req) {
  const { user } = await verifyAuth();
  const userId = user?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { name } = await req.json();
  if (!name) return new Response("Chat name required", { status: 400 });

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const res = await client.query(
        "INSERT INTO chats (name) VALUES ($1) RETURNING id, name",
        [name]
      );
      const chat = res.rows[0];

      await client.query(
        "INSERT INTO chat_users (chat_id, user_id) VALUES ($1, $2)",
        [chat.id, userId]
      );

      await client.query("COMMIT");
      return new Response(JSON.stringify(chat), { status: 201 });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      return new Response("Database error", { status: 500 });
    } finally {
      client.release();
    }
  } catch (err) {
    return new Response("DB connection error", { status: 500 });
  }
}
