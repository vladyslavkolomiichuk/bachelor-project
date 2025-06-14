import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import BookPreview from "../BookPreview/book-preview";

import styles from "./transparent-book-block.module.css";

export default function TransparentBookBlock({ book }) {
  return (
    <BookLink
      href={`/book/${book.isbn13}`}
      style={styles.transparentBookBlock}
    >
      <BookPreview book={book} />
    </BookLink>
  );
}
