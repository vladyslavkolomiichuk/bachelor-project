import { startTransition, useActionState, useEffect, useRef } from "react";
import { useInput } from "@/hooks/useInput";
import { TextEditorFormSchema } from "@/lib/definitions";
import Input from "../Input/Input";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { multiplexerAction } from "@/actions/text-editor-multiplexer";

import styles from "../form.module.css";

export default function TextEditorForm({
  isOpen,
  onCancel,
  onDone,
  timer,
  content,
  bookId,
  formType = "create",
  noteId = null,
  sessionId = null,
  defaultTitle = "",
  defaultDescription = "",
  defaultStartPage = 0,
  defaultEndPage = 0,
}) {
  const [formState, formAction, formPending] = useActionState(
    multiplexerAction,
    {
      errors: null,
      data: null,
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append("actionType", formType);

    formData.append("noteId", noteId);
    formData.append("sessionId", sessionId);
    formData.append("timer", timer);
    formData.append("content", content);
    formData.append("bookId", bookId);

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    console.log("formPending:", formPending);
    console.log("formState:", formState);
    if (!formPending && formState === undefined) {
      onDone();
    }
  }, [formPending, formState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  const resetError = (field) => {
    formState.errors = {
      ...formState.errors,
      [field]: null,
    };
  };

  const {
    value: title,
    handleInputChange: handleTitleChange,
    handleInputBlur: handleTitleBlur,
    hasError: titleHasError,
    errorMessage: titleError,
  } = useInput(
    defaultTitle,
    TextEditorFormSchema._def.schema.shape.title,
    resetError
  );
  const {
    value: description,
    handleInputChange: handleDescriptionChange,
    handleInputBlur: handleDescriptionBlur,
    hasError: descriptionHasError,
    errorMessage: descriptionError,
  } = useInput(
    defaultDescription,
    TextEditorFormSchema._def.schema.shape.description,
    resetError
  );
  const {
    value: startPage,
    handleInputChange: handleStartPageChange,
    handleInputBlur: handleStartPageBlur,
    hasError: startPageHasError,
    errorMessage: startPageError,
  } = useInput(
    defaultStartPage,
    TextEditorFormSchema._def.schema.shape.startPage,
    resetError
  );
  const {
    value: endPage,
    handleInputChange: handleEndPageChange,
    handleInputBlur: handleEndPageBlur,
    hasError: endPageHasError,
    errorMessage: endPageError,
  } = useInput(
    defaultEndPage,
    TextEditorFormSchema._def.schema.shape.endPage,
    resetError
  );

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.textEditorFormContainer}>
        <div className={styles.messageContainer}>
          <h2>Saving a Note</h2>
          <p>To save a note, you need to provide the following information.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.noteForm}>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            error={titleHasError ? titleError : formState?.errors?.title}
          />
          <Input
            id="description"
            name="description"
            type="text"
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            error={
              descriptionHasError
                ? descriptionError
                : formState?.errors?.description
            }
          />
          <div className={styles.pages}>
            <Input
              id="startPage"
              name="startPage"
              type="number"
              placeholder="Start Page"
              value={startPage}
              onChange={handleStartPageChange}
              onBlur={handleStartPageBlur}
              error={
                startPageHasError
                  ? startPageError
                  : formState?.errors?.startPage
              }
            />
            <Input
              id="endPage"
              name="endPage"
              type="number"
              placeholder="End Page"
              value={endPage}
              onChange={handleEndPageChange}
              onBlur={handleEndPageBlur}
              error={
                endPageHasError ? endPageError : formState?.errors?.endPage
              }
            />
          </div>

          <MainButton type="submit" disabled={formPending}>
            <span>{formType === "create" ? "Create Note" : "Update Note"}</span>
          </MainButton>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
