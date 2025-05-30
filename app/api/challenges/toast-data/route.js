import {
  getTodayFailedChallenges,
  getTodayInProgressChallenges,
  updateExpiredChallenges,
  updateUpcomingChallenges,
} from "@/lib/db/challenge";

export async function PATCH(request) {
  const { userId } = await request.json();

  if (!userId) {
    return new Response("Missing userId", { status: 400 });
  }

  try {
    await updateExpiredChallenges();
    await updateUpcomingChallenges();

    const failed = await getTodayFailedChallenges(userId);
    const inProgress = await getTodayInProgressChallenges(userId);

    return Response.json({ failed, inProgress });
  } catch (err) {
    console.error("Challenge toast data fetch failed:", err);
    return new Response("Internal error", { status: 500 });
  }
}
