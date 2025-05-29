"use client";

import { redirect } from "next/navigation";
import { UserRoundCheck } from "lucide-react";
import { Bell } from "lucide-react";
import { Flame } from "lucide-react";
import Badge from "@/components/Badge/badge";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getUsername, getUserVisitScore } from "@/lib/db/user";
import NotificationBarUnauth from "./notification-bar-unauth";

import styles from "./notification-bar.module.css";

export default function NotificationBar() {
  const { user } = useUser();
  const userId = user?.id;

  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const name = await getUsername(userId);
      setUsername(name);
    };

    fetchData();
  }, [userId]);

  const handleUserButtonClick = () => {
    redirect(`/user/${username}`);
  };

  return user ? (
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
      <Badge getCount={getUserVisitScore} type="notification">
        <button type="button" className={styles.button} title="Visit streak">
          <Flame strokeWidth={3} />
        </button>
      </Badge>
    </div>
  ) : (
    <NotificationBarUnauth />
  );
}
