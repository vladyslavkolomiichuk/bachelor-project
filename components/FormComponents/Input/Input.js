"use client";

import { useState } from "react";
import FormError from "../FormError/form-error";
import { Eye, EyeOff } from "lucide-react";

import styles from "./input.module.css";

export default function Input({ id, error, type, ...props }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={styles.input}>
      <input id={id} type={passwordVisible ? "text" : type} {...props} />
      {id === "password" || id === "confirmPassword" ? (
        passwordVisible ? (
          <EyeOff onClick={() => setPasswordVisible(false)} />
        ) : (
          <Eye onClick={() => setPasswordVisible(true)} />
        )
      ) : null}
      {error?.length > 0 && (
        <FormError>
          {error.length > 1 ? (
            <div>
              <p>{props.placeholder} must:</p>
              <ul>
                {error.map((msg, index) => (
                  <li key={index}>- {msg}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>{error[0]}</p>
          )}
        </FormError>
      )}
    </div>
  );
}
