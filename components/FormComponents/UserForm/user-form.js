"use client";

import { useInput } from "@/hooks/useInput";
import Input from "../Input/Input";
import {
  GeneralUserInfoFormSchema,
  UserPasswordFormSchema,
} from "@/lib/definitions";
import {
  generalUserInfoAction,
  userImageAction,
  userPasswordAction,
} from "@/actions/user-info-actions";
import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { Aperture } from "lucide-react";
import { logoutAction } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { getFullUserInfo } from "@/lib/db/user";

import styles from "../form.module.css";
import {
  UserImagePageSkeleton,
  UserInfoPageSkeleton,
  UserPasswordPageSkeleton,
} from "@/components/Loading/Pages/user-page-skeleton";

export default function UserForm() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const result = useUser();
  const userId = result?.user?.id;

  useEffect(() => {
    if (result?.user === null) {
      router.push("/login");
    }
  }, [result, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getFullUserInfo(userId);
        setUser(userRes);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (result?.user) {
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setSurname(user.surname || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const [generalInfoFormState, generalInfoFormAction, generalInfoFormPending] =
    useActionState(generalUserInfoAction, {
      errors: null,
      data: null,
    });

  const [passwordFormState, passwordFormAction, passwordFormPending] =
    useActionState(userPasswordAction, {
      errors: null,
      data: null,
    });

  const [imageFormState, imageFormAction, imageFormPending] = useActionState(
    userImageAction,
    {
      errors: null,
      data: null,
    }
  );

  const resetGeneralInfoError = (field) => {
    generalInfoFormState.errors = {
      ...generalInfoFormState.errors,
      [field]: null,
    };
  };

  const resetPasswordError = (field) => {
    passwordFormState.errors = {
      ...passwordFormState.errors,
      [field]: null,
    };
  };

  const resetImageError = (field) => {
    imageFormState.errors = {
      ...imageFormState.errors,
      [field]: null,
    };
  };

  const {
    value: name,
    setValue: setName,
    handleInputChange: handleNameChange,
    handleInputBlur: handleNameBlur,
    hasError: nameHasError,
    errorMessage: nameError,
  } = useInput(
    user?.name || "",
    GeneralUserInfoFormSchema.shape.name,
    resetGeneralInfoError
  );
  const {
    value: surname,
    setValue: setSurname,
    handleInputChange: handleSurnameChange,
    handleInputBlur: handleSurnameBlur,
    hasError: surnameHasError,
    errorMessage: surnameError,
  } = useInput(
    user?.surname || "",
    GeneralUserInfoFormSchema.shape.surname,
    resetGeneralInfoError
  );
  const {
    value: username,
    setValue: setUsername,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameHasError,
    errorMessage: usernameError,
  } = useInput(
    user?.username || "",
    GeneralUserInfoFormSchema.shape.username,
    resetGeneralInfoError
  );
  const {
    value: email,
    setValue: setEmail,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
    errorMessage: emailError,
  } = useInput(
    user?.email || "",
    GeneralUserInfoFormSchema.shape.email,
    resetGeneralInfoError
  );
  const {
    value: password,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
    errorMessage: passwordError,
  } = useInput(
    "",
    UserPasswordFormSchema._def.schema.shape.password,
    resetPasswordError
  );
  const {
    value: confirmPassword,
    handleInputChange: handleConfirmPasswordChange,
    handleInputBlur: handleConfirmPasswordBlur,
    hasError: confirmPasswordHasError,
    errorMessage: confirmPasswordError,
  } = useInput(
    "",
    UserPasswordFormSchema._def.schema.shape.confirmPassword,
    resetPasswordError
  );

  return (
    <div className={styles.userFormContainer}>
      <div className={styles.imageContainer}>
        {!loading ? (
          <>
            <form action={imageFormAction} className={styles.userImageForm}>
              <Image
                src={user?.image || "/previews/user.png"}
                alt="User Image"
                className={styles.userImage}
                width={250}
                height={250}
              />

              <div className={styles.helpMask}>
                <label htmlFor="userImage" className={styles.userImageLabel}>
                  <Aperture />
                  {imageFormState?.errors?.image}
                </label>
              </div>
              <input
                id="userImage"
                name="userImage"
                type="file"
                accept="image/*"
                className={styles.userImageInput}
                onChange={(event) => {
                  const form = event.currentTarget.form;
                  resetImageError(event.target.name);
                  form?.requestSubmit();
                }}
                disabled={imageFormPending}
              />
            </form>

            <form action={logoutAction} className={styles.logOutForm}>
              <button type="submit" className={styles.logOutBtn}>
                Log Out
              </button>
            </form>
          </>
        ) : (
          <UserImagePageSkeleton />
        )}
      </div>
      <div className={styles.userInfoContainer}>
        <form action={generalInfoFormAction} className={styles.useeInfoForm}>
          <h2>General Info</h2>
          {!loading ? (
            <>
              <div className={styles.nameWrapper}>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  error={
                    nameHasError
                      ? nameError
                      : generalInfoFormState?.errors?.name
                  }
                />

                <Input
                  id="surname"
                  name="surname"
                  type="text"
                  placeholder="Surname"
                  value={surname}
                  onChange={handleSurnameChange}
                  onBlur={handleSurnameBlur}
                  error={
                    surnameHasError
                      ? surnameError
                      : generalInfoFormState?.errors?.surname
                  }
                />

                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                  onBlur={handleUsernameBlur}
                  error={
                    usernameHasError
                      ? usernameError
                      : generalInfoFormState?.errors?.username
                  }
                />
              </div>

              <Input
                id="email"
                name="email"
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                error={
                  emailHasError
                    ? emailError
                    : generalInfoFormState?.errors?.email
                }
              />

              <button
                type="submit"
                className={styles.submitUserInfo}
                disabled={generalInfoFormPending}
              >
                Save General Info
              </button>
            </>
          ) : (
            <UserInfoPageSkeleton />
          )}
        </form>

        <form action={passwordFormAction} className={styles.useeInfoForm}>
          <h2>Change Password</h2>
          {!loading ? (
            <>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={
                  passwordHasError
                    ? passwordError
                    : passwordFormState?.errors?.password
                }
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
                    : passwordFormState?.errors?.confirmPassword
                }
              />

              <button
                type="submit"
                className={styles.submitUserInfo}
                disabled={passwordFormPending}
              >
                Save New Password
              </button>
            </>
          ) : (
            <UserPasswordPageSkeleton />
          )}
        </form>
      </div>
    </div>
  );
}
