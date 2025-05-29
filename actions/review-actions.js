"use server";

import { verifyAuth } from "@/lib/auth";
import { createReview } from "@/lib/db/review";
import { ReviewFormSchema } from "@/lib/definitions";

export async function reviewCreateAction(prevState, formData) {
  const text = formData.get("text");

  const bookId = formData.get("bookId");
  const rating = formData.get("rating");

  const validatedFields = ReviewFormSchema.safeParse({
    text,
    rating,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        text,
        rating,
      },
    };
  }

  const result = await verifyAuth();
  const userId = result.user.id;

  try {
    await createReview(userId, bookId, rating, text);
  } catch (error) {
    throw error;
  }
}
