import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import BookPreview from "../BookPreview/book-preview";

import styles from "./transparent-book-block.module.css";

export default async function TransparentBookBlock({ book }) {
  return (
    <BookLink
      link={`/book/${book.isbn13}`}
      style={styles.transparentBookBlock}
    >
      <BookPreview book={book} />
    </BookLink>
  );
}
