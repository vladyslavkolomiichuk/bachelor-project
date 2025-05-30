"use server";

import { verifyAuth } from "@/lib/auth";
import { addBookToDbFromApi, isBookInDbById } from "@/lib/db/book";
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
    let bookInDb;
    try {
      bookInDb = await isBookInDbById(bookId);
    } catch {}

    if (!bookInDb) {
      const newBookId = await addBookToDbFromApi(bookId);
      await createReview(userId, newBookId, rating, text);
      return;
    }

    await createReview(userId, bookId, rating, text);
  } catch (error) {
    throw error;
  }
}
