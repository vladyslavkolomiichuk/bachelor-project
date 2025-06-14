import BookPanel from "../BookPanel/book-panel";
import FullBookDescription from "../FullBookDescription/full-book-description";
import styles from "./unadded-book.module.css";

export default function UnaddedBook({ book, bookColor }) {
  return (
    <div className={styles.unaddedBook}>
      <BookPanel
        book={book}
        buttonText="Add To My Books"
        bookColor={bookColor}
        mode="unadded"
      />
      <FullBookDescription book={book} />
    </div>
  );
}
