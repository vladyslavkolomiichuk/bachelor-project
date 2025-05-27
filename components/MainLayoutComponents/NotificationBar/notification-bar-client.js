"use client";

import { redirect } from "next/navigation";
import { UserRoundCheck } from "lucide-react";
import { Bell } from "lucide-react";
import { Flame } from "lucide-react";

import styles from "./notification-bar.module.css";
import Badge from "@/components/Badge/badge";
import { useEffect, useState } from "react";

export default function NotificationBarClient({
  userId,
  getUsername,
  getUserScore,
}) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    async function loadData() {
      const name = await getUsername(userId);
      setUsername(name);
    }

    loadData();
  }, [userId]);

  const handleUserButtonClick = () => {
    redirect(`/user/${username}`);
  };

  return (
    <div className={styles.notificationBar}>
      <button
        type="button"
        className={styles.button}
        onClick={handleUserButtonClick}
        title="Profile"
      >
        <UserRoundCheck strokeWidth={3} />
      </button>
      <p>{username}</p>
      <button type="button" className={styles.button} title="Notifications">
        <Bell strokeWidth={3} />
      </button>
      <Badge userId={userId} getCount={getUserScore} type="notification">
        <button type="button" className={styles.button} title="Visit streak">
          <Flame strokeWidth={3} />
        </button>
      </Badge>
    </div>
  );
}
