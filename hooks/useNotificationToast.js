"use client";

import { useEffect } from "react";
import { useToast } from "@/context/ToastContext";

export function useNotificationToasts(userId) {
  const { showToast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0];
    const lastShown = localStorage.getItem("lastVisitToast");

    if (lastShown === today) return;

    async function handleStreakToast() {
      try {
        const res = await fetch("/api/user/toast-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error("Failed to update streak");

        const { flameScore } = await res.json();

        if (flameScore === 1) {
          showToast("Good start, keep it up! Your visit streak is 1.", "info");
        } else if (flameScore > 1) {
          showToast(
            `Don't stop, you've been visiting for ${flameScore} days in a row!`,
            "info"
          );
        }

        localStorage.setItem("lastVisitToast", today);
        window.dispatchEvent(new Event("notification:updated"));
      } catch (err) {
        console.error("Streak toast failed:", err);
      }
    }

    handleStreakToast();

    const interval = setInterval(handleStreakToast, 2 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userId, showToast]);
}
