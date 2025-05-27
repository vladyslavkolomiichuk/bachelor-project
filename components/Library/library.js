"use client";

import BookSmallPreview from "@/components/BookPageComponents/BookSmallPreview/book-small-preview";
import BookSmallPreviewSkeleton from "@/components/BookPageComponents/BookSmallPreview/book-small-preview-skeleton";
import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import Section from "@/components/GeneralComponents/Section/section";
import { Suspense, useState } from "react";
import CircleButton from "@/components/GeneralComponents/CircleButton/circle-button";
import { Plus } from "lucide-react";
import NoteBlock from "@/components/Editor/NoteBlock/note-block";
import { redirect } from "next/navigation";
import BookForm from "../FormComponents/BookForm/book-form";

import styles from "./library.module.css";

export default function Library({
  books,
  notes,
  categories,
  handleChangeCategory,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <Section sectionName={["My Books", "My Notes"]} multi>
        <div className={styles.booksContainer} categories={categories}>
          {books.length > 0
            ? books.map((book) => (
                <BookLink
                  href={`/book/${book.isbn13}`}
                  key={book.id}
                  style={styles.bookItem}
                  category={book.category}
                >
                  <Suspense fallback={<BookSmallPreviewSkeleton />}>
                    <BookSmallPreview
                      book={book}
                      withMenu
                      updateCategory={handleChangeCategory}
                    />
                  </Suspense>
                </BookLink>
              ))
            : "There are no books"}
        </div>
        <div className={styles.notesContainer}>
          {notes.length > 0
            ? notes.map((note) => (
                <NoteBlock key={note.session_id} note={note} />
              ))
            : "There are no notes"}
        </div>
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
