import { useEffect } from "react";

import styles from "./confirm-modal.module.css";

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Delete",
  message = "Are you sure? The deletion cannot be undone.",
}) {
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
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.message}>
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
