import { updateUserVisitStreak, getUserVisitData } from "@/lib/db/user";

export async function PATCH(request) {
  const { userId } = await request.json();

  if (!userId) {
    return new Response("Missing userId", { status: 400 });
  }

  try {
    await updateUserVisitStreak(userId);
    const { flame_score: score } = await getUserVisitData(userId);

    return Response.json({ flameScore: score });
  } catch (err) {
    console.error("Visit streak update failed:", err);
    return new Response("Internal error", { status: 500 });
  }
}
