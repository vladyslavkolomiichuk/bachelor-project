import pool from "@/lib/db/postgresDB";
import { verifyAuth } from "@/lib/auth";

export async function DELETE(req, { params }) {
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

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM messages WHERE chat_id = $1", [chatId]);

    await client.query("DELETE FROM chat_users WHERE chat_id = $1", [chatId]);

    await client.query("DELETE FROM chats WHERE id = $1", [chatId]);
    await client.query("COMMIT");
    return new Response("Deleted", { status: 204 });
  } catch (e) {
    await client.query("ROLLBACK");
    return new Response("Error deleting", { status: 500 });
  } finally {
    client.release();
  }
}
