"use server";

import { uploadImage } from "@/lib/cloudinary";
import { addArticleToUserLib, addBookToUserLib } from "@/lib/db/book";
import { NewArticleFormSchema } from "@/lib/definitions";

export async function newArticleAddAction(prevState, formData) {
  const doi = formData.get("doi");
  const title = formData.get("title");
  const image = formData.get("image");
  const subjects = formData.get("subjects");
  const authors = formData.get("authors");
  const title_long = formData.get("longTitle");
  const pages = formData.get("pages");
  const language = formData.get("language");
  const date_published = formData.get("datePublished");

  const validatedFields = NewArticleFormSchema.safeParse({
    doi,
    title,
    image,
    subjects,
    authors,
    longTitle: title_long,
    pages,
    language,
    datePublished: date_published,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        doi,
        title,
        image,
        subjects,
        authors,
        title_long,
        pages,
        language,
        date_published,
      },
    };
  }

  let imageUrl;

  try {
    imageUrl = await uploadImage(image, "nextjs-notbook/articles-image");
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
    const newArticle = await addArticleToUserLib(
      {
        doi,
        title,
        image: imageUrl,
        subjects: subjectsArray,
        authors: authorsArray,
        title_long,
        pages,
        language,
        date_published,
      },
      true
    );

    const createdArticle = {
      ...newArticle,
      category: "default",
    };

    return {
      data: createdArticle,
      errors: null,
    };
  } catch (error) {
    throw error;
  }
}
