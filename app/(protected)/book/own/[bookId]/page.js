"use client";

import AddedBook from "@/components/BookPageComponents/AddedBook/added-book";
import { useRouter } from "nextjs13-progress";
import { useUser } from "@/context/UserContext";
import { use, useEffect, useState } from "react";
import { ReviewsProvider } from "@/context/ReviewsContext";

export default function OwnBookPage({ params }) {
  const { bookId } = use(params);

  const router = useRouter();

  const [book, setBook] = useState(null);
  const [dominantColor, setDominantColor] = useState(null);
  // const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchData() {
      const bookRes = await fetch(
        `/api/books/own-book-data?userId=${userId}&bookId=${bookId}`
      );
      // if (!bookRes.ok) {
      //   // Наприклад, перенаправлення чи показ повідомлення
      //   router.push("/books");
      //   return;
      // }
      const bookData = await bookRes.json();

      const bookImage = bookData?.image;

      const bookColorRes = await fetch("/api/books/book-color", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookImage }),
      });

      const { dominantColor } = await bookColorRes.json();

      setBook(bookData);
      setDominantColor(dominantColor);
      // setLoading(false);
    }

    fetchData();
  }, []);

  return (
    book && (
      <ReviewsProvider>
        <AddedBook book={book} bookColor={dominantColor} />
      </ReviewsProvider>
    )
  );
}
