"use server";

import { LoginFormSchema, SignupFormSchema } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { createUser, getUserByEmail } from "@/lib/db/user";
import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";

export async function signupAction(prevState, formData) {
  const name = formData.get("name");
  const surname = formData.get("surname");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name,
    surname,
    username,
    email,
    password,
    confirmPassword,
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
        password,
        confirmPassword,
      },
    };
  }

  const hashedPassword = await hashUserPassword(password);

  try {
    const userId = await createUser(
      name,
      surname,
      username,
      email,
      hashedPassword
    );
    await createAuthSession(userId);
    redirect("/");
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

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email,
    password,
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: {
        email,
        password,
      },
    };
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: ["Could not authenticate user, please check your email."],
      },
    };
  }

  const isValidPassword = await verifyPassword(
    existingUser.hashed_password,
    password
  );

  if (!isValidPassword) {
    return {
      errors: {
        password: ["Could not authenticate user, please check your password."],
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
