"use server";

import { uploadImage } from "@/lib/cloudinary";
import { adminUpdateUserInDb } from "@/lib/db/admin";
import { EditUserFormSchema } from "@/lib/definitions";

export async function updateUserAction(prevState, formData) {
  const userId = formData.get("userId");
  const role = formData.get("role");
  const name = formData.get("name");
  const surname = formData.get("surname");
  const username = formData.get("username");
  const image = formData.get("image");
  const email = formData.get("email");
  const dateOfFirstVisit = formData.get("dateOfFirstVisit");
  const dateOfLastVisit = formData.get("dateOfLastVisit");
  const flameScore = formData.get("flameScore");

  const validatedFields = EditUserFormSchema.safeParse({
    role,
    name,
    surname,
    username,
    email,
    image,
    dateOfFirstVisit,
    dateOfLastVisit,
    flameScore,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        role,
        name,
        surname,
        username,
        email,
        image,
        dateOfFirstVisit,
        dateOfLastVisit,
        flameScore,
      },
    };
  }

  let imageUrl;

  try {
    imageUrl = await uploadImage(image, "nextjs-notbook/users-image");
  } catch (error) {
    throw "Image upload failed, post was not created. Please try again later.";
  }

  try {
    const newUser = await adminUpdateUserInDb({
      id: userId,
      role,
      name,
      surname,
      username,
      email,
      image: imageUrl,
      dateOfFirstVisit,
      dateOfLastVisit,
      flameScore,
    });

    return {
      data: newUser,
      errors: null,
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}
