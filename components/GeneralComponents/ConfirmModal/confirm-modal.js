import { useEffect } from "react";

import styles from "./confirm-modal.module.css";

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  buttonName,
  type = "delete",
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
          <h2>{title}</h2>
          <p dangerouslySetInnerHTML={{ __html: message }} />
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={type === "delete" ? styles.delete : styles.confirm}
            onClick={onConfirm}
          >
            {buttonName}
          </button>
        </div>
      </div>
    </div>
  );
}
