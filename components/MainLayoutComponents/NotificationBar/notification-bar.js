"use client";

import { Shield, UserRoundCheck } from "lucide-react";
import { Flame } from "lucide-react";
import SeparateBadge from "@/components/Badge/separate-badge";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { UserRoundX } from "lucide-react";
import { getUsername, getUserVisitScore } from "@/lib/db/user";
import NotificationBell from "./notification-bell";
import { useRouter } from "nextjs13-progress";

import styles from "./notification-bar.module.css";

export default function NotificationBar() {
  const router = useRouter();

  const { user } = useUser();
  const userId = user?.id;
  const userRole = user?.role;

  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const name = await getUsername(userId);
      setUsername(name);
    };

    fetchData();
  }, [userId]);

  const handleUserButtonClick = () => {
    router.push(`/user/${username}`);
  };

  const handleAdminButtonClick = () => {
    router.push("/admin");
  };

  const handleClickLogin = () => {
    router.push("/login");
  };

  const handleClickSignup = () => {
    router.push("/signup");
  };

  return (
    <div className={styles.notificationBar}>
      {userRole === "admin" && (
        <button
          type="button"
          className={styles.button}
          onClick={handleAdminButtonClick}
        >
          <Shield strokeWidth={3} />
        </button>
      )}

      <button
        type="button"
        className={styles.button}
        onClick={handleUserButtonClick}
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
          <button
            onClick={handleClickLogin}
            className={`${styles.authBtn} ${styles.loginBtn}`}
          >
            Log In
          </button>
          <p>/</p>
          <button onClick={handleClickSignup} className={styles.authBtn}>
            Sign Up
          </button>
        </div>
      )}

      {user && (
        <>
          <NotificationBell />
          <SeparateBadge getCount={getUserVisitScore} type="visit">
            <button type="button" className={styles.button}>
              <Flame strokeWidth={3} />
            </button>
          </SeparateBadge>
        </>
      )}
    </div>
  );
}
