import Section from "@/components/GeneralComponents/Section/section";
import BookPanel from "../BookPanel/book-panel";
import FullBookDescription from "../FullBookDescription/full-book-description";
import MyBookSlider from "../MyBookSlider/my-book-slider";
import NoteBlock from "@/components/Editor/NoteBlock/note-block";

import styles from "./added-book.module.css";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export default function AddedBook({ book, bookColor }) {
  const { user } = useUser();
  const userId = user?.id;

  const [lastOpenedBooks, setLastOpenedBooks] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        await fetch(`/api/books/last-opened-books`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, isbn13: book.isbn13 }),
        });

        const [booksRes, notesRes] = await Promise.all([
          fetch(`/api/books/last-opened-books?userId=${userId}`),
          fetch(`/api/notes/book-notes?bookId=${book.id}&userId=${userId}`),
        ]);

        const booksData = await booksRes.json();
        const notesData = await notesRes.json();

        setLastOpenedBooks(booksData);
        setNotes(notesData);
      } catch (error) {
        console.error("Error loading book data:", error);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId, book]);
  return (
    <div className={styles.addedBook}>
      <div className={styles.bookAndNote}>
        <BookPanel
          book={book}
          bookColor={bookColor}
          buttonText="Start Reading"
          mode="added"
        />
        <Section sectionName={["Notes", "Book Description"]} multi>
          {notes.length > 0 ? (
            <div className={styles.notesContainer}>
              {notes.map((note) => (
                <NoteBlock key={note.session_id} note={note} userId={userId} />
              ))}
            </div>
          ) : (
            <p className={styles.noItems}>There are no notes</p>
          )}
          <FullBookDescription book={book} />
        </Section>
      </div>
      <MyBookSlider books={lastOpenedBooks} bookColor={bookColor} />
    </div>
  );
}
