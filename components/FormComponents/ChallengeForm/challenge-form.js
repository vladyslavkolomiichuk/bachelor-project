import { startTransition, useActionState, useEffect } from "react";
import { useInput } from "@/hooks/useInput";
import { ChallengeFormFields } from "@/lib/definitions";
import Input from "../Input/Input";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { multiplexerAction } from "@/actions/challenge-multiplexer";

import styles from "../form.module.css";

function formatDateForInput(dateInput) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ChallengeForm({
  isOpen,
  onCancel,
  onDone,
  formType = "create",
  defaultChallenge = {},
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

    formData.append("challengeId", defaultChallenge.id);
    formData.append("category", "own");

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
    if (defaultChallenge && formType === "update") {
      setMessage(defaultChallenge.message || "");
      setStartDate(formatDateForInput(defaultChallenge.start_date) || "");
      setEndDate(formatDateForInput(defaultChallenge.end_date) || "");
    }
  }, [defaultChallenge]);

  useEffect(() => {
    if (!formPending && formState?.data && !formState?.errors) {
      onDone(formState.data);
    }
  }, [formPending, formState]);

  useEffect(() => {
    if (!isOpen) {
      resetEndDate();
      resetMessage();
      resetStartDate();
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
    value: message,
    setValue: setMessage,
    handleInputChange: handleMessageChange,
    handleInputBlur: handleMessageBlur,
    hasError: messageHasError,
    errorMessage: messageError,
    reset: resetMessage,
  } = useInput(
    defaultChallenge?.message || "",
    ChallengeFormFields.shape.message,
    resetError
  );
  const {
    value: startDate,
    setValue: setStartDate,
    handleInputChange: handleStartDateChange,
    handleInputBlur: handleStartDateBlur,
    hasError: startDateHasError,
    errorMessage: startDateError,
    reset: resetStartDate,
  } = useInput(
    formatDateForInput(defaultChallenge?.start_date) || "",
    ChallengeFormFields.shape.startDate,
    resetError
  );
  const {
    value: endDate,
    setValue: setEndDate,
    handleInputChange: handleEndDateChange,
    handleInputBlur: handleEndDateBlur,
    hasError: endDateHasError,
    errorMessage: endDateError,
    reset: resetEndDate,
  } = useInput(
    formatDateForInput(defaultChallenge?.end_date) || "",
    ChallengeFormFields.shape.endDate,
    resetError
  );

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

        <form onSubmit={handleSubmit} className={styles.noteForm}>
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
