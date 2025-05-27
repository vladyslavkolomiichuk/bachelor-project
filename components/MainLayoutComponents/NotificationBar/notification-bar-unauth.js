"use client";

import { redirect } from "next/navigation";
import { UserRoundX } from "lucide-react";
import { Bell } from "lucide-react";
import { Flame } from "lucide-react";

import styles from "./notification-bar.module.css";

export default function NotificationBarUnauth() {
  const handleUserButtonClick = () => {
    redirect('/login');
  };

  return (
    <div className={styles.notificationBar}>
      <button
        type="button"
        className={styles.button}
        onClick={handleUserButtonClick}
      >
        <UserRoundX strokeWidth={3} />
      </button>
      <p onClick={handleUserButtonClick} style={{cursor: 'pointer'}}>Log In</p>
      <button type="button" className={styles.button}>
        <Bell strokeWidth={3} />
      </button>
      <button type="button" className={styles.button}>
        <div className={styles.flameWrapper}>
          <Flame strokeWidth={3} />
        </div>
      </button>
    </div>
  );
}
