"use client";

import CoverImage from "@/components/GeneralComponents/CoverImage/cover-image";
import Rating from "@/components/GeneralComponents/Rating/rating";
import { addBookToDb, deleteBookFromDb } from "@/lib/db/book";
import { useState } from "react";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/GeneralComponents/ConfirmModal/confirm-modal";
import { useToast } from "@/context/ToastContext";

import styles from "./book-panel.module.css";

import { ArrowUpRight } from "lucide-react";
import { Share2 } from "lucide-react";
import { Trash } from "lucide-react";
import Tiptap from "@/components/Editor/Tiptap";

export default function BookPanel({
  book,
  buttonText = "Add To My Books",
  bookColor,
  mode,
}) {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  const { image, title, authors, rating = 0, buy_link: buyLink } = book;

  const handleAddBook = async () => {
    setBookTitle(await addBookToDb(book));
    showToast("Book added successfully!", "success");
    router.refresh();
  };

  const handleStartSession = () => {};

  const handleDeleteBook = async () => {
    deleteBookFromDb(book.isbn13);
    setModalOpen(false);
    showToast("Book deleted successfully!", "success");
    router.refresh();
  };

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
          <MainButton
            onClick={mode === "unadded" ? handleAddBook : handleStartSession}
          >
            <span>{buttonText}</span>
          </MainButton>

          <div className={styles.actionButtons}>
            <a href={buyLink} target="_blank" className={styles.buyButton}>
              Buy <ArrowUpRight />
            </a>
            <button type="button" id="share" className={styles.shareButton}>
              <Share2 />
            </button>
            {mode === "added" && (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className={styles.deleteButton}
              >
                <Trash />
              </button>
            )}
          </div>
        </div>

        <hr style={{ backgroundColor: bookColor }} />
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onConfirm={handleDeleteBook}
        onCancel={() => setModalOpen(false)}
        title="You're about to delete this book from your library"
        message="This action will remove the book from your library but will leave the notes associated with it."
      />
    </div>
  );
}
