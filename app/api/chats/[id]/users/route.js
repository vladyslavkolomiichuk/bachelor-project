import pool from "@/lib/db/postgresDB";
import { verifyAuth } from "@/lib/auth";
import { addNotificationForUser } from "@/lib/db/notification";
import { sanitizeInputBack } from "@/lib/sanitize-text";
import { io } from "socket.io-client";

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
    "SELECT id, image FROM users WHERE username = $1",
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

  const chatRes = await client.query("SELECT name FROM chats WHERE id = $1", [
    chatId,
  ]);

  const ownerRes = await client.query(
    "SELECT username FROM users WHERE id = $1",
    [userId]
  );

  const safeUsername = sanitizeInputBack(ownerRes.rows[0]?.username);
  const safeChatName = sanitizeInputBack(chatRes.rows[0]?.name);

  const title = "You have been added to the chat";
  const message = `<span>${safeUsername}</span> added you to the chat <span>"${safeChatName}"</span>.`;

  await addNotificationForUser(newUserId, title, message, "review");

  try {
    const chatInfoRes = await client.query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM messages m 
         LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = $1
         WHERE m.chat_id = c.id AND (mr.read = false OR mr.read IS NULL)
        ) as unread_count,
        (SELECT m.text FROM messages m 
         WHERE m.chat_id = c.id 
         ORDER BY m.created_at DESC LIMIT 1
        ) as last_message_text,
        (SELECT m.created_at FROM messages m 
         WHERE m.chat_id = c.id 
         ORDER BY m.created_at DESC LIMIT 1
        ) as last_message_time
      FROM chats c 
      WHERE c.id = $2`,
      [newUserId, chatId]
    );

    const chatInfo = chatInfoRes.rows[0];

    const socket = io("http://localhost:3002");
    socket.emit("addUserToChat", {
      newUserId,
      chatId,
      chat: chatInfo,
    });
    socket.disconnect();

  } catch (error) {
    client.release();
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }

  client.release();
  return new Response(
    JSON.stringify({ id: newUserId, username, image: userRes.rows[0].image }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
