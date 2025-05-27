"use server";

import {
  challengeCreateAction,
  challengeUpdateAction,
} from "./challenge-actions";

export async function multiplexerAction(prevStat, formData) {
  const actionType = formData.get("actionType");

  if (actionType === "create") {
    return challengeCreateAction(prevStat, formData);
  }

  if (actionType === "update") {
    return challengeUpdateAction(prevStat, formData);
  }

  return { error: "Unknown action type" };
}
