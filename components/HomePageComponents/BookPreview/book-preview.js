import Rating from "../../GeneralComponents/Rating/rating";
import CoverImage from "../../GeneralComponents/CoverImage/cover-image";

import styles from "./book-preview.module.css";

export default function BookPreview({ book, ratingColor = "#F2F2F3" }) {
  const {
    title,
    authors,
    synopsis,
    image,
    // averageRating: rating = 0,
  } = book;

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
        <p>{authors}</p>
        <Rating rating={0} starColor={ratingColor} />
        <p>{synopsis}</p>
      </div>
    </>
  );
}
