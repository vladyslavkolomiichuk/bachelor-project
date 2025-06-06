import { useActionState, useEffect, useState } from "react";
import { useInput } from "@/hooks/useInput";
import { NewBookFormSchema } from "@/lib/definitions";
import Input from "../Input/Input";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { fetchBookByISBN } from "@/lib/api/books";
import { Link } from "nextjs13-progress";
import { isBookInDbByIsbn } from "@/lib/db/book";
import { newBookAddAction } from "@/actions/user-book-actions";

import styles from "../form.module.css";

export default function UserBookForm({ isOpen, onCancel, onDone }) {
  const [formState, formAction, formPending] = useActionState(
    newBookAddAction,
    {
      errors: null,
      data: null,
    }
  );

  const [isbnStatus, setIsbnStatus] = useState(null);

  const checkIsbn13 = async () => {
    if (!isbn13.trim()) return;

    setIsbnStatus("checking");

    const ISBNdbBook = await fetchBookByISBN(isbn13.trim());
    const DBBook = await isBookInDbByIsbn(isbn13.trim());

    if (ISBNdbBook || DBBook) {
      setIsbnStatus("found");
    } else {
      setIsbnStatus("not-found");
    }
  };

  useEffect(() => {
    if (!formPending && formState?.data && !formState?.errors) {
      onDone(formState.data);
    }
  }, [formPending, formState]);

  useEffect(() => {
    if (!isOpen) {
      setIsbnStatus(null);
      resetAuthors();
      resetBinding();
      resetBuyLink();
      resetDatePublished();
      resetDimensions();
      resetImage();
      resetIsbn13();
      resetLanguage();
      resetLongTitle();
      resetPages();
      resetPublisher();
      resetSubjects();
      resetSynopsis();
      resetTitle();
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
    value: isbn13,
    handleInputChange: handleIsbn13Change,
    handleInputBlur: handleIsbn13Blur,
    hasError: isbn13HasError,
    errorMessage: isbn13Error,
    reset: resetIsbn13,
  } = useInput("", NewBookFormSchema.shape.isbn13, resetError);
  const {
    value: title,
    handleInputChange: handleTitleChange,
    handleInputBlur: handleTitleBlur,
    hasError: titleHasError,
    errorMessage: titleError,
    reset: resetTitle,
  } = useInput("", NewBookFormSchema.shape.title, resetError);
  const {
    value: image,
    handleInputChange: handleImageChange,
    handleInputBlur: handleImageBlur,
    hasError: imageHasError,
    errorMessage: imageError,
    reset: resetImage,
  } = useInput("", NewBookFormSchema.shape.image, resetError);
  const {
    value: synopsis,
    handleInputChange: handleSynopsisChange,
    handleInputBlur: handleSynopsisBlur,
    hasError: synopsisHasError,
    errorMessage: synopsisError,
    reset: resetSynopsis,
  } = useInput("", NewBookFormSchema.shape.synopsis, resetError);
  const {
    value: subjects,
    handleInputChange: handleSubjectsChange,
    handleInputBlur: handleSubjectsBlur,
    hasError: subjectsHasError,
    errorMessage: subjectsError,
    reset: resetSubjects,
  } = useInput("", NewBookFormSchema.shape.subjects, resetError);
  const {
    value: buyLink,
    handleInputChange: handleBuyLinkChange,
    handleInputBlur: handleBuyLinkBlur,
    hasError: buyLinkHasError,
    errorMessage: buyLinkError,
    reset: resetBuyLink,
  } = useInput("", NewBookFormSchema.shape.buyLink, resetError);
  const {
    value: binding,
    handleInputChange: handleBindingChange,
    handleInputBlur: handleBindingBlur,
    hasError: bindingHasError,
    errorMessage: bindingError,
    reset: resetBinding,
  } = useInput("", NewBookFormSchema.shape.binding, resetError);
  const {
    value: authors,
    handleInputChange: handleAuthorsChange,
    handleInputBlur: handleAuthorsBlur,
    hasError: authorsHasError,
    errorMessage: authorsError,
    reset: resetAuthors,
  } = useInput("", NewBookFormSchema.shape.authors, resetError);
  const {
    value: longTitle,
    handleInputChange: handleLongTitleChange,
    handleInputBlur: handleLongTitleBlur,
    hasError: longTitleHasError,
    errorMessage: longTitleError,
    reset: resetLongTitle,
  } = useInput("", NewBookFormSchema.shape.longTitle, resetError);
  const {
    value: pages,
    handleInputChange: handlePagesChange,
    handleInputBlur: handlePagesBlur,
    hasError: pagesHasError,
    errorMessage: pagesError,
    reset: resetPages,
  } = useInput("", NewBookFormSchema.shape.pages, resetError);
  const {
    value: dimensions,
    handleInputChange: handleDimensionsChange,
    handleInputBlur: handleDimensionsBlur,
    hasError: dimensionsHasError,
    errorMessage: dimensionsError,
    reset: resetDimensions,
  } = useInput("", NewBookFormSchema.shape.dimensions, resetError);
  const {
    value: language,
    handleInputChange: handleLanguageChange,
    handleInputBlur: handleLanguageBlur,
    hasError: languageHasError,
    errorMessage: languageError,
    reset: resetLanguage,
  } = useInput("", NewBookFormSchema.shape.language, resetError);
  const {
    value: publisher,
    handleInputChange: handlePublisherChange,
    handleInputBlur: handlePublisherBlur,
    hasError: publisherHasError,
    errorMessage: publisherError,
    reset: resetPublisher,
  } = useInput("", NewBookFormSchema.shape.publisher, resetError);
  const {
    value: datePublished,
    handleInputChange: handleDatePublishedChange,
    handleInputBlur: handleDatePublishedBlur,
    hasError: datePublishedHasError,
    errorMessage: datePublishedError,
    reset: resetDatePublished,
  } = useInput("", NewBookFormSchema.shape.datePublished, resetError);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div
        className={styles.textEditorFormContainer}
        style={{ width: "550px" }}
      >
        <div className={styles.messageContainer}>
          <h2>New Own Book</h2>
          <p>
            To add your own book to our application, first make sure that it
            does not already exist using the ISBN13. If the book does not exist
            in our database or you do not have an ISBN13, fill in the details
            below.{" "}
            <span style={{ fontWeight: 700 }}>
              Authors and subjects should be separated by commas.
            </span>
          </p>
          {isbnStatus === "checking" && <p>Checking ISBN...</p>}
          {isbnStatus === "found" && (
            <p style={{ color: "green" }}>
              Book exists in ISBNdb. <Link href={`/book/${isbn13}`}>View</Link>
            </p>
          )}
          {isbnStatus === "not-found" && (
            <p style={{ color: "red" }}>
              Book not found in ISBNdb and in DB, you can add book by your own.
            </p>
          )}
        </div>

        <form action={formAction} className={styles.noteForm}>
          <Input
            id="isbn13"
            name="isbn13"
            type="text"
            placeholder="ISBN13"
            value={isbn13}
            onChange={handleIsbn13Change}
            onBlur={(e) => {
              handleIsbn13Blur(e);
              checkIsbn13();
            }}
            error={isbn13HasError ? isbn13Error : formState?.errors?.isbn13}
          />
          {isbnStatus === "not-found" && !isbn13HasError && (
            <>
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
                error={
                  authorsHasError ? authorsError : formState?.errors?.authors
                }
              />
              <Input
                id="synopsis"
                name="synopsis"
                type="text"
                placeholder="Synopsis"
                value={synopsis}
                onChange={handleSynopsisChange}
                onBlur={handleSynopsisBlur}
                error={
                  synopsisHasError ? synopsisError : formState?.errors?.synopsis
                }
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
                    languageHasError
                      ? languageError
                      : formState?.errors?.language
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
              <div className={styles.pages}>
                <Input
                  id="binding"
                  name="binding"
                  type="text"
                  placeholder="Binding"
                  value={binding}
                  onChange={handleBindingChange}
                  onBlur={handleBindingBlur}
                  error={
                    bindingHasError ? bindingError : formState?.errors?.binding
                  }
                />
                <Input
                  id="dimensions"
                  name="dimensions"
                  type="text"
                  placeholder="Dimensions"
                  value={dimensions}
                  onChange={handleDimensionsChange}
                  onBlur={handleDimensionsBlur}
                  error={
                    dimensionsHasError
                      ? dimensionsError
                      : formState?.errors?.dimensions
                  }
                />
              </div>
              <div className={styles.pages}>
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
                <Input
                  id="publisher"
                  name="publisher"
                  type="text"
                  placeholder="Publisher"
                  value={publisher}
                  onChange={handlePublisherChange}
                  onBlur={handlePublisherBlur}
                  error={
                    publisherHasError
                      ? publisherError
                      : formState?.errors?.publisher
                  }
                />
              </div>

              <Input
                id="buyLink"
                name="buyLink"
                type="text"
                placeholder="Buy Link"
                value={buyLink}
                onChange={handleBuyLinkChange}
                onBlur={handleBuyLinkBlur}
                error={
                  buyLinkHasError ? buyLinkError : formState?.errors?.buyLink
                }
              />
            </>
          )}

          <MainButton
            type="submit"
            disabled={
              formPending || isbnStatus === "found" || isbnStatus === null
            }
          >
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
