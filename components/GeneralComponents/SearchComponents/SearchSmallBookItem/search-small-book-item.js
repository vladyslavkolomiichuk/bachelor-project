import Image from "next/image";
import BookLink from "../../BookLink/book-link";

import styles from "./search-small-book-item.module.css";

export default function SearchSmallBookItem({ book }) {
  return (
    <BookLink link={`/book/${book.isbn13}`} style={styles.searchBookItem}>
      <Image src={book.image} alt={book.title} height={90} width={60} />
      <div className={styles.infoContainer}>
        <div>
          <h3>{book.title}</h3>
          <p className={styles.year}>
            {" "}
            {book.date_published
              ? book.date_published.substring(0, 4)
              : "Unknown year"}
          </p>
        </div>
        <p className={styles.synopsis}>{book.synopsis ?? "Unknown synopsis"}</p>
      </div>
    </BookLink>
  );
}
