"use client";

import UnaddedBook from "@/components/BookPageComponents/UnaddedBook/unadded-book";
import AddedBook from "@/components/BookPageComponents/AddedBook/added-book";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { use, useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export default function BookPage({ params }) {
  const { bookISBN } = use(params);
  const { user } = useUser();
  const userId = user?.id ?? null;

  const [bookChildren, setBookChildren] = useState(null);

  useEffect(() => {
    // if (userId === undefined || bookISBN === undefined) return;
    async function loadBook() {
      const bookRes = await fetch("/api/books/book-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookISBN }),
      });

      const { userBookDb, book } = await bookRes.json();

      const bookImage = userBookDb?.image ?? book?.image;

      const bookColorRes = await fetch("/api/books/book-color", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookImage }),
      });

      const { dominantColor } = await bookColorRes.json();

      const component = userBookDb ? (
        <AddedBook book={userBookDb} bookColor={dominantColor} />
      ) : (
        <UnaddedBook book={book} bookColor={dominantColor} />
      );

      setBookChildren(component);
    }

    loadBook();
  }, [userId]);

  return <ReviewsProvider>{bookChildren}</ReviewsProvider>;
}
