"use client";

import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";

export function useDailyChallengeToasts(userId) {
  const { showToast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0];
    const lastShown = localStorage.getItem("lastChallengeToast");

    if (lastShown === today) return;

    async function handleShowChallenges() {
      try {
        const res = await fetch("/api/challenges/toast-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error("Toast data fetch failed");

        const { failed, inProgress } = await res.json();

        if (inProgress.length > 0) {
          const msg = inProgress.map((c) => `- ${c.message}`).join("\n");
          showToast(`Active challenges for today:\n${msg}`, "info");
        }

        if (failed.length > 0) {
          const msg = failed.map((c) => `- ${c.message}`).join("\n");
          showToast(`Failed challenges:\n${msg}`, "error");
        }

        localStorage.setItem("lastChallengeToast", today);
        window.dispatchEvent(new Event("challenges:updated"));
      } catch (err) {
        console.error("Failed to fetch challenge toast data:", err);
      }
    }

    handleShowChallenges();

    const interval = setInterval(handleShowChallenges, 2 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userId, showToast]);
}
