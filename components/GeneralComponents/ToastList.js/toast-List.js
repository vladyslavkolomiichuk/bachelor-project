import styles from "./toast.module.css";

export default function ToastList({ toasts }) {
  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.text}
        </div>
      ))}
    </div>
  );
}
