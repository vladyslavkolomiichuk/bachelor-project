"use client";

import { EllipsisVertical } from "lucide-react";
import EditorWindow from "../EditorWindow/editor-window";
import { useEffect, useRef, useState } from "react";
import { deleteNote } from "@/lib/db/note";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "nextjs13-progress";

import styles from "./note-block.module.css";
import { getBookPDFUrl } from "@/lib/db/book";

export default function NoteBlock({ note, userId }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const { showToast } = useToast();

  const router = useRouter();

  const {
    note_id: noteId,
    session_id: sessionId,
    title,
    description,
    note_text: noteContent,
    time,
    start_page: startPage,
    finish_page: endPage,
    date,
    book_title: bookTitle,
    book_image: bookImage,
    book_id: bookId,
    words_count: wordsCount,
  } = note;

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

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div>
      <div
        className={styles.noteContainer}
        style={{
          backgroundImage: `linear-gradient(rgb(0, 0, 0, 0.8), rgb(0, 0, 0, 0.8)),
              linear-gradient(to bottom,rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%), 
              linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%), 
              linear-gradient(to left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%),
              linear-gradient(to top, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 20%),
              url(${bookImage})`,
        }}
        onClick={() => setIsEditorOpen(true)}
      >
        <div className={styles.mainInfo}>
          <h2>{title}</h2>
          <p>Noting in {bookTitle}</p>
          <p>{description}</p>
        </div>
        <div className={styles.secondInfo}>
          <p>
            {startPage} - {endPage}
          </p>
          <p>{new Date(date).toLocaleDateString()}</p>
          <p>{formatTime(time)}</p>
          <p>{wordsCount}</p>

          <div className={styles.menuWrapper} ref={menuRef}>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={(e) => {
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
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    try {
                      await deleteNote(note.note_id, note.session_id);
                      showToast("Note deleted successfully");
                      router.refresh();
                    } catch (error) {
                      showToast("Failed to delete note", "error");
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditorWindow
        isOpen={isEditorOpen}
        onCancel={() => setIsEditorOpen(false)}
        content={noteContent}
        bookId={bookId}
        userId={userId}
        timer={time}
        editorForChange
        defaultNote={note}
      />
    </div>
  );
}
