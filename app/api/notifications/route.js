import { verifyAuth } from "@/lib/auth";
import {
  deleteUserNotification,
  getAllUserNotifications,
  readUserNotification,
} from "@/lib/db/notification";

export async function GET(req) {
  const { user } = await verifyAuth();
  const userId = user?.id;

  if (!userId) return new Response("Missing userID", { status: 400 });

  try {
    const messages = await getAllUserNotifications(userId);

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error get messages:", error);
    return new Response(JSON.stringify({ error: "Failed to get messages" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PATCH(req) {
  const { id } = await req.json();

  if (!id) return new Response("Missing notificationID", { status: 400 });

  await readUserNotification(id);
  return new Response("Notification is read", { status: 200 });
}

export async function DELETE(req) {
  const { id } = await req.json();

  if (!id) return new Response("Missing notificationID", { status: 400 });

  await deleteUserNotification(id);
  return new Response("Notification is deleted", { status: 200 });
}
