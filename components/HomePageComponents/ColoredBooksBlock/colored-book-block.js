import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import BookPreview from "../BookPreview/book-preview";
import { useEffect, useState } from "react";

import styles from "./colored-book-block.module.css";

export default function ColoredBookBlock({ book }) {
  const [rgbValues, setRgbValues] = useState([]);
  const [bookImage, setBookImage] = useState(book?.image);

  useEffect(() => {
    const fetchData = async () => {
      // const bookImage = book?.image;

      const bookColorRes = await fetch("/api/books/book-color", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookImage }),
      });

      const { dominantColor } = await bookColorRes.json();

      const rgbValues = dominantColor
        .replace(/[^\d,]/g, "")
        .split(",")
        .map(Number);

      setRgbValues(rgbValues);
    };
    fetchData();
  }, [book]);

  return (
    <div
      className={styles.coloredBookBlock}
      style={{
        backgroundImage: `linear-gradient(rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0.5), rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0.5)),
              linear-gradient(to bottom,rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%), 
              linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%), 
              linear-gradient(to left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%),
              linear-gradient(to top, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%),
              url(${bookImage})`,
      }}
    >
      <BookLink href={`/book/${book.isbn13}`} style={styles.coloredBlockLink}>
        <BookPreview book={book} />
      </BookLink>
    </div>
  );
}
