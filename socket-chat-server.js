import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import pool from "./lib/db/postgresDB.js"; // твій pg pool

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userId) => {
      userSocketMap.set(userId, socket.id);
      console.log("Registered user:", userId);
    });

    socket.on("disconnect", () => {
      for (let [uid, sid] of userSocketMap.entries()) {
        if (sid === socket.id) {
          userSocketMap.delete(uid);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });

    socket.on(
      "sendMessage",
      async ({ chatId, userId, message, bookId = null }, callback) => {
        try {
          // Вставляємо повідомлення
          const insertRes = await pool.query(
            `INSERT INTO messages (chat_id, sender_id, text, book_id) VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
            [chatId, userId, message, bookId]
          );

          const messageId = insertRes.rows[0].id;

          // Отримуємо дані відправника
          const userRes = await pool.query(
            `SELECT username, image FROM users WHERE id = $1`,
            [userId]
          );
          const sender = userRes.rows[0];

          // Дані книги (якщо є)
          let book = { isbn13: "", title: "", image: "" };
          if (bookId) {
            const bookRes = await pool.query(
              `SELECT isbn13, title, image FROM books WHERE id = $1`,
              [bookId]
            );
            if (bookRes.rowCount > 0) {
              book = bookRes.rows[0];
            }
          }

          // Створюємо записи read = false для всіх користувачів чату, крім відправника
          await pool.query(
            `
            INSERT INTO message_reads (message_id, user_id, read)
            SELECT $1, user_id, false
            FROM chat_users
            WHERE chat_id = $2 AND user_id != $3
            `,
            [messageId, chatId, userId]
          );

          const msg = {
            id: messageId,
            chat_id: chatId,
            sender_id: userId,
            text: message,
            created_at: insertRes.rows[0].created_at,
            username: sender.username,
            image: sender.image,
            book_isbn13: book.isbn13,
            book_image: book.image,
            book_title: book.title,
          };

          // Відправляємо повідомлення всім учасникам чату
          const usersRes = await pool.query(
            `SELECT user_id FROM chat_users WHERE chat_id = $1`,
            [chatId]
          );

          usersRes.rows.forEach(({ user_id }) => {
            const sid = userSocketMap.get(user_id);
            if (sid) {
              io.to(sid).emit("newMessage", msg);
            }
          });

          callback({ success: true, msg });
        } catch (e) {
          console.error("Error sending message:", e);
          callback({ error: "Sending failed" });
        }
      }
    );
  });

  httpServer.listen(3002, () => {
    console.log("> Socket.IO server running at http://localhost:3002");
  });
});
