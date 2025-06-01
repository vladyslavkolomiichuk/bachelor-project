"use client";

import { addNotificationForAll } from "@/lib/db/notification";
import { useToast } from "@/context/ToastContext";
import MainButton from "@/components/GeneralComponents/MainButton/main-button";
import { useState } from "react";

import styles from "./admin-notification.module.css";

export default function AdminNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPending(true);

    if (title === "" || message === "") {
      showToast("Not all fields are filled in.", "error");
      setPending(false);

      return;
    }

    try {
      await addNotificationForAll(title, message);

      showToast("Notification sent successfully.", "success");
      setTitle("");
      setMessage("");
    } catch (error) {
      showToast("Failed to add notification. Try later.", "error");
      console.error("Fetch error for adding notification:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Send Notification to All Users</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Title
          </label>
          <input
            id="title"
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>
            Message
          </label>
          <textarea
            id="message"
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <MainButton type="submit" disabled={pending}>
          {pending ? "Sending..." : "Send"}
        </MainButton>
      </form>
    </div>
  );
}
