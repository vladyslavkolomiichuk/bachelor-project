"use client";

import CircleButton from "@/components/GeneralComponents/CircleButton/circle-button";
import TextEditor from "../TextEditor/text-editor";
import styles from "./editor-window.module.css";
import { CheckCheck, Plus } from "lucide-react";
import ToC from "../ToC/ToC";
import { TimerProvider, useTimer } from "@/context/TimerContext";
import { useEffect, useState } from "react";
import TextEditorForm from "@/components/FormComponents/TextEditorForm/text-editor-form";
import FileViewer from "../FileViewer/file-viewer";
import { getBookPDFUrl } from "@/lib/db/book";
import { useConfirm } from "@/context/ConfirmContext";

export default function EditorWindow({
  isOpen,
  onCancel,
  content,
  bookId,
  userId,
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
        userId={userId}
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
  userId,
  editorForChange,
  defaultNote,
}) {
  const [content, setContent] = useState(defaultContent);
  const { timer, stopTimer } = useTimer();

  const [note, setNote] = useState(null);

  const [updateNoteFormOpen, setUpdateNoteFormOpen] = useState(false);
  const [createNoteFormOpen, setCreateNoteFormOpen] = useState(false);

  const [pdfUrl, setPdfUrl] = useState(null);

  const confirm = useConfirm();

  useEffect(() => {
    const fetchUrl = async () => {
      const url = await getBookPDFUrl(bookId, userId);
      setPdfUrl(url);
    };

    fetchUrl();
  }, [bookId, userId]);

  useEffect(() => {
    if (defaultNote) {
      setNote(defaultNote);
    }
  }, [defaultNote]);

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

      {/* <ToC content={content} /> */}
      {pdfUrl && (
        <FileViewer
          fileUrl={pdfUrl}
          onTextSelect={(selectedText) => {
            console.log("Selected text:", selectedText);
            // Обробка виділеного тексту
          }}
        />
      )}
      <TextEditor content={content} setContent={setContent} />
      <CircleButton
        buttonType="button"
        colorType="success"
        onClick={async () => {
          if (editorForChange) {
            setUpdateNoteFormOpen(true);
          } else {
            const confirmed = await confirm({
              title: "Highlighting a read test",
              message:
                "You can highlight the read text in the PDF and get the total number of words read. Use the button in the PDF panel.",
              type: "ok",
            });

            if (!confirmed) return;
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
        defaultNote={note}
      />
    </div>
  );
}
