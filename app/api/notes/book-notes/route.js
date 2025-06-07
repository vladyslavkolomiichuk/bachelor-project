import { getNotesByBook } from "@/lib/db/note";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");
    const userId = searchParams.get("userId");

    if (!bookId || !userId) {
      return Response.json({ error: "Missing bookId or userId" }, { status: 400 });
    }

    const notes = await getNotesByBook(bookId, userId);    
    return Response.json(notes);
  } catch (error) {
    console.error("Error getting notes:", error);
    return Response.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
