"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "@/components/GeneralComponents/SearchComponents/Loader/loader";
import TransparentBookBlock from "../TransparentBookBlock/transparent-book-block";
import styles from "./books-list.module.css";

export default function BooksList({ getBooks, query = "" }) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  useEffect(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    let ignore = false;
    const loadBooks = async () => {
      setLoading(true);
      let newBooks;
      if (query) {
        newBooks = await getBooks(query, 40, page);
      } else {
        newBooks = await getBooks(40, page);
      }
      if (!ignore) {
        setBooks((prev) => (page === 1 ? newBooks : [...prev, ...newBooks]));
        setHasMore(newBooks.length >= 40);
        setLoading(false);
      }
    };
    loadBooks();
    return () => {
      ignore = true;
    };
  }, [page, query, getBooks]);

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
