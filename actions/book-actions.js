"use server";

import { addBookToDb } from "@/lib/db/book";
import { NewBookFormSchema } from "@/lib/definitions";
import { redirect } from "next/navigation";

export async function newBookAddAction(prevState, formData) {
  const message = formData.get("message");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");

  const category = formData.get("category");
  const status = formData.get("status");

  const validatedFields = NewBookFormSchema.safeParse({
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
    await addBookToDb(book, true);
    redirect("/challenges");
  } catch (error) {
    throw error;
  }
}
