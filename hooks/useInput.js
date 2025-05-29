"use client";

import { useState } from "react";

export function useInput(defaultValue, validationSchema, resetError) {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);

  const result = validationSchema.safeParse(enteredValue);
  const valueIsValid = result.success;

  const errorMessage = result.error?.flatten()?.formErrors;

  function handleInputChange(event) {
    setEnteredValue(event.target.value);

    setDidEdit(false);

    resetError(event.target.name);
  }

  function handleInputBlur() {
    setDidEdit(true);
  }

  function reset() {
    setEnteredValue("");
    setDidEdit(false);
  }

  return {
    value: enteredValue,
    handleInputChange,
    handleInputBlur,
    hasError: didEdit && !valueIsValid,
    errorMessage: didEdit && !valueIsValid ? errorMessage : null,
    reset,
  };
}
