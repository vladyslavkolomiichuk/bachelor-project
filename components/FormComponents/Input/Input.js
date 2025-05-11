import FormError from "../FormError/form-error";

import styles from "./input.module.css";

export default function Input({ id, error, ...props }) {
  return (
    <div className={styles.input}>
      <input id={id} {...props} />
      {error?.length > 0 && (
        <FormError>
          {error.length > 1 ? (
            <div>
              <p>Password must:</p>
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
