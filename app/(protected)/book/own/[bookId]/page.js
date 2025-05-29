import AddedBook from "@/components/BookPageComponents/AddedBook/added-book";
import { getColorsFromImage } from "@/lib/color-finder";
import { verifyAuth } from "@/lib/auth";
import { getUserBookDb } from "@/lib/db/book";
import { redirect } from "next/navigation";

export default async function OwnBookPage({ params }) {
  const result = await verifyAuth();

  if (!result.user) {
    redirect("/login");
  }

  const { bookId } = await params;

  const book = await getUserBookDb(bookId, result.user.id);

  const coverImg = book.image || "/default-image.png";
  const colors = await getColorsFromImage(coverImg);
  const dominantColor = colors[3];

  return (
    <AddedBook
      book={book}
      bookColor={dominantColor}
      userId={result.user.id}
    />
  );
}
