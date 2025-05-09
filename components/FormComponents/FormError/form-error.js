import styles from "./form-error.module.css";

export default function FormError({ children }) {
  return <div className={styles.formError}>{children}</div>;
}
