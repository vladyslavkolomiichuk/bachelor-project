import { startTransition, useActionState, useEffect } from "react";
import { useInput } from "@/hooks/useInput";
import { EditUserFormSchema } from "@/lib/definitions";
import Input from "../Input/Input";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { updateUserAction } from "@/actions/admin-edit-user-actions";

import styles from "../form.module.css";

function formatDateForInput(dateInput) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminEditUserForm({
  isOpen,
  onCancel,
  onDone,
  defaultUser = {},
}) {
  const [formState, formAction, formPending] = useActionState(
    updateUserAction,
    {
      errors: null,
      data: null,
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append("userId", defaultUser?.id);

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (defaultUser) {
      setDateOfFirstVisit(formatDateForInput(defaultUser?.date_of_first_visit) || "");
      setDateOfLastVisit(formatDateForInput(defaultUser?.date_of_last_visit) || "");
      setEmail(defaultUser?.email || "");
      setFlameScore(defaultUser?.flame_score || "");
      setImage(defaultUser?.image || "");
      setName(defaultUser?.name || "");
      setRole(defaultUser?.role || "");
      setSurname(defaultUser?.surname || "");
      setUsername(defaultUser?.username || "");
    }
  }, [defaultUser]);

  useEffect(() => {
    if (!formPending && formState?.data && !formState?.errors) {
      onDone(formState.data);
    }
  }, [formPending, formState]);

  useEffect(() => {
    if (!isOpen) {
      resetDateOfFirstVisit();
      resetDateOfLastVisit();
      resetEmail();
      resetFlameScore();
      resetImage();
      resetName();
      resetRole();
      resetSurname();
      resetUsername();
      formState.errors = null;
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel, formState]);

  const resetError = (field) => {
    formState.errors = {
      ...formState.errors,
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
    reset: resetName,
  } = useInput(
    defaultUser.name || "",
    EditUserFormSchema.shape.name,
    resetError
  );
  const {
    value: surname,
    setValue: setSurname,
    handleInputChange: handleSurnameChange,
    handleInputBlur: handleSurnameBlur,
    hasError: surnameHasError,
    errorMessage: surnameError,
    reset: resetSurname,
  } = useInput(
    defaultUser.surname || "",
    EditUserFormSchema.shape.surname,
    resetError
  );
  const {
    value: image,
    setValue: setImage,
    handleInputChange: handleImageChange,
    handleInputBlur: handleImageBlur,
    hasError: imageHasError,
    errorMessage: imageError,
    reset: resetImage,
  } = useInput(
    defaultUser.image || "",
    EditUserFormSchema.shape.image,
    resetError
  );
  const {
    value: username,
    setValue: setUsername,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameHasError,
    errorMessage: usernameError,
    reset: resetUsername,
  } = useInput(
    defaultUser.username || "",
    EditUserFormSchema.shape.username,
    resetError
  );
  const {
    value: email,
    setValue: setEmail,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
    errorMessage: emailError,
    reset: resetEmail,
  } = useInput(
    defaultUser.email || "",
    EditUserFormSchema.shape.email,
    resetError
  );
  const {
    value: dateOfFirstVisit,
    setValue: setDateOfFirstVisit,
    handleInputChange: handleDateOfFirstVisitChange,
    handleInputBlur: handleDateOfFirstVisitBlur,
    hasError: dateOfFirstVisitHasError,
    errorMessage: dateOfFirstVisitError,
    reset: resetDateOfFirstVisit,
  } = useInput(
    formatDateForInput(defaultUser?.date_of_first_visit) || "",
    EditUserFormSchema.shape.dateOfFirstVisit,
    resetError
  );
  const {
    value: dateOfLastVisit,
    setValue: setDateOfLastVisit,
    handleInputChange: handleDateOfLastVisitChange,
    handleInputBlur: handleDateOfLastVisitBlur,
    hasError: dateOfLastVisitHasError,
    errorMessage: dateOfLastVisitError,
    reset: resetDateOfLastVisit,
  } = useInput(
    formatDateForInput(defaultUser?.date_of_last_visit) || "",
    EditUserFormSchema.shape.dateOfLastVisit,
    resetError
  );
  const {
    value: flameScore,
    setValue: setFlameScore,
    handleInputChange: handleFlameScoreChange,
    handleInputBlur: handleFlameScoreBlur,
    hasError: flameScoreHasError,
    errorMessage: flameScoreError,
    reset: resetFlameScore,
  } = useInput(
    defaultUser.flame_score || "",
    EditUserFormSchema.shape.flameScore,
    resetError
  );
  const {
    value: role,
    setValue: setRole,
    handleInputChange: handleRoleChange,
    handleInputBlur: handleRoleBlur,
    hasError: roleHasError,
    errorMessage: roleError,
    reset: resetRole,
  } = useInput(
    defaultUser.role || "",
    EditUserFormSchema.shape.role,
    resetError
  );

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div
        className={styles.textEditorFormContainer}
        style={{ width: "550px" }}
      >
        <div className={styles.messageContainer}>
          <h2>Edit User</h2>
          <p>Here you can edit the user.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.noteForm}>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            // onBlur={handleImageBlur}
            error={imageHasError ? imageError : formState?.errors?.image}
          />
          <Input
            id="role"
            name="role"
            type="text"
            placeholder="Role"
            value={role}
            onChange={handleRoleChange}
            onBlur={handleRoleBlur}
            error={roleHasError ? roleError : formState?.errors?.role}
          />
          <div className={styles.pages}>
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
              error={
                surnameHasError ? surnameError : formState?.errors?.surname
              }
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
            error={
              usernameHasError ? usernameError : formState?.errors?.username
            }
          />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={emailHasError ? emailError : formState?.errors?.email}
          />
          <div className={styles.pages}>
            <Input
              id="dateOfFirstVisit"
              name="dateOfFirstVisit"
              type="date"
              placeholder="Date Of First Visit"
              value={dateOfFirstVisit}
              onChange={handleDateOfFirstVisitChange}
              onBlur={handleDateOfFirstVisitBlur}
              error={
                dateOfFirstVisitHasError
                  ? dateOfFirstVisitError
                  : formState?.errors?.dateOfFirstVisit
              }
            />
            <Input
              id="dateOfLastVisit"
              name="dateOfLastVisit"
              type="date"
              placeholder="Date Of Last Visit"
              value={dateOfLastVisit}
              onChange={handleDateOfLastVisitChange}
              onBlur={handleDateOfLastVisitBlur}
              error={
                dateOfLastVisitHasError
                  ? dateOfLastVisitError
                  : formState?.errors?.dateOfLastVisit
              }
            />
          </div>
          <Input
            id="flameScore"
            name="flameScore"
            type="number"
            placeholder="Flame Score"
            value={flameScore}
            onChange={handleFlameScoreChange}
            onBlur={handleFlameScoreBlur}
            error={
              flameScoreHasError
                ? flameScoreError
                : formState?.errors?.flameScore
            }
          />

          <MainButton type="submit" disabled={formPending}>
            <span>Edit User</span>
          </MainButton>
          <button
            className={styles.cancel}
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
