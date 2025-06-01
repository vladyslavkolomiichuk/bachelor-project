import { Circle, X } from "lucide-react";
import { useState } from "react";
import { sanitizeInputFront } from "@/lib/sanitize-text";

import styles from "./notification-bell.module.css";

export default function NotificationItem({
  notification,
  deleteNotification,
  markAsRead,
}) {
  const { id, title, message, type, is_read } = notification;

  const [btnHovered, setBtnHovered] = useState(false);

  const cleanMessage = sanitizeInputFront(message);

  return (
    <div
      className={`${styles.notificationItem} ${styles[type]} ${
        is_read ? styles.readNotification : ""
      }`}
      onMouseEnter={() => {
        if (!is_read) {
          markAsRead(id);
        }
      }}
    >
      <div className={styles.btnWrapper}>
        <button
          onClick={() => deleteNotification(id)}
          className={styles.notificationButton}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
        >
          {!btnHovered ? (
            <Circle
              className={`${styles.point} ${
                is_read ? styles.read : styles.unRead
              }`}
            />
          ) : (
            <X className={styles.x} />
          )}
        </button>
      </div>

      <div className={styles.notificationTitle}>{title}</div>
      <div
        className={styles.notificationMessage}
        dangerouslySetInnerHTML={{ __html: cleanMessage }}
      />
    </div>
  );
}
