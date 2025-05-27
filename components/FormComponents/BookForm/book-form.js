import { startTransition, useActionState, useEffect } from "react";
import { useInput } from "@/hooks/useInput";
import { ChallengeFormFields } from "@/lib/definitions";
import Input from "../Input/Input";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { newBookAddAction } from "@/actions/book-actions";

import styles from "../form.module.css";

export default function BookForm({ isOpen, onCancel, onDone }) {
  const [formState, formAction, formPending] = useActionState(
    newBookAddAction,
    {
      errors: null,
      data: null,
    }
  );

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);

  //   formData.append("actionType", formType);

  //   formData.append("challengeId", challengeId);
  //   formData.append("category", "Own");

  //   const today = new Date();
  //   const start = new Date(formData.get("startDate"));
  //   const end = new Date(formData.get("endDate"));

  //   const status = start <= today && end >= today ? "in-progress" : "upcoming";
  //   formData.append("status", status);

  //   startTransition(() => {
  //     formAction(formData);
  //   });
  // };

  useEffect(() => {
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
    value: isbn13,
    handleInputChange: handleIsbn13Change,
    handleInputBlur: handleIsbn13Blur,
    hasError: isbn13HasError,
    errorMessage: isbn13Error,
  } = useInput("", ChallengeFormFields.shape.isbn13, resetError);
  const {
    value: title,
    handleInputChange: handleTitleChange,
    handleInputBlur: handleTitleBlur,
    hasError: titleHasError,
    errorMessage: titleError,
  } = useInput("", ChallengeFormFields.shape.title, resetError);
  const {
    value: image,
    handleInputChange: handleImageChange,
    handleInputBlur: handleImageBlur,
    hasError: imageHasError,
    errorMessage: imageError,
  } = useInput("", ChallengeFormFields.shape.image, resetError);
  const {
    value: synopsis,
    handleInputChange: handleSynopsisChange,
    handleInputBlur: handleSynopsisBlur,
    hasError: synopsisHasError,
    errorMessage: synopsisError,
  } = useInput('', ChallengeFormFields.shape.synopsis, resetError);
  const {
    value: subjects,
    handleInputChange: handleSynopsisChange,
    handleInputBlur: handleSynopsisBlur,
    hasError: synopsisHasError,
    errorMessage: synopsisError,
  } = useInput('', ChallengeFormFields.shape.synopsis, resetError);
  const {
    value: synopsis,
    handleInputChange: handleSynopsisChange,
    handleInputBlur: handleSynopsisBlur,
    hasError: synopsisHasError,
    errorMessage: synopsisError,
  } = useInput('', ChallengeFormFields.shape.synopsis, resetError);
  const {
    value: synopsis,
    handleInputChange: handleSynopsisChange,
    handleInputBlur: handleSynopsisBlur,
    hasError: synopsisHasError,
    errorMessage: synopsisError,
  } = useInput('', ChallengeFormFields.shape.synopsis, resetError);
  const {
    value: synopsis,
    handleInputChange: handleSynopsisChange,
    handleInputBlur: handleSynopsisBlur,
    hasError: synopsisHasError,
    errorMessage: synopsisError,
  } = useInput('', ChallengeFormFields.shape.synopsis, resetError);
  const {
    value: synopsis,
    handleInputChange: handleSynopsisChange,
    handleInputBlur: handleSynopsisBlur,
    hasError: synopsisHasError,
    errorMessage: synopsisError,
  } = useInput('', ChallengeFormFields.shape.synopsis, resetError);
  const {
    value: synopsis,
    handleInputChange: handleSynopsisChange,
    handleInputBlur: handleSynopsisBlur,
    hasError: synopsisHasError,
    errorMessage: synopsisError,
  } = useInput('', ChallengeFormFields.shape.synopsis, resetError);
  const {
    value: synopsis,
    handleInputChange: handleSynopsisChange,
    handleInputBlur: handleSynopsisBlur,
    hasError: synopsisHasError,
    errorMessage: synopsisError,
  } = useInput('', ChallengeFormFields.shape.synopsis, resetError);
  const {
    value: synopsis,
    handleInputChange: handleSynopsisChange,
    handleInputBlur: handleSynopsisBlur,
    hasError: synopsisHasError,
    errorMessage: synopsisError,
  } = useInput('', ChallengeFormFields.shape.synopsis, resetError);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.textEditorFormContainer}>
        <div className={styles.messageContainer}>
          <h2>New Challenge</h2>
          <p>
            To create or edit a new challenge, you need to fill in the following
            fields.
          </p>
        </div>

        <form action={formAction} className={styles.noteForm}>
          <Input
            id="message"
            name="message"
            type="text"
            placeholder="Message"
            value={message}
            onChange={handleMessageChange}
            onBlur={handleMessageBlur}
            error={messageHasError ? messageError : formState?.errors?.message}
          />
          <div className={styles.pages}>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              onBlur={handleStartDateBlur}
              error={
                startDateHasError
                  ? startDateError
                  : formState?.errors?.startDate
              }
            />
            <Input
              id="endDate"
              name="endDate"
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              onBlur={handleEndDateBlur}
              error={
                endDateHasError ? endDateError : formState?.errors?.endDate
              }
            />
          </div>

          <MainButton type="submit" disabled={formPending}>
            <span>
              {formType === "create" ? "Create Challenge" : "Update Challenge"}
            </span>
          </MainButton>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
