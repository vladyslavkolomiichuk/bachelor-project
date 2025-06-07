import pool from "@/lib/db/postgresDB";
import { verifyAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  const { user } = await verifyAuth();
  const userId = user?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { id: chatId } = await params;

  const client = await pool.connect();
  try {
    const resCheck = await client.query(
      "SELECT * FROM chat_users WHERE chat_id = $1 AND user_id = $2",
      [chatId, userId]
    );
    if (resCheck.rowCount === 0) {
      client.release();
      return new Response("Forbidden", { status: 403 });
    }

    const resUsers = await client.query(
      `SELECT u.id, u.username, u.image
       FROM users u
       JOIN chat_users cu ON u.id = cu.user_id
       WHERE cu.chat_id = $1`,
      [chatId]
    );

    return new Response(JSON.stringify(resUsers.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    client.release();
  }
}

export async function POST(req, { params }) {
  const { user } = await verifyAuth();
  const userId = user?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { id: chatId } = await params;
  const { username } = await req.json();

  if (!username) return new Response("Username required", { status: 400 });

  const client = await pool.connect();

  const resCheck = await client.query(
    "SELECT * FROM chat_users WHERE chat_id = $1 AND user_id = $2",
    [chatId, userId]
  );
  if (resCheck.rowCount === 0) {
    client.release();
    return new Response("Forbidden", { status: 403 });
  }

  const userRes = await client.query(
    "SELECT id FROM users WHERE username = $1",
    [username]
  );
  if (userRes.rowCount === 0) {
    client.release();
    return new Response("User not found", { status: 404 });
  }
  const newUserId = userRes.rows[0].id;

  const exists = await client.query(
    "SELECT * FROM chat_users WHERE chat_id = $1 AND user_id = $2",
    [chatId, newUserId]
  );
  if (exists.rowCount > 0) {
    client.release();
    return new Response("User already in chat", { status: 400 });
  }

  await client.query(
    "INSERT INTO chat_users (chat_id, user_id) VALUES ($1, $2)",
    [chatId, newUserId]
  );

  client.release();
  return new Response("User added", { status: 201 });
}
