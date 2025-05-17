"use client";

import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { UserRoundX } from "lucide-react";
import { UserRoundCheck } from "lucide-react";
import { Bell } from "lucide-react";
import { Flame } from "lucide-react";

import styles from "./notification-bar.module.css";

export default function NotificationBar() {
  const [username, setUsername] = useState(null);
  const [userVisitScore, setUserVisitScore] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/user-info");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setUsername(data.username);
        setUserVisitScore(data.userVisitScore);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();

    const intervalId = setInterval(fetchUserInfo, 2 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (userVisitScore !== null) {
      // Перевіряємо, чи вже показували повідомлення сьогодні
      const lastShownDate = localStorage.getItem("lastShownDate");

      const currentDate = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

      // Якщо дата останнього показу не дорівнює поточній, показуємо повідомлення
      if (lastShownDate !== currentDate) {
        if (userVisitScore === 1) {
          showToast("Good start keep it up! Your visit streak is 1.", "info");
        } else if (userVisitScore > 1) {
          showToast(
            `Don't stop, you've had it for ${userVisitScore} days in a row!`,
            "info"
          );
        }

        // Зберігаємо поточну дату в localStorage після показу повідомлення
        localStorage.setItem("lastShownDate", currentDate);
      }
    }
  }, [userVisitScore, showToast]);

  const handleUserButtonClick = () => {
    redirect(`/user/${username}`);
  };

  return (
    <div className={styles.notificationBar}>
      <button
        type="button"
        className={styles.button}
        onClick={handleUserButtonClick}
      >
        <UserRoundCheck strokeWidth={3} />
      </button>
      <p>{username}</p>
      <button type="button" className={styles.button}>
        <Bell strokeWidth={3} />
      </button>
      <button type="button" className={styles.button}>
        <div className={styles.flameWrapper}>
          <Flame strokeWidth={3} />
          <span className={styles.visitCount}>{userVisitScore}</span>
        </div>
      </button>
    </div>
  );
}
