import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import BookSmallPreview from "../BookSmallPreview/book-small-preview";

import styles from "./my-book-slider.module.css";

export default function MyBookSlider({ books, bookColor }) {
  return (
    <div className={styles.bookSliderContainer}>
      <div className={styles.bookSlider}>
        {books.map((book, index) => {
          const href = book.person_share_id
            ? `/book/own/${book.id}`
            : `/book/${book.isbn13}`;

          return (
            <BookLink
              key={index}
              href={href}
              secondaryStyle={
                index === 0 ? { borderLeft: `3px solid ${bookColor}` } : {}
              }
            >
              <BookSmallPreview book={book} />
            </BookLink>
          );
        })}
      </div>
    </div>
  );
}
