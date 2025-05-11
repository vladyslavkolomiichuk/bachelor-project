import { verifyAuth } from "@/lib/auth";
import { getUsername, updateUserVisitStreak } from "@/lib/db/user";

export async function GET(req) {
  const result = await verifyAuth();

  if (!result.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = result.user.id;

  const username = await getUsername(userId);
  const userVisitScore = await updateUserVisitStreak(userId);

  return new Response(JSON.stringify({ username, userVisitScore }), {
    headers: { "Content-Type": "application/json" },
  });
}
