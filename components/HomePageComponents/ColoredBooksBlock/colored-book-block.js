import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import BookPreview from "../BookPreview/book-preview";

import { getColorsFromImage } from "@/lib/color-finder";

import styles from "./colored-book-block.module.css";

export default async function ColoredBookBlock({ book }) {
  const coverImg = book.image || "/default-image.png";

  const colors = await getColorsFromImage(coverImg);

  const dominantColor = colors[0];

  const rgbValues = dominantColor
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);

  return (
    <div
      className={styles.coloredBookBlock}
      style={{
        backgroundImage: `linear-gradient(rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0.5), rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0.5)),
              linear-gradient(to bottom,rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%), 
              linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%), 
              linear-gradient(to left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%),
              linear-gradient(to top, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%),
              url(${coverImg})`,
      }}
    >
      <BookLink link={`/book/${book.isbn13}`} style={styles.coloredBlockLink}>
        <BookPreview book={book} />
      </BookLink>
    </div>
  );
}
