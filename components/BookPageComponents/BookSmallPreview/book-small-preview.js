"use client";

import CoverImage from "@/components/GeneralComponents/CoverImage/cover-image";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { EllipsisVertical } from "lucide-react";
import { deleteBookFromDb } from "@/lib/db/book";
import { useRouter } from "nextjs13-progress";
import { updateUserBookCategory } from "@/lib/db/book";

import styles from "./book-small-preview.module.css";
import { useUser } from "@/context/UserContext";

export default function BookSmallPreview({
  book,
  withMenu = false,
  updateCategory = false,
  setDeletedBook = null,
  setBookCategory = null,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const { showToast } = useToast();

  const router = useRouter();

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen((prev) => !prev);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <CoverImage
        // className={styles.cover}
        coverImg={book.image}
        altText={book.title}
        width={100}
        height={150}
      />
      <div className={styles.infoContainer}>
        <p className={styles.title}>{book.title}</p>
        {withMenu && (
          <div className={styles.menuWrapper} ref={menuRef}>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
            >
              <EllipsisVertical />
            </button>

            {isMenuOpen && (
              <div className={styles.menu}>
                <button
                  className={`${styles.menuItem} ${styles.deleteBtn}`}
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    try {
                      await deleteBookFromDb(book.isbn13);
                      showToast("Book deleted successfully");
                      setDeletedBook((prev) =>
                        prev.filter(
                          (thisBook) => thisBook.isbn13 !== book.isbn13
                        )
                      );
                    } catch {
                      showToast("Failed to delete book", "error");
                    }
                  }}
                >
                  Delete
                </button>
                {updateCategory && (
                  <div className={styles.menuWrapper}>
                    <button
                      className={styles.menuItem}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCategoryMenuOpen((prev) => !prev);
                      }}
                    >
                      Change Category
                    </button>
                    {isCategoryMenuOpen && (
                      <div className={styles.categoryMenu}>
                        <button
                          className={styles.menuItem}
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                              await updateUserBookCategory(
                                userId,
                                book.id,
                                "completed"
                              );
                              showToast("Book change category successfully");
                              setBookCategory(book.id, "completed");
                              setIsMenuOpen(false);
                              setIsCategoryMenuOpen(false);
                            } catch {
                              showToast(
                                "Failed to change book category ",
                                "error"
                              );
                            }
                          }}
                        >
                          Completed
                        </button>
                        <button
                          className={styles.menuItem}
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                              await updateUserBookCategory(
                                userId,
                                book.id,
                                "in-progress"
                              );
                              showToast("Book change category successfully");
                              setBookCategory(book.id, "in-progress");
                              setIsMenuOpen(false);
                              setIsCategoryMenuOpen(false);
                            } catch {
                              showToast(
                                "Failed to change book category ",
                                "error"
                              );
                            }
                          }}
                        >
                          In Progress
                        </button>
                        <button
                          className={styles.menuItem}
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                              await updateUserBookCategory(
                                userId,
                                book.id,
                                "not-started"
                              );
                              showToast("Book change category successfully");
                              setBookCategory(book.id, "not-started");
                              setIsMenuOpen(false);
                              setIsCategoryMenuOpen(false);
                            } catch {
                              showToast(
                                "Failed to change book category ",
                                "error"
                              );
                            }
                          }}
                        >
                          Not Started
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
