"use client";

import { signupAction } from "@/actions/auth-actions";
import { useActionState } from "react";
import Link from "next/link";
import Input from "../Input/Input";
import { useInput } from "@/hooks/useInput";
import { SignupFormSchema } from "@/lib/definitions";

import styles from "../auth.module.css";

export default function SignupForm() {
  const [formState, formAction, formPending] = useActionState(signupAction, {
    errors: null,
    data: null,
  });

  const resetError = (field) => {
    formState.errors = {
      ...formState.errors,
      [field]: null,
    };
  };

  const {
    value: name,
    handleInputChange: handleNameChange,
    handleInputBlur: handleNameBlur,
    hasError: nameHasError,
    errorMessage: nameError,
  } = useInput("", SignupFormSchema._def.schema.shape.name, resetError);
  const {
    value: surname,
    handleInputChange: handleSurnameChange,
    handleInputBlur: handleSurnameBlur,
    hasError: surnameHasError,
    errorMessage: surnameError,
  } = useInput("", SignupFormSchema._def.schema.shape.surname, resetError);
  const {
    value: username,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameHasError,
    errorMessage: usernameError,
  } = useInput("", SignupFormSchema._def.schema.shape.username, resetError);
  const {
    value: email,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
    errorMessage: emailError,
  } = useInput("", SignupFormSchema._def.schema.shape.email, resetError);
  const {
    value: password,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
    errorMessage: passwordError,
  } = useInput("", SignupFormSchema._def.schema.shape.password, resetError);
  const {
    value: confirmPassword,
    handleInputChange: handleConfirmPasswordChange,
    handleInputBlur: handleConfirmPasswordBlur,
    hasError: confirmPasswordHasError,
    errorMessage: confirmPasswordError,
  } = useInput(
    "",
    SignupFormSchema._def.schema.shape.confirmPassword,
    resetError
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.nameWrapper}>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          error={nameHasError ? nameError : formState?.errors?.name}
        />

        <Input
          id="surname"
          name="surname"
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={handleSurnameChange}
          onBlur={handleSurnameBlur}
          error={surnameHasError ? surnameError : formState?.errors?.surname}
        />
      </div>

      <Input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
        onBlur={handleUsernameBlur}
        error={usernameHasError ? usernameError : formState?.errors?.username}
      />

      <Input
        id="email"
        name="email"
        type="text"
        placeholder="E-mail"
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailBlur}
        error={emailHasError ? emailError : formState?.errors?.email}
      />

      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        onBlur={handlePasswordBlur}
        error={passwordHasError ? passwordError : formState?.errors?.password}
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        onBlur={handleConfirmPasswordBlur}
        error={
          confirmPasswordHasError
            ? confirmPasswordError
            : formState?.errors?.confirmPassword
        }
      />

      <div className={styles.submitBlock}>
        <MainButton type="submit" disabled={formPending}>
          <span>Sing up</span>
        </MainButton>
        <div className={styles.helpText}>
          <Link href="/login">Log in </Link>
        </div>
      </div>
    </form>
  );
}
