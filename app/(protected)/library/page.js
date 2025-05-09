import BookSmallPreview from "@/components/BookPageComponents/BookSmallPreview/book-small-preview";
import BookSmallPreviewSkeleton from "@/components/BookPageComponents/BookSmallPreview/book-small-preview-skeleton";
import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import Section from "@/components/GeneralComponents/Section/section";

import { fetchNewReleasedBooks } from "@/lib/books";

import styles from "./library.module.css";
import { Suspense } from "react";

export default async function LibraryPage() {
  const myBooks = await fetchNewReleasedBooks(30);

  return (
    <>
      <Section sectionName={["My Books", "My Notes"]} multi>
        <div className={styles.booksContainer}>
          {myBooks.map((book, index) => (
            <BookLink
              link={`/book/${book.volumeInfo.industryIdentifiers[0].identifier}`}
              key={index}
            >
              <Suspense fallback={<BookSmallPreviewSkeleton />}>
                <BookSmallPreview key={index} book={book} />
              </Suspense>
            </BookLink>
          ))}
        </div>
        <div className={styles.booksContainer}>
          {myBooks.map((book, index) => (
            <BookLink
              link={`/book/${book.volumeInfo.industryIdentifiers[0].identifier}`}
              key={index}
            >
              <Suspense fallback={<BookSmallPreviewSkeleton />}>
                <BookSmallPreview key={index} book={book} />
              </Suspense>
            </BookLink>
          ))}
        </div>
        {/* <div className={styles.notesContainer}>
          {myBooks.map((book, index) => (
            <BookLink link={`/book/${book.volumeInfo.industryIdentifiers[0].identifier}`} key={index}>
              <BookSmallPreview key={index} book={book} />
            </BookLink>
          ))}
        </div> */}
      </Section>
    </>
  );
}
