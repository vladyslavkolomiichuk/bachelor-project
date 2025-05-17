import { z } from "zod";

export const SignupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(50, { message: "Title must be at most 200 characters." })
      .trim(),
    surname: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(50, { message: "Title must be at most 200 characters." })
      .trim(),
    username: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(50, { message: "Title must be at most 200 characters." })
      .trim(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const GeneralUserInfoFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Title must be at most 200 characters." })
    .trim(),
  surname: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Title must be at most 200 characters." })
    .trim(),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Title must be at most 200 characters." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
});

export const UserPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UserImageFormSchema = z.object({
  image: z.any().refine((file) => file instanceof File && file.size > 0, {
    message: "Image is required.",
  }),
});

export const TextEditorFormSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Title must be at least 2 characters long." })
      .max(200, { message: "Title must be at most 200 characters." }),
    description: z
      .string()
      .min(2, { message: "Description must be at least 2 characters long." })
      .max(1000, { message: "Description must be at most 1000 characters." }),
    startPage: z.preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: "Start page must be a number." })
        .int({ message: "Start page must be an integer." })
        .min(1, { message: "Start page must be at least 1." })
    ),
    endPage: z.preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: "End page must be a number." })
        .int({ message: "End page must be an integer." })
        .min(1, { message: "End page must be at least 1." })
    ),
  })
  .refine((data) => data.endPage >= data.startPage, {
    message: "End page must be greater than or equal to start page.",
    path: ["endPage"],
  });
