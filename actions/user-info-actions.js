"use server";

import { verifyAuth } from "@/lib/auth";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import pool from "@/lib/db/postgresDB";
import {
  changeGeneralUserInfo,
  changeUserImage,
  changeUserPassword,
} from "@/lib/db/user";
import {
  GeneralUserInfoFormSchema,
  UserImageFormSchema,
  UserPasswordFormSchema,
} from "@/lib/definitions";
import { hashUserPassword } from "@/lib/hash";
import { redirect } from "next/navigation";

export async function generalUserInfoAction(prevState, formData) {
  const name = formData.get("name");
  const surname = formData.get("surname");
  const username = formData.get("username");
  const email = formData.get("email");

  // Validate form fields
  const validatedFields = GeneralUserInfoFormSchema.safeParse({
    name,
    surname,
    username,
    email,
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        name,
        surname,
        username,
        email,
      },
    };
  }

  const result = await verifyAuth();
  const userId = result.user.id;

  try {
    await changeGeneralUserInfo(userId, name, surname, username, email);
    redirect(`/user/${username}`);
  } catch (error) {
    if (error.code === "23505") {
      if (error.detail.includes("email")) {
        return {
          errors: {
            email: ["An account with this email already exists."],
          },
        };
      } else if (error.detail.includes("username")) {
        return {
          errors: {
            username: ["An account with this username already exists."],
          },
        };
      }
    }
    throw error;
  }
}

export async function userPasswordAction(prevState, formData) {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Validate form fields
  const validatedFields = UserPasswordFormSchema.safeParse({
    password,
    confirmPassword,
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        password,
        confirmPassword,
      },
    };
  }

  const result = await verifyAuth();
  const userId = result.user.id;

  const hashedPassword = await hashUserPassword(password);

  const username = await changeUserPassword(userId, hashedPassword);
  redirect(`/user/${username}`);
}

export async function userImageAction(prevState, formData) {
  const image = formData.get("userImage");

  const validatedFields = UserImageFormSchema.safeParse({
    image,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        image,
      },
    };
  }

  const result = await verifyAuth();
  const userId = result.user.id;

  const currentUser = await pool.connect();
  try {
    const userRes = await currentUser.query(
      "SELECT image FROM users WHERE id = $1",
      [userId]
    );
    const currentImageUrl = userRes.rows[0]?.image;

    let imageUrl;
    try {
      imageUrl = await uploadImage(image, "nextjs-notbook/users-image");

      if (imageUrl && currentImageUrl) {
        await deleteImage(currentImageUrl);
      }
    } catch (error) {
      console.error("Error during image upload:", error);
      throw new Error(
        `Image upload failed, please try again later. ${error.message}`
      );
    }

    const username = await changeUserImage(userId, imageUrl);
    redirect(`/user/${username}`);
  } catch (error) {
    console.error("Error updating user image:", error);
    throw error;
  } finally {
    currentUser.release();
  }
}
