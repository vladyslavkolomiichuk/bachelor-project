import UnaddedBook from "@/components/BookPageComponents/UnaddedBook/unadded-book";
import AddedBook from "@/components/BookPageComponents/AddedBook/added-book";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { notFound as notFoundFunction } from "next/navigation";
import { headers } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export default async function BookPage({ params }) {
  const { bookISBN } = await params;

  const { user } = await verifyAuth();
  const userId = user?.id;

  if (!bookISBN) {
    notFoundFunction();
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  const bookRes = await fetch(`${baseUrl}/api/books/book-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, bookISBN }),
    cache: "no-store",
  });

  if (!bookRes.ok) {
    notFoundFunction();
  }

  const { userBookDb, book } = await bookRes.json();

  if (!userBookDb && !book) {
    notFoundFunction();
  }

  const bookImage = userBookDb?.image ?? book?.image;

  const bookColorRes = await fetch(`${baseUrl}/api/books/book-color`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookImage }),
    cache: "no-store",
  });

  if (!bookColorRes.ok) {
    notFoundFunction();
  }

  const { dominantColor } = await bookColorRes.json();

  const bookComponent = userBookDb ? (
    <AddedBook book={userBookDb} bookColor={dominantColor} />
  ) : (
    <UnaddedBook book={book} bookColor={dominantColor} />
  );

  return <ReviewsProvider>{bookComponent}</ReviewsProvider>;
}
