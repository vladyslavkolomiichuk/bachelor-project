"use server";

import { addBookAction, updateBookAction } from "./admin-book-actions";

export async function multiplexerAction(prevState, formData) {
  const actionType = formData.get("actionType");

  if (actionType === "create") {
    return addBookAction(prevState, formData);
  }

  if (actionType === "update") {
    return updateBookAction(prevState, formData);
  }

  return { error: "Unknown action type" };
}
