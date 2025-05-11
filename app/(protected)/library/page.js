import BookSmallPreview from "@/components/BookPageComponents/BookSmallPreview/book-small-preview";
import BookSmallPreviewSkeleton from "@/components/BookPageComponents/BookSmallPreview/book-small-preview-skeleton";
import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import Section from "@/components/GeneralComponents/Section/section";
import { Suspense } from "react";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserBooks } from "@/lib/db/book";

import styles from "./library.module.css";

export default async function LibraryPage() {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/login");
  }

  const myBooks = await getUserBooks(result.user.id);

  return (
    <Section sectionName={["My Books", "My Notes"]} multi>
      <div className={styles.booksContainer}>
        {myBooks &&
          myBooks.map((book, index) => (
            <BookLink
              link={`/book/${book.isbn13}`}
              key={index}
              style={styles.bookItem}
            >
              <Suspense fallback={<BookSmallPreviewSkeleton />}>
                <BookSmallPreview key={index} book={book} />
              </Suspense>
            </BookLink>
          ))}
      </div>
      <div className={styles.booksContainer}>
        {myBooks.map((book, index) => (
          <BookLink link={`/book/${book.isbn13}`} key={index}>
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
  );
}
