import AddedBook from "@/components/BookPageComponents/AddedBook/added-book";
import { notFound, redirect } from "next/navigation";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { headers } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export default async function OwnBookPage({ params }) {
  const { bookId } = await params;

  const {user} = await verifyAuth();
  const userId = user?.id;

  if (!userId) {
    redirect("/login");
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  const bookRes = await fetch(
    `${baseUrl}/api/books/own-book-data?userId=${userId}&bookId=${bookId}`,
    { cache: "no-store" }
  );

  if (bookRes.status === 404) {
    notFound();
  }

  const bookData = await bookRes.json();
  const bookImage = bookData?.image;

  const bookColorRes = await fetch(`${baseUrl}/api/books/book-color`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookImage }),
    cache: "no-store",
  });

  const { dominantColor } = await bookColorRes.json();

  return (
    <ReviewsProvider>
      <AddedBook book={bookData} bookColor={dominantColor} />
    </ReviewsProvider>
  );
}
