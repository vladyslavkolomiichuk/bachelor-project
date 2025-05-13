import CoverImage from "@/components/GeneralComponents/CoverImage/cover-image";
import styles from "./book-small-preview.module.css";

export default function BookSmallPreview({ book }) {
  return (
    <>
      <CoverImage
        // className={styles.cover}
        coverImg={book.image}
        altText={book.title}
        width={100}
        height={150}
      />
      <p className={styles.title}>{book.title}</p>
    </>
  );
}
