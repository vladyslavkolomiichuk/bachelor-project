import Section from "@/components/GeneralComponents/Section/section";
import BookPanel from "../BookPanel/book-panel";
import FullBookDescription from "../FullBookDescription/full-book-description";
import MyBookSlider from "../MyBookSlider/my-book-slider";
import { getLastOpenedBooks, updateBookLastOpened } from "@/lib/db/book";
import { getNotesByBook } from "@/lib/db/note";
import NoteBlock from "@/components/Editor/NoteBlock/note-block";

import styles from "./added-book.module.css";

export default async function AddedBook({ book, bookColor, userId }) {
  await updateBookLastOpened(userId, book.isbn13);
  const lastOpenedBooks = await getLastOpenedBooks(userId);
  const notes = await getNotesByBook(book.id, userId);

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
                <NoteBlock key={note.session_id} note={note} />
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
