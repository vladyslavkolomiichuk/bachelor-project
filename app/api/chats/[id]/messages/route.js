import pool from "@/lib/db/postgresDB";
import { verifyAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  const { user } = await verifyAuth();
  const userId = user?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { id: chatId } = await params;

  const client = await pool.connect();

  const resCheck = await client.query(
    "SELECT * FROM chat_users WHERE chat_id = $1 AND user_id = $2",
    [chatId, userId]
  );
  if (resCheck.rowCount === 0) {
    client.release();
    return new Response("Forbidden", { status: 403 });
  }

  const res = await client.query(
    `SELECT 
      m.id, 
      m.text, 
      m.created_at, 
      m.sender_id,
      u.username,
      u.image,
      b.isbn13 AS book_isbn13,
      b.title AS book_title,
      b.image AS book_image
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    LEFT JOIN books b ON m.book_id = b.id
    WHERE m.chat_id = $1
    ORDER BY m.created_at ASC`,
    [chatId]
  );

  client.release();
  return new Response(JSON.stringify(res.rows), { status: 200 });
}
