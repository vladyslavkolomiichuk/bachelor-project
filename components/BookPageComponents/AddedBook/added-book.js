import Section from "@/components/GeneralComponents/Section/section";
import BookPanel from "../BookPanel/book-panel";
import FullBookDescription from "../FullBookDescription/full-book-description";
import BookSmallPreview from "../BookSmallPreview/book-small-preview";
import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import MyBookSlider from "../MyBookSlider/my-book-slider";
import { getLastOpenedBooks, updateBookLastOpened } from "@/lib/db/book";

import styles from "./added-book.module.css";

export default async function AddedBook({ book, bookColor, userId }) {
  await updateBookLastOpened(userId, book.isbn13)
  const lastOpenedBooks = await getLastOpenedBooks(userId);

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
          <div className={styles.notesContainer}>
            {/* {myNotes.map((note, index) => (
              <BookLink link={`/book/`} key={index}>
                <BookSmallPreview key={index} book={note} />
              </BookLink>
            ))} */}
          </div>
          <FullBookDescription book={book} />
        </Section>
      </div>
      <MyBookSlider books={lastOpenedBooks} bookColor={bookColor} />
    </div>
  );
}
