import { deleteChallenge } from "@/lib/db/challenge";

export async function DELETE(req) {
  const { id } = await req.json();

  if (!id) return new Response("Missing ID", { status: 400 });

  try {
    await deleteChallenge(id);
    return new Response("Challenge deleted", { status: 200 });
  } catch (err) {
    console.error("Error deleting challenge:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
