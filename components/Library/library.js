"use client";

import BookSmallPreview from "@/components/BookPageComponents/BookSmallPreview/book-small-preview";
import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import Section from "@/components/GeneralComponents/Section/section";
import { useEffect, useState } from "react";
import CircleButton from "@/components/GeneralComponents/CircleButton/circle-button";
import { Plus } from "lucide-react";
import NoteBlock from "@/components/Editor/NoteBlock/note-block";
import UserBookForm from "../FormComponents/UserBookForm/user-book-form";

import styles from "./library.module.css";
import { useRouter } from "nextjs13-progress";
import { useUser } from "@/context/UserContext";
import { getAllNotesByUser } from "@/lib/db/note";
import { getUserBooks } from "@/lib/db/book";
import BookSmallPreviewSkeleton from "../Loading/Components/book-small-preview-skeleton";
import NoteBlockSkeleton from "../Loading/Components/note-block-skeleton";

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

  const [loading, setLoading] = useState(true);

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

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }

    if (user) {
      fetchData();
    }
  }, [userId]);

  const setBookCategory = (bookId, newCategory) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, category: newCategory } : book
      )
    );
  };

  return (
    <>
      <Section sectionName={["My Books", "My Notes"]} multi>
        {!loading ? (
          books.length > 0 ? (
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
                    <BookSmallPreview
                      book={book}
                      withMenu
                      updateCategory
                      setDeletedBook={setBooks}
                      setBookCategory={setBookCategory}
                    />
                  </BookLink>
                );
              })}
            </div>
          ) : (
            <p className={styles.noItems}>There are no books</p>
          )
        ) : (
          <div className={styles.booksContainer}>
            <BookSmallPreviewSkeleton />
            <BookSmallPreviewSkeleton />
            <BookSmallPreviewSkeleton />
            <BookSmallPreviewSkeleton />
            <BookSmallPreviewSkeleton />
            <BookSmallPreviewSkeleton />
            <BookSmallPreviewSkeleton />
            <BookSmallPreviewSkeleton />
          </div>
        )}
        {!loading ? (
          notes.length > 0 ? (
            <div className={styles.notesContainer}>
              {notes.map((note) => (
                <NoteBlock key={note.session_id} note={note} userId={userId} />
              ))}
            </div>
          ) : (
            <p className={styles.noItems}>There are no notes</p>
          )
        ) : (
          <div className={styles.notesContainer}>
            <NoteBlockSkeleton />
            <NoteBlockSkeleton />
            <NoteBlockSkeleton />
          </div>
        )}
      </Section>

      <CircleButton
        buttonType="button"
        colorType="success"
        onClick={() => setIsFormOpen(true)}
      >
        <Plus />
      </CircleButton>

      <UserBookForm
        isOpen={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onDone={(newBook) => {
          setIsFormOpen(false);
          if (newBook) {
            setBooks((prev) => [...prev, newBook]);
          }
        }}
      />
    </>
  );
}
