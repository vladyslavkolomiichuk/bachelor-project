import BookSmallPreview from "@/components/BookPageComponents/BookSmallPreview/book-small-preview";
import BookSmallPreviewSkeleton from "@/components/BookPageComponents/BookSmallPreview/book-small-preview-skeleton";
import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import Section from "@/components/GeneralComponents/Section/section";
import { Suspense } from "react";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserBooks } from "@/lib/db/book";
import { getAllNotesByUser } from "@/lib/db/note";
import NoteBlock from "@/components/Editor/NoteBlock/note-block";

import styles from "./library.module.css";

export default async function LibraryPage() {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/login");
  }

  const books = await getUserBooks(result.user.id);
  const notes = await getAllNotesByUser(result.user.id);

  return (
    <Section sectionName={["My Books", "My Notes"]} multi>
      <div className={styles.booksContainer}>
        {books.length > 0
          ? books.map((book) => (
              <BookLink
                href={`/book/${book.isbn13}`}
                key={book.id}
                style={styles.bookItem}
              >
                <Suspense fallback={<BookSmallPreviewSkeleton />}>
                  <BookSmallPreview book={book} withMenu />
                </Suspense>
              </BookLink>
            ))
          : "There are no books"}
      </div>
      <div className={styles.notesContainer}>
        {notes.length > 0
          ? notes.map((note) => <NoteBlock key={note.session_id} note={note} />)
          : "There are no notes"}
      </div>
    </Section>
  );
}
