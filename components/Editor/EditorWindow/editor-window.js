"use client";

import CircleButton from "@/components/GeneralComponents/CircleButton/circle-button";
import TextEditor from "../TextEditor/text-editor";
import styles from "./editor-window.module.css";
import { CheckCheck, Plus } from "lucide-react";
import ToC from "../ToC/ToC";
import { TimerProvider, useTimer } from "@/context/TimerContext";
import { useEffect, useState } from "react";
import TextEditorForm from "@/components/FormComponents/TextEditorForm/text-editor-form";

export default function EditorWindow({
  isOpen,
  onCancel,
  content,
  bookId,
  editorForChange = false,
  timer = 0,
  defaultNote = null,
}) {
  if (!isOpen) return null;

  return (
    <TimerProvider initialTime={timer}>
      <EditorWindowContent
        isOpen={isOpen}
        onCancel={onCancel}
        defaultContent={content}
        bookId={bookId}
        editorForChange={editorForChange}
        defaultNote={defaultNote}
      />
    </TimerProvider>
  );
}

function EditorWindowContent({
  isOpen,
  onCancel,
  defaultContent,
  bookId,
  editorForChange,
  defaultNote,
}) {
  const [updateNoteFormOpen, setUpdateNoteFormOpen] = useState(false);
  const [createNoteFormOpen, setCreateNoteFormOpen] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const { timer, stopTimer } = useTimer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (defaultContent !== content) {
          if (editorForChange) {
            setUpdateNoteFormOpen(true);
          } else {
            setCreateNoteFormOpen(true);
          }
        } else {
          onCancel();
        }
        stopTimer();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setCreateNoteFormOpen, setUpdateNoteFormOpen]);

  return (
    <div className={styles.editorWindow}>
      <button
        type="button"
        onClick={() => {
          if (defaultContent !== content) {
            if (editorForChange) {
              setUpdateNoteFormOpen(true);
            } else {
              setCreateNoteFormOpen(true);
            }
          } else {
            onCancel();
          }

          stopTimer();
        }}
      >
        <Plus />
      </button>

      <ToC content={content} />
      <TextEditor content={content} setContent={setContent} />
      <CircleButton
        buttonType="button"
        colorType="success"
        onClick={() => {
          if (editorForChange) {
            setUpdateNoteFormOpen(true);
          } else {
            setCreateNoteFormOpen(true);
          }
          stopTimer();
        }}
      >
        <CheckCheck />
      </CircleButton>

      <TextEditorForm
        isOpen={createNoteFormOpen}
        onCancel={() => {
          setCreateNoteFormOpen(false);
        }}
        onDone={() => {
          setCreateNoteFormOpen(false);
          onCancel();
        }}
        timer={timer}
        content={content}
        bookId={bookId}
      />
      <TextEditorForm
        isOpen={updateNoteFormOpen}
        onCancel={() => {
          setUpdateNoteFormOpen(false);
        }}
        onDone={() => {
          setCreateNoteFormOpen(false);
          onCancel();
        }}
        timer={timer}
        content={content}
        bookId={bookId}
        formType="update"
        noteId={defaultNote?.note_id}
        sessionId={defaultNote?.session_id}
        defaultTitle={defaultNote?.title}
        defaultDescription={defaultNote?.description}
        defaultStartPage={defaultNote?.start_page}
        defaultEndPage={defaultNote?.finish_page}
      />
    </div>
  );
}
