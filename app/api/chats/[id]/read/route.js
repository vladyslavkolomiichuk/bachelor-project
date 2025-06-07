import pool from "@/lib/db/postgresDB";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  const { user } = await verifyAuth();
  const userId = user?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { id: chatId } = await params;

  const client = await pool.connect();

  try {
    await client.query(
      `
      UPDATE message_reads mr
      SET read = true, read_at = NOW()
      FROM messages m
      WHERE mr.message_id = m.id
        AND mr.user_id = $1
        AND m.chat_id = $2
        AND mr.read = false
      `,
      [userId, chatId]
    );

    return new Response("Read status updated", { status: 200 });
  } catch (e) {
    console.error("Error updating read status", e);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    client.release();
  }
}
