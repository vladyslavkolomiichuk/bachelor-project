"use client";

import useSWR from "swr";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

export function useVisitToasts() {
  const { showToast } = useToast();
  const { user } = useUser();
  const userId = user?.id;

  const fetcher = (url) =>
    fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).then((res) => {
      if (!res.ok) throw new Error("Fetch error");
      return res.json();
    });

  const { data, error } = useSWR(
    userId ? "/api/user/toast-data" : null,
    fetcher,
    {
      refreshInterval: 2 * 60 * 60 * 1000,
      onSuccess(data) {
        if (!data) return;

        const today = new Date();
        const localDate = today.toLocaleDateString();
        const lastShown = localStorage.getItem("lastVisitToast");

        if (lastShown === localDate) return;

        const { flameScore } = data;

        if (flameScore === 1) {
          showToast("Good start, keep it up! Your visit streak is 1.", "info");
        } else if (flameScore > 1) {
          showToast(
            `Don't stop, you've been visiting for ${flameScore} days in a row!`,
            "info"
          );
        }

        localStorage.setItem("lastVisitToast", localDate);
        window.dispatchEvent(new Event("visit:updated"));
      },
    }
  );
}
