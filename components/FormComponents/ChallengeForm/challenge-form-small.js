import { startTransition, useActionState, useEffect } from "react";
import { useInput } from "@/hooks/useInput";
import { ChallengeFormFields } from "@/lib/definitions";
import Input from "../Input/Input";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { challengeCreateAction } from "@/actions/challenge-actions";

import styles from "../form.module.css";

export default function ChallengeFormSmall({
  isOpen,
  onCancel,
  onDone,
  challenge,
}) {
  const [formState, formAction, formPending] = useActionState(
    challengeCreateAction,
    {
      errors: null,
      data: null,
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append(
      "message",
      `${
        challenge.charAt(0).toUpperCase() + challenge.slice(1)
      } Challenge: ${number} ${
        challenge === "book"
          ? "Books"
          : challenge === "page"
          ? "Pages"
          : "Hours"
      }`
    );
    formData.append("category", challenge);

    const today = new Date();
    const start = new Date(formData.get("startDate"));
    const end = new Date(formData.get("endDate"));

    const status = start <= today && end >= today ? "in-progress" : "upcoming";
    formData.append("status", status);

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    handleNumberChange({ target: { value: "" } });
    handleStartDateChange({ target: { value: "" } });
    handleEndDateChange({ target: { value: "" } });
  }, [challenge]);

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
    value: number,
    handleInputChange: handleNumberChange,
    handleInputBlur: handleNumberBlur,
    hasError: numberHasError,
    errorMessage: numberError,
  } = useInput("", ChallengeFormFields.shape.number, resetError);
  const {
    value: startDate,
    handleInputChange: handleStartDateChange,
    handleInputBlur: handleStartDateBlur,
    hasError: startDateHasError,
    errorMessage: startDateError,
  } = useInput("", ChallengeFormFields.shape.startDate, resetError);
  const {
    value: endDate,
    handleInputChange: handleEndDateChange,
    handleInputBlur: handleEndDateBlur,
    hasError: endDateHasError,
    errorMessage: endDateError,
  } = useInput("", ChallengeFormFields.shape.endDate, resetError);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.textEditorFormContainer}>
        <div className={styles.messageContainer}>
          <h2>
            New {challenge.charAt(0).toUpperCase() + challenge.slice(1)}{" "}
            Challenge
          </h2>
          <p>
            To create a new challenge, you need to fill in the following fields.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.noteForm}>
          <Input
            id="number"
            name="number"
            type="number"
            placeholder={`Number of ${
              challenge === "book"
                ? "Books"
                : challenge === "page"
                ? "Pages"
                : "Hours"
            }`}
            value={number}
            onChange={handleNumberChange}
            onBlur={handleNumberBlur}
            error={numberHasError ? numberError : formState?.errors?.number}
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
              {challenge === "book"
                ? "Create Book Challenge"
                : challenge === "page"
                ? "Create Page Challenge"
                : "Create Hour Challenge"}
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
