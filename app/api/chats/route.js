import pool from "@/lib/db/postgresDB";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  const { user } = await verifyAuth();
  const userId = user?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const client = await pool.connect();

  try {
    const res = await client.query(
      `
      SELECT
        c.id,
        c.name,
        m.text AS last_message_text,
        m.created_at AS last_message_time,
        COUNT(mr.message_id) AS unread_count
      FROM chat_users cu
      JOIN chats c ON c.id = cu.chat_id
      LEFT JOIN LATERAL (
        SELECT * FROM messages 
        WHERE chat_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
      ) m ON true
      LEFT JOIN message_reads mr ON mr.user_id = cu.user_id 
        AND mr.read = false
        AND mr.message_id IN (
          SELECT id FROM messages WHERE chat_id = c.id
        )
      WHERE cu.user_id = $1
      GROUP BY c.id, c.name, m.text, m.created_at
      ORDER BY last_message_time DESC NULLS LAST
      `,
      [userId]
    );

    return new Response(JSON.stringify(res.rows), { status: 200 });
  } catch (e) {
    console.error("Chat list error", e);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    client.release();
  }
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
