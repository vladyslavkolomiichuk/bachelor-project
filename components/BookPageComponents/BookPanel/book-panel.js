"use client";

import CoverImage from "@/components/GeneralComponents/CoverImage/cover-image";
import Rating from "@/components/GeneralComponents/Rating/rating";
import { addBookToUserLib, deleteBookFromDb } from "@/lib/db/book";
import { useState } from "react";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { useRouter } from "nextjs13-progress";
import { useToast } from "@/context/ToastContext";
import TemplateModal from "@/components/Editor/TemplateSelection/template-selection";
import EditorWindow from "@/components/Editor/EditorWindow/editor-window";
import { useConfirm } from "@/context/ConfirmContext";
import { useReviews } from "@/context/ReviewsContext";

import styles from "./book-panel.module.css";

import { ArrowUpRight } from "lucide-react";
import { Share2 } from "lucide-react";
import { Trash } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function BookPanel({
  book,
  buttonText = "Add To My Books",
  bookColor,
  mode,
}) {
  const router = useRouter();

  const { user } = useUser();
  const isUserLoggedIn = !!user;

  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { showToast } = useToast();
  const confirm = useConfirm();

  const { id, image, title, authors, buy_link: buyLink } = book;

  const { ratingCounts: { averageRating: rating } = {} } = useReviews();

  const handleAddBook = async () => {
    if (!isUserLoggedIn) {
      showToast("You need to be logged in to add books.", "warning");
    } else {
      await addBookToUserLib(book);
      showToast("Book added successfully!", "success");
      router.refresh();
    }
  };

  const handleDeleteBook = async () => {
    const confirmed = await confirm({
      title: "You're about to delete this book from your library",
      message:
        "This action will remove the book from your library but will leave the notes associated with it.",
      buttonName: "Delete",
    });
    if (!confirmed) return;

    deleteBookFromDb(book.isbn13);
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
            onClick={
              mode === "unadded"
                ? handleAddBook
                : () => {
                    setTemplatesModalOpen(true);
                  }
            }
          >
            <span>{buttonText}</span>
          </MainButton>

          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.buyButton}
              disabled={!buyLink}
              onClick={() => {
                if (buyLink) {
                  window.open(buyLink, "_blank", "noopener,noreferrer");
                }
              }}
            >
              Buy <ArrowUpRight />
            </button>

            <button type="button" id="share" className={styles.shareButton}>
              <Share2 />
            </button>
            {mode === "added" && (
              <button
                type="button"
                onClick={handleDeleteBook}
                className={styles.deleteButton}
              >
                <Trash />
              </button>
            )}
          </div>
        </div>

        <hr style={{ backgroundColor: bookColor }} />
      </div>

      <EditorWindow
        isOpen={selectedTemplate}
        onCancel={() => setSelectedTemplate(null)}
        content={selectedTemplate?.content}
        bookId={id}
      />

      <TemplateModal
        setTemplate={setSelectedTemplate}
        isOpen={templatesModalOpen}
        onCancel={() => setTemplatesModalOpen(false)}
      />
    </div>
  );
}
