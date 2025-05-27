import { completeChallenge } from "@/lib/db/challenge";

export async function POST(req) {
  const { id } = await req.json();

  if (!id) return new Response("Missing ID", { status: 400 });

  try {
    await completeChallenge(id);
    return new Response("Challenge marked as completed", { status: 200 });
  } catch (err) {
    console.error("Error completing challenge:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
