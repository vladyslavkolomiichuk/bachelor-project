"use client";

import BookSmallPreview from "@/components/BookPageComponents/BookSmallPreview/book-small-preview";
import BookSmallPreviewSkeleton from "@/components/BookPageComponents/BookSmallPreview/book-small-preview-skeleton";
import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import Section from "@/components/GeneralComponents/Section/section";
import { Suspense, useEffect, useState } from "react";
import CircleButton from "@/components/GeneralComponents/CircleButton/circle-button";
import { Plus } from "lucide-react";
import NoteBlock from "@/components/Editor/NoteBlock/note-block";
import BookForm from "../FormComponents/BookForm/book-form";
import { getUserBooks, updateUserBookCategory } from "@/lib/db/book";

import styles from "./library.module.css";
import { useRouter } from "nextjs13-progress";
import { useUser } from "@/context/UserContext";
import { getAllNotesByUser } from "@/lib/db/note";

const BOOK_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "in-progress", label: "In Progress" },
  { key: "not-started", label: "Not Started" },
];

export default function Library() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [notes, setNotes] = useState([]);

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userBooks = await getUserBooks(userId);
        const userNotes = await getAllNotesByUser(userId);

        setBooks(userBooks);
        setNotes(userNotes);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [userId]);

  return (
    <>
      <Section sectionName={["My Books", "My Notes"]} multi>
        {books.length > 0 ? (
          <div className={styles.booksContainer} categories={BOOK_CATEGORIES}>
            {books.map((book) => {
              const href = book.person_share_id
                ? `/book/own/${book.id}`
                : `/book/${book.isbn13}`;

              return (
                <BookLink
                  href={href}
                  key={book.id}
                  style={styles.bookItem}
                  category={book.category}
                >
                  <Suspense fallback={<BookSmallPreviewSkeleton />}>
                    <BookSmallPreview
                      book={book}
                      withMenu
                      updateCategory={updateUserBookCategory}
                    />
                  </Suspense>
                </BookLink>
              );
            })}
          </div>
        ) : (
          <p className={styles.noItems}>There are no books</p>
        )}
        {notes.length > 0 ? (
          <div className={styles.notesContainer}>
            {notes.map((note) => (
              <NoteBlock key={note.session_id} note={note} />
            ))}
          </div>
        ) : (
          <p className={styles.noItems}>There are no notes</p>
        )}
      </Section>

      <CircleButton
        buttonType="button"
        colorType="success"
        onClick={() => setIsFormOpen(true)}
      >
        <Plus />
      </CircleButton>

      <BookForm
        isOpen={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onDone={() => setIsFormOpen(false)}
      />
    </>
  );
}
