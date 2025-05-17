"use server";

import {
  textEditorCreateAction,
  textEditorUpdateAction,
} from "./text-editor-actions";

export async function multiplexerAction(prevStat, formData) {
  const actionType = formData.get("actionType");

  if (actionType === "create") {
    return textEditorCreateAction(prevStat, formData);
  }

  if (actionType === "update") {
    return textEditorUpdateAction(prevStat, formData);
  }

  return { error: "Unknown action type" };
}
