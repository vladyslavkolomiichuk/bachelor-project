"use client";

import CoverImage from "@/components/GeneralComponents/CoverImage/cover-image";
import Rating from "@/components/GeneralComponents/Rating/rating";
import {
  addBookToUserLib,
  deleteArticleFromDb,
  deleteBookFromDb,
} from "@/lib/db/book";
import { useEffect, useState } from "react";
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
import FileUploadModal from "@/components/FormComponents/FileUpload/modal-file-upload";

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
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { showToast } = useToast();
  const confirm = useConfirm();

  const {
    id,
    image,
    title,
    authors,
    buy_link: buyLink,
    rating: defaultRating = 0,
  } = book;

  const { ratingCounts: { averageRating: rating } = {} } = useReviews();

  const handleAddBook = async () => {
    if (!isUserLoggedIn) {
      showToast("You need to be logged in to add books.", "warning");
      return;
    }

    try {
      await addBookToUserLib(book);
      showToast("Book added successfully!", "success");
      router.refresh();
    } catch (error) {
      showToast("Failed to add book. Please try again.", "error");
      console.error(error);
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

    try {
      if (book.doi) {
        await deleteArticleFromDb(book.doi);
        router.push("/library");
      } else {
        await deleteBookFromDb(book.isbn13, book.person_share_id);
        router.refresh();
      }
      showToast("Book deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete book. Please try again.", "error");
      console.error(error);
    }
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
              <Rating rating={rating || defaultRating} />
              {/* <p>{ratingsCount}</p> */}
            </div>
          </div>
        </div>

        <div className={styles.bookInfoButtons}>
          <div className={styles.together}>
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

            {mode === "added" && (
              <MainButton
                onClick={async () => {
                  const confirmed = await confirm({
                    title: "Copyright warning",
                    message:
                      "By downloading a file, you confirm that you have the legal right to use it. If the file comes from an illegal or pirated source, you are fully responsible for possible copyright infringement.<br/><br/>The application administration is not responsible for the content uploaded by users.",
                    buttonName: "Accept",
                    type: "ok",
                  });

                  if (!confirmed) return;

                  setIsFileUploadOpen(true);
                }}
              >
                Add PDF Book
              </MainButton>
            )}
          </div>

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

            {/* <button type="button" id="share" className={styles.shareButton}>
              <Share2 />
            </button> */}
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
        userId={user?.id}
      />

      <TemplateModal
        setTemplate={setSelectedTemplate}
        isOpen={templatesModalOpen}
        onCancel={() => setTemplatesModalOpen(false)}
      />

      <FileUploadModal
        isOpen={isFileUploadOpen}
        onCancel={() => setIsFileUploadOpen(false)}
        onDone={() => {
          setIsFileUploadOpen(false);
          showToast("PDF file added successfully", "success");
        }}
        bookId={id}
        userId={user?.id}
      />
    </div>
  );
}
