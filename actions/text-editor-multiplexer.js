"use server";

import {
  textEditorCreateAction,
  textEditorUpdateAction,
} from "./text-editor-actions";

export async function multiplexerAction(prevState, formData) {
  const actionType = formData.get("actionType");

  if (actionType === "create") {
    return textEditorCreateAction(prevState, formData);
  }

  if (actionType === "update") {
    return textEditorUpdateAction(prevState, formData);
  }

  return { error: "Unknown action type" };
}
