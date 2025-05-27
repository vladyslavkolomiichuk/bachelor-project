"use server";

import { verifyAuth } from "@/lib/auth";
import { addChallenge, updateChallenge } from "@/lib/db/challenge";
import { ChallengeFormSchema } from "@/lib/definitions";
import { redirect } from "next/navigation";

export async function challengeCreateAction(prevState, formData) {
  const message = formData.get("message");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");

  const category = formData.get("category");
  const status = formData.get("status");

  const validatedFields = ChallengeFormSchema.safeParse({
    message,
    startDate,
    endDate,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        message,
        startDate,
        endDate,
      },
    };
  }

  const result = await verifyAuth();
  const userId = result.user.id;

  try {
    await addChallenge(message, startDate, endDate, category, status, userId);
    redirect("/challenges");
  } catch (error) {
    throw error;
  }
}

export async function challengeUpdateAction(prevState, formData) {
  const message = formData.get("message");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");

  const challengeId = formData.get("challengeId");
  const category = formData.get("category");
  const status = formData.get("status");

  const validatedFields = ChallengeFormSchema.safeParse({
    message,
    startDate,
    endDate,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        message,
        startDate,
        endDate,
      },
    };
  }

  try {
    await updateChallenge(
      challengeId,
      message,
      startDate,
      endDate,
      category,
      status
    );
    redirect("/challenges");
  } catch (error) {
    throw error;
  }
}
