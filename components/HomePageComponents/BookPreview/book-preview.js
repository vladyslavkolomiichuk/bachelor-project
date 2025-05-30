"use client"

import Rating from "../../GeneralComponents/Rating/rating";
import CoverImage from "../../GeneralComponents/CoverImage/cover-image";
import { useEffect, useState } from "react";
import { getRatingByBookIsbn } from "@/lib/db/book";

import styles from "./book-preview.module.css";

export default function BookPreview({ book, ratingColor = "#F2F2F3" }) {
  const { title, authors, synopsis, image } = book;

  const [rating, setRating] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const bookRating = await getRatingByBookIsbn(book.isbn13);
      setRating(bookRating);
    };
    fetchData();
  }, [book]);

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
        <Rating rating={rating} starColor={ratingColor} />
        <p>{synopsis}</p>
      </div>
    </>
  );
}
