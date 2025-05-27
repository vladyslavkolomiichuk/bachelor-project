"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "@/components/GeneralComponents/SearchComponents/Loader/loader";
import TransparentBookBlock from "../TransparentBookBlock/transparent-book-block";
import styles from "./books-list.module.css";

export default function BooksList({getBooks}) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  const loadBooks = useCallback(async () => {
    setLoading(true);
    const newBooks = await getBooks(50, page);
    setBooks((prev) => [...prev, ...newBooks]);
    setHasMore(newBooks.length > 0);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const lastBookRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((p) => p + 1);
          }
        },
        { threshold: 1.0 }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <div className={styles.listContainer}>
        {books.map((book, idx) => {
          const isLast = idx === books.length - 1;
          return isLast ? (
            <div ref={lastBookRef} key={book.isbn13}>
              <TransparentBookBlock book={book} />
            </div>
          ) : (
            <TransparentBookBlock key={book.isbn13} book={book} />
          );
        })}
      </div>
      {loading && (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      )}
      {!hasMore && <p className={styles.end}>There are no more books.</p>}
    </>
  );
}
