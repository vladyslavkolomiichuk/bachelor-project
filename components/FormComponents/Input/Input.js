import FormError from "../FormError/form-error";

import styles from "./input.module.css";

export default function Input({ id, error, ...props }) {
  return (
    <div className={styles.input}>
      <input id={id} {...props} />
      {error && (
        <FormError>
          {error && Object.keys(error).length > 1 ? (
            <div>
              <p>Password must:</p>
              <ul>
                {Object.keys(error).map((key) => (
                  <li key={key}>- {error[key]}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>{error}</p>
          )}
        </FormError>
      )}
    </div>
  );
}
