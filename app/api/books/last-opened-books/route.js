import { getLastOpenedBooks, updateBookLastOpened } from "@/lib/db/book";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const books = await getLastOpenedBooks(userId);
    return Response.json(books);
  } catch (error) {
    console.error("Get last books error:", error);
    return Response.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { userId, bookId } = await req.json();

    if (!userId || !bookId) {
      return Response.json(
        { error: "Missing userId or bookId" },
        { status: 400 }
      );
    }

    await updateBookLastOpened(userId, bookId);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Update last books error:", error);
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }
}
