import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import BookPreview from "../BookPreview/book-preview";

import styles from "./transparent-book-block.module.css";

export default async function TransparentBookBlock({ book }) {
  return (
    <div className={styles.transparentBookBlock}>
      <BookLink link={`/book/${book.isbn13}`}>
        <BookPreview book={book} />
      </BookLink>
    </div>
  );
}
