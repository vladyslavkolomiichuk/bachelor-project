"use client";

import CoverImage from "@/components/GeneralComponents/CoverImage/cover-image";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { EllipsisVertical } from "lucide-react";
import { deleteBookFromDb } from "@/lib/db/book";

import styles from "./book-small-preview.module.css";
import { useRouter } from "next/navigation";

export default function BookSmallPreview({ book, withMenu = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const { showToast } = useToast();

  const router = useRouter();

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
                  className={styles.menuItem}
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    try {
                      await deleteBookFromDb(book.isbn13);
                      showToast("Book deleted successfully");
                      router.refresh();
                    } catch (error) {
                      showToast("Failed to delete book", "error");
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
