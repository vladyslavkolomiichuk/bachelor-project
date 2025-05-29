import { startTransition, useActionState, useEffect } from "react";
import { useInput } from "@/hooks/useInput";
import { ChallengeFormFields } from "@/lib/definitions";
import Input from "../Input/Input";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { challengeUpdateAction } from "@/actions/challenge-actions";

import styles from "../form.module.css";

export default function ChallengeEndDateForm({
  isOpen,
  onCancel,
  onDone,
  challengeId,
  message,
  startDate,
  category,
  defaultEndDate,
}) {
  const [formState, formAction, formPending] = useActionState(
    challengeUpdateAction,
    {
      errors: null,
      data: null,
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append("challengeId", challengeId);
    formData.append("message", message);
    formData.append("startDate", startDate);
    formData.append("category", category);

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
    if (!formPending && formState === undefined) {
      onDone();
    }
  }, [formPending, formState]);

  useEffect(() => {
    if (!isOpen) {
      resetEndDate();
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
  }, [isOpen, onCancel]);

  const resetError = (field) => {
    formState.errors = {
      ...formState.errors,
      [field]: null,
    };
  };

  const {
    value: endDate,
    handleInputChange: handleEndDateChange,
    handleInputBlur: handleEndDateBlur,
    hasError: endDateHasError,
    errorMessage: endDateError,
    reset: resetEndDate,
  } = useInput(defaultEndDate, ChallengeFormFields.shape.endDate, resetError);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.textEditorFormContainer}>
        <div className={styles.messageContainer}>
          <h2>Reset Challenge</h2>
          <p>To reset a challenge, you must specify a end date for it.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.noteForm}>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            onBlur={handleEndDateBlur}
            error={endDateHasError ? endDateError : formState?.errors?.endDate}
          />

          <MainButton type="submit" disabled={formPending}>
            <span>Reset Challenge</span>
          </MainButton>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
