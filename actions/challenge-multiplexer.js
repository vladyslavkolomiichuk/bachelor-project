"use server";

import {
  challengeCreateAction,
  challengeUpdateAction,
} from "./challenge-actions";

export async function multiplexerAction(prevState, formData) {
  const actionType = formData.get("actionType");

  if (actionType === "create") {
    return challengeCreateAction(prevState, formData);
  }

  if (actionType === "update") {
    return challengeUpdateAction(prevState, formData);
  }

  return { error: "Unknown action type" };
}
