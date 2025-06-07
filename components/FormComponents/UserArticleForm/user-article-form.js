import { useActionState, useEffect } from "react";
import { useInput } from "@/hooks/useInput";
import { NewArticleFormSchema } from "@/lib/definitions";
import Input from "../Input/Input";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { newArticleAddAction } from "@/actions/user-article-actions";

import styles from "../form.module.css";

export default function UserArticleForm({ isOpen, onCancel, onDone }) {
  const [formState, formAction, formPending] = useActionState(
    newArticleAddAction,
    {
      errors: null,
      data: null,
    }
  );

  useEffect(() => {
    if (!formPending && formState?.data && !formState?.errors) {
      onDone(formState.data);
    }
  }, [formPending, formState]);

  useEffect(() => {
    if (!isOpen) {
      resetAuthors();
      resetDatePublished();
      resetImage();
      resetDoi();
      resetLongTitle();
      resetPages();
      resetSubjects();
      resetTitle();
      resetLanguage();
      formState.errors = null;
    }
  }, [isOpen]);

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
  }, [isOpen, onCancel, formState]);

  const resetError = (field) => {
    formState.errors = {
      ...formState.errors,
      [field]: null,
    };
  };

  const {
    value: doi,
    handleInputChange: handleDoiChange,
    handleInputBlur: handleDoiBlur,
    hasError: doiHasError,
    errorMessage: doiError,
    reset: resetDoi,
  } = useInput("", NewArticleFormSchema.shape.doi, resetError);
  const {
    value: title,
    handleInputChange: handleTitleChange,
    handleInputBlur: handleTitleBlur,
    hasError: titleHasError,
    errorMessage: titleError,
    reset: resetTitle,
  } = useInput("", NewArticleFormSchema.shape.title, resetError);
  const {
    value: image,
    handleInputChange: handleImageChange,
    handleInputBlur: handleImageBlur,
    hasError: imageHasError,
    errorMessage: imageError,
    reset: resetImage,
  } = useInput("", NewArticleFormSchema.shape.image, resetError);
  const {
    value: subjects,
    handleInputChange: handleSubjectsChange,
    handleInputBlur: handleSubjectsBlur,
    hasError: subjectsHasError,
    errorMessage: subjectsError,
    reset: resetSubjects,
  } = useInput("", NewArticleFormSchema.shape.subjects, resetError);
  const {
    value: authors,
    handleInputChange: handleAuthorsChange,
    handleInputBlur: handleAuthorsBlur,
    hasError: authorsHasError,
    errorMessage: authorsError,
    reset: resetAuthors,
  } = useInput("", NewArticleFormSchema.shape.authors, resetError);
  const {
    value: longTitle,
    handleInputChange: handleLongTitleChange,
    handleInputBlur: handleLongTitleBlur,
    hasError: longTitleHasError,
    errorMessage: longTitleError,
    reset: resetLongTitle,
  } = useInput("", NewArticleFormSchema.shape.longTitle, resetError);
  const {
    value: pages,
    handleInputChange: handlePagesChange,
    handleInputBlur: handlePagesBlur,
    hasError: pagesHasError,
    errorMessage: pagesError,
    reset: resetPages,
  } = useInput("", NewArticleFormSchema.shape.pages, resetError);
  const {
    value: language,
    handleInputChange: handleLanguageChange,
    handleInputBlur: handleLanguageBlur,
    hasError: languageHasError,
    errorMessage: languageError,
    reset: resetLanguage,
  } = useInput("", NewArticleFormSchema.shape.language, resetError);
  const {
    value: datePublished,
    handleInputChange: handleDatePublishedChange,
    handleInputBlur: handleDatePublishedBlur,
    hasError: datePublishedHasError,
    errorMessage: datePublishedError,
    reset: resetDatePublished,
  } = useInput("", NewArticleFormSchema.shape.datePublished, resetError);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div
        className={styles.textEditorFormContainer}
        style={{ width: "550px" }}
      >
        <div className={styles.messageContainer}>
          <h2>New Own Scientific Article</h2>
          <p>
            Provide the article file, title, and cover you want below.{" "}
            <span style={{ fontWeight: 700 }}>
              Authors and subjects should be separated by commas.
            </span>
          </p>
        </div>

        <form action={formAction} className={styles.noteForm}>
          <Input
            id="doi"
            name="doi"
            type="text"
            placeholder="DOI"
            value={doi}
            onChange={handleDoiChange}
            onBlur={handleDoiBlur}
            error={doiHasError ? doiError : formState?.errors?.doi}
          />
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            // onBlur={handleImageBlur}
            error={imageHasError ? imageError : formState?.errors?.image}
          />
          <div className={styles.pages}>
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
              id="longTitle"
              name="longTitle"
              type="text"
              placeholder="Long Title"
              value={longTitle}
              onChange={handleLongTitleChange}
              onBlur={handleLongTitleBlur}
              error={
                longTitleHasError
                  ? longTitleError
                  : formState?.errors?.longTitle
              }
            />
          </div>
          <Input
            id="authors"
            name="authors"
            type="text"
            placeholder="Authors"
            value={authors}
            onChange={handleAuthorsChange}
            onBlur={handleAuthorsBlur}
            error={authorsHasError ? authorsError : formState?.errors?.authors}
          />
          <Input
            id="subjects"
            name="subjects"
            type="text"
            placeholder="Subjects"
            value={subjects}
            onChange={handleSubjectsChange}
            onBlur={handleSubjectsBlur}
            error={
              subjectsHasError ? subjectsError : formState?.errors?.subjects
            }
          />
          <div className={styles.pages}>
            <Input
              id="language"
              name="language"
              type="text"
              placeholder="Language"
              value={language}
              onChange={handleLanguageChange}
              onBlur={handleLanguageBlur}
              error={
                languageHasError ? languageError : formState?.errors?.language
              }
            />
            <Input
              id="pages"
              name="pages"
              type="number"
              placeholder="Pages"
              value={pages}
              onChange={handlePagesChange}
              onBlur={handlePagesBlur}
              error={pagesHasError ? pagesError : formState?.errors?.pages}
            />
          </div>
          <Input
            id="datePublished"
            name="datePublished"
            type="date"
            placeholder="Published Date"
            value={datePublished}
            onChange={handleDatePublishedChange}
            onBlur={handleDatePublishedBlur}
            error={
              datePublishedHasError
                ? datePublishedError
                : formState?.errors?.datePublished
            }
          />

          <MainButton type="submit" disabled={formPending}>
            <span>Add Book</span>
          </MainButton>
          <button
            className={styles.cancel}
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
