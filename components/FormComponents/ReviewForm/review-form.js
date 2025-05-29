import generalStyles from "../form.module.css";
import styles from "./review-form.module.css";

import { startTransition, useActionState, useEffect, useState } from "react";
import { useInput } from "@/hooks/useInput";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { useReviews } from "@/context/ReviewsContext";
import StarRatingInput from "../StarRatingInput/star-rating-input";
import { ReviewFormSchema } from "@/lib/definitions";
import { reviewCreateAction } from "@/actions/review-actions";
import FormError from "../FormError/form-error";

export default function ReviewForm({ isOpen, onCancel, onDone, bookId }) {
  const [rating, setRating] = useState(0);

  const [formState, formAction, formPending] = useActionState(
    reviewCreateAction,
    {
      errors: null,
      data: null,
    }
  );

  const { triggerRefresh } = useReviews();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    formData.append("bookId", bookId);
    formData.append("rating", rating);

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (!formPending && formState === undefined) {
      triggerRefresh();
      onDone();
    }
  }, [formPending, formState]);

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      resetText();
    }

    if (!isOpen && formState) {
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
    if (!formState?.errors) return;
    formState.errors = {
      ...formState.errors,
      [field]: null,
    };
  };

  const {
    value: text,
    handleInputChange: handleTextChange,
    handleInputBlur: handleTextBlur,
    hasError: textHasError,
    errorMessage: textError,
    reset: resetText,
  } = useInput("", ReviewFormSchema.shape.text, resetError);

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <div className={styles.inputWrapper}>
        <StarRatingInput value={rating} onChange={setRating} />

        {formState?.errors?.rating && (
          <FormError>{formState?.errors?.rating}</FormError>
        )}
      </div>

      <div className={styles.inputWrapper}>
        <textarea
          className={styles.textInput}
          id="text"
          name="text"
          type="text"
          placeholder="Your Review"
          value={text}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
        ></textarea>

        {(textHasError || formState?.errors?.text) && (
          <FormError>
            {textHasError ? textError : formState?.errors?.text}
          </FormError>
        )}
      </div>

      <div className={styles.buttons}>
        <MainButton type="submit" disabled={formPending}>
          <span>Add Review</span>
        </MainButton>
        <button className={generalStyles.cancel} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
