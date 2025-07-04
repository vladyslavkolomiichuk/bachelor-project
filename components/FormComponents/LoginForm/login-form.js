"use client";

import { loginAction } from "@/actions/auth-actions";
import { useActionState } from "react";
import { Link } from "nextjs13-progress";
import Input from "../Input/Input";
import { useInput } from "@/hooks/useInput";
import { LoginFormSchema } from "@/lib/definitions";

import styles from "../form.module.css";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";

export default function LoginForm() {
  const [formState, formAction, formPending] = useActionState(loginAction, {
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
    value: email,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
    errorMessage: emailError,
  } = useInput("", LoginFormSchema.shape.email, resetError);
  const {
    value: password,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
    errorMessage: passwordError,
  } = useInput("", LoginFormSchema.shape.password, resetError);

  return (
    <form action={formAction} className={styles.form}>
      <Input
        id="email"
        name="email"
        type="text"
        placeholder="Email"
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

      <div className={styles.submitBlock}>
        <MainButton type="submit" disabled={formPending}>
          <span>Log in</span>
        </MainButton>
        <div className={styles.helpText}>
          <Link href="/signup">Sing up</Link>
        </div>
      </div>

      <div className={styles.forgotBlock}>
        <Link href="/forgotpassword">Forgot your password?</Link>
      </div>
    </form>
  );
}
