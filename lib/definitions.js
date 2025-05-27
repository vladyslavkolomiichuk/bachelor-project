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

export const ChallengeFormFields = z.object({
  message: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(200, { message: "Title must be at most 200 characters." })
    .optional(),
  number: z
    .preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: "Number must be a number." })
        .int({ message: "Number must be an integer." })
        .min(1, { message: "Number must be at least 1." })
    )
    .optional(),
  startDate: z
    .preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date
          ? new Date(val)
          : undefined,
      z.date({ required_error: "Start date is required." })
    )
    .optional(),
  endDate: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date
        ? new Date(val)
        : undefined,
    z.date({ required_error: "End date is required." })
  ),
});

export const ChallengeFormSchema = ChallengeFormFields.refine(
  (data) => data.endDate >= data.startDate,
  {
    message: "End date must be after or equal to start date.",
    path: ["endDate"],
  }
).refine(
  (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return data.endDate >= today;
  },
  {
    message: "End date cannot be in the past.",
    path: ["endDate"],
  }
);

export const NewBookFormFields = z.object({
  message: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(200, { message: "Title must be at most 200 characters." })
    .optional(),
  number: z
    .preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: "Number must be a number." })
        .int({ message: "Number must be an integer." })
        .min(1, { message: "Number must be at least 1." })
    )
    .optional(),
  startDate: z
    .preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date
          ? new Date(val)
          : undefined,
      z.date({ required_error: "Start date is required." })
    )
    .optional(),
  endDate: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date
        ? new Date(val)
        : undefined,
    z.date({ required_error: "End date is required." })
  ),
});

export const NewBookFormSchema = NewBookFormFields.refine(
  (data) => data.endDate >= data.startDate,
  {
    message: "End date must be after or equal to start date.",
    path: ["endDate"],
  }
).refine(
  (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return data.endDate >= today;
  },
  {
    message: "End date cannot be in the past.",
    path: ["endDate"],
  }
);
