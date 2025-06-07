import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import pool from "./lib/db/postgresDB.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const client = await pool.connect();
  await client.query("LISTEN new_notification");

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
  });

  client.on("notification", (msg) => {
    if (msg.channel === "new_notification") {
      const data = JSON.parse(msg.payload);
      const targetUserId = data.user_id;
      const socketId = userSocketMap.get(targetUserId);
      if (socketId) {
        io.to(socketId).emit("notification", {
          id: data.id,
          title: data.title,
          message: data.message,
          is_read: data.is_read,
          created_at: data.created_at,
          type: data.type,
        });
        console.log("Message sent:", targetUserId);
      }
    }
  });

  httpServer.listen(3001, () => {
    console.log("> The server is running at http://localhost:3001");
  });
});
