import Rating from "../../GeneralComponents/Rating/rating";
import CoverImage from "../../GeneralComponents/CoverImage/cover-image";

import styles from "./book-preview.module.css";

export default function BookPreview({ book, ratingColor = "#F2F2F3" }) {
  const { title, authors, synopsis, image, rating } = book;

  return (
    <>
      <CoverImage
        coverImg={image}
        altText="New releases book"
        width={100}
        height={150}
      />
      <div className={styles.info}>
        <h3>{title}</h3>
        <p className={styles.authors}>{authors?.join(", ")}</p>
        <Rating rating={rating} starColor={ratingColor} />
        <p className={styles.synopsis}>{synopsis}</p>
      </div>
    </>
  );
}
