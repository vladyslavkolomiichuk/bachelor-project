"use client";

import { redirect } from "next/navigation";
import { UserRoundCheck } from "lucide-react";
import { Bell } from "lucide-react";
import { Flame } from "lucide-react";
import Badge from "@/components/Badge/badge";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { UserRoundX } from "lucide-react";
import { getUsername, getUserVisitScore } from "@/lib/db/user";

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

  const handleClickLogin = () => {
    redirect("/login");
  };

  const handleClickSignup = () => {
    redirect("/signup");
  };

  return (
    <div className={styles.notificationBar}>
      <button
        type="button"
        className={styles.button}
        onClick={handleUserButtonClick}
        title="Profile"
        disabled={!user}
      >
        {user ? (
          <UserRoundCheck strokeWidth={3} />
        ) : (
          <UserRoundX strokeWidth={3} />
        )}
      </button>
      {user ? (
        <p>{username}</p>
      ) : (
        <div className={styles.authActions}>
          <p onClick={handleClickLogin} className={styles.authBtn}>
            Log In
          </p>
          <p>/</p>
          <p onClick={handleClickSignup} className={styles.authBtn}>
            Sign Up
          </p>
        </div>
      )}

      <button type="button" className={styles.button} title="Notifications">
        <Bell strokeWidth={3} />
      </button>
      <Badge getCount={getUserVisitScore} type="notification">
        <button type="button" className={styles.button} title="Visit streak">
          <Flame strokeWidth={3} />
        </button>
      </Badge>
    </div>
  );
}
