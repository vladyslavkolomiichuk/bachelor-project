"use server";

import { uploadImage } from "@/lib/cloudinary";
import { addBookToDb } from "@/lib/db/book";
import { NewBookFormSchema } from "@/lib/definitions";
import { redirect } from "next/navigation";

export async function newBookAddAction(prevState, formData) {
  const isbn13 = formData.get("isbn13");
  const title = formData.get("title");
  const image = formData.get("image");
  const synopsis = formData.get("synopsis");
  const subjects = formData.get("subjects");
  const buyLink = formData.get("buyLink");
  const binding = formData.get("binding");
  const authors = formData.get("authors");
  const longTitle = formData.get("longTitle");
  const pages = formData.get("pages");
  const dimensions = formData.get("dimensions");
  const language = formData.get("language");
  const publisher = formData.get("publisher");
  const datePublished = formData.get("datePublished");

  const validatedFields = NewBookFormSchema.safeParse({
    isbn13,
    title,
    image,
    synopsis,
    subjects,
    buyLink,
    binding,
    authors,
    longTitle,
    pages,
    dimensions,
    language,
    publisher,
    datePublished,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        isbn13,
        title,
        image,
        synopsis,
        subjects,
        buyLink,
        binding,
        authors,
        longTitle,
        pages,
        dimensions,
        language,
        publisher,
        datePublished,
      },
    };
  }

  let imageUrl;

  try {
    imageUrl = await uploadImage(image, "nextjs-notbook/books-image");
  } catch (error) {
    throw "Image upload failed, post was not created. Please try again later.";
  }

  const subjectsArray = subjects
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const authorsArray = authors
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  try {
    await addBookToDb(
      {
        isbn13: Number(isbn13),
        title,
        image: imageUrl,
        synopsis,
        subjects: subjectsArray,
        buyLink,
        binding,
        authors: authorsArray,
        longTitle,
        pages,
        dimensions,
        language,
        publisher,
        datePublished,
      },
      true
    );
    redirect("/library");
  } catch (error) {
    throw error;
  }
}
