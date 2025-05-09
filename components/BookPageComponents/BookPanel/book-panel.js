import CoverImage from "@/components/GeneralComponents/CoverImage/cover-image";
import Rating from "@/components/GeneralComponents/Rating/rating";

import styles from "./book-panel.module.css";

import { ArrowUpRight } from "lucide-react";
import { Share2 } from "lucide-react";

export default function BookPanel({
  book,
  buttonText = "Add To My Books",
  bookColor,
}) {
  const { image, title, authors, rating = 0, buyLink } = book;
  return (
    <div className={styles.bookPanel}>
      <div className={styles.bookImage}>
        <CoverImage coverImg={image} altText={title} width={280} height={420} />
      </div>
      <div className={styles.bookInfo}>
        <div className={styles.bookInfoTitle}>
          <h2>{title || "Unknown Title"}</h2>
          <div>
            <p>{authors?.join(", ") || "Unknown Author"}</p>
            <div className={styles.rating}>
              <Rating rating={rating} />
              {/* <p>{ratingsCount}</p> */}
            </div>
          </div>
        </div>
        <div className={styles.bookInfoButtons}>
          <button type="button" id="add" className={styles.addButton}>
            <span>{buttonText}</span>
          </button>
          <div className={styles.actionButtons}>
            <a
              href={buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buyButton}
            >
              Buy <ArrowUpRight />
            </a>
            <button type="button" id="share" className={styles.shareButton}>
              <Share2 />
            </button>
          </div>
        </div>
        <hr style={{ backgroundColor: bookColor }} />
      </div>
    </div>
  );
}
