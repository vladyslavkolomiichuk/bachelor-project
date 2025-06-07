import { X } from "lucide-react";
import styles from "./chat-item.module.css";

export default function ChatItem({ chat, activeChatId, onSelect, onDelete }) {
  const { id, name, last_message_text, last_message_time, unread_count } = chat;
  return (
    <div
      className={`${styles.item} ${
        id === activeChatId ? styles.itemActive : ""
      }`}
      onClick={() => onSelect(id)}
    >
      <div className={styles.together}>
        <p className={styles.name}>{name}</p>
        <div className={styles.action}>
          {last_message_time && (
            <p className={styles.date}>
              {new Date(last_message_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          )}{" "}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className={styles.deleteButton}
          >
            <X />
          </button>
        </div>
      </div>

      <div className={styles.together}>
        {last_message_text && (
          <p className={styles.lastText}>{last_message_text}</p>
        )}
        {unread_count > 0 && (
          <span className={styles.unread}>{unread_count}</span>
        )}
      </div>
    </div>
  );
}
