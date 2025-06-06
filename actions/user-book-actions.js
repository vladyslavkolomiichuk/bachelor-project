"use server";

import { uploadImage } from "@/lib/cloudinary";
import { addBookToUserLib } from "@/lib/db/book";
import { NewBookFormSchema } from "@/lib/definitions";

export async function newBookAddAction(prevState, formData) {
  const isbn13 = formData.get("isbn13");
  const title = formData.get("title");
  const image = formData.get("image");
  const synopsis = formData.get("synopsis");
  const subjects = formData.get("subjects");
  const buy_link = formData.get("buyLink");
  const binding = formData.get("binding");
  const authors = formData.get("authors");
  const title_long = formData.get("longTitle");
  const pages = formData.get("pages");
  const dimensions = formData.get("dimensions");
  const language = formData.get("language");
  const publisher = formData.get("publisher");
  const date_published = formData.get("datePublished");

  const validatedFields = NewBookFormSchema.safeParse({
    isbn13,
    title,
    image,
    synopsis,
    subjects,
    buyLink: buy_link,
    binding,
    authors,
    longTitle: title_long,
    pages,
    dimensions,
    language,
    publisher,
    datePublished: date_published,
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
        buy_link,
        binding,
        authors,
        title_long,
        pages,
        dimensions,
        language,
        publisher,
        date_published,
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
    const newBook = await addBookToUserLib(
      {
        isbn13: Number(isbn13),
        title,
        image: imageUrl,
        synopsis,
        subjects: subjectsArray,
        buy_link,
        binding,
        authors: authorsArray,
        title_long,
        pages,
        dimensions,
        language,
        publisher,
        date_published,
      },
      true
    );

    const createdBook = {
      ...newBook,
      category: "default",
    };

    return {
      data: createdBook,
      errors: null,
    };
  } catch (error) {
    throw error;
  }
}
