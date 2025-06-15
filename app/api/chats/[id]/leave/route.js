import pool from "@/lib/db/postgresDB";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  const { user } = await verifyAuth();
  const userId = user?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { id: chatId } = await params;

  const client = await pool.connect();

  try {
    const res = await client.query(
      "DELETE FROM chat_users WHERE chat_id = $1 AND user_id = $2",
      [chatId, userId]
    );

    if (res.rowCount === 0) {
      return new Response("Not in chat", { status: 404 });
    }

    return new Response("Left chat", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Error leaving chat", { status: 500 });
  } finally {
    client.release();
  }
}
