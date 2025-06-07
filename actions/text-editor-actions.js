"use server";

import { verifyAuth } from "@/lib/auth";
import { addNote, updateNote } from "@/lib/db/note";
import { TextEditorFormSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function textEditorCreateAction(prevState, formData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const startPage = formData.get("startPage");
  const endPage = formData.get("endPage");

  const timer = formData.get("timer");
  const content = formData.get("content");
  const bookId = formData.get("bookId");

  const wordsCount = formData.get("wordsCount");

  const validatedFields = TextEditorFormSchema.safeParse({
    title,
    description,
    startPage,
    endPage,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        title,
        description,
        startPage,
        endPage,
      },
    };
  }

  const result = await verifyAuth();
  const userId = result.user.id;

  try {
    const bookIsbn = await addNote(
      title,
      description,
      startPage,
      endPage,
      timer,
      content,
      bookId,
      userId,
      wordsCount
    );
    redirect(`/book/${bookIsbn}`);
  } catch (error) {
    throw error;
  }
}

export async function textEditorUpdateAction(prevState, formData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const startPage = formData.get("startPage");
  const endPage = formData.get("endPage");

  const noteId = formData.get("noteId");
  const sessionId = formData.get("sessionId");
  const timer = formData.get("timer");
  const content = formData.get("content");
  const bookId = formData.get("bookId");

  const validatedFields = TextEditorFormSchema.safeParse({
    title,
    description,
    startPage,
    endPage,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        title,
        description,
        startPage,
        endPage,
      },
    };
  }

  const result = await verifyAuth();
  const userId = result.user.id;

  try {
    const bookIsbn = await updateNote(
      noteId,
      sessionId,
      title,
      description,
      startPage,
      endPage,
      timer,
      content,
      bookId,
      userId
    );
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}
