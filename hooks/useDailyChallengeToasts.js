import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import useSWR from "swr";

export default function useDailyChallengeToasts() {
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
    userId ? "/api/challenges/toast-data" : null,
    fetcher,
    {
      refreshInterval: 2 * 60 * 60 * 1000,
      onSuccess(data) {
        if (!data) return;

        const today = new Date();
        const localDate = today.toLocaleDateString();
        const lastShown = localStorage.getItem("lastChallengeToast");

        if (lastShown === localDate) return;

        if (data.inProgress.length > 0) {
          const msg = data.inProgress.map((c) => `- ${c.message}`).join("\n");
          showToast(`Active challenges for today:\n${msg}`, "info");
        }
        if (data.failed.length > 0) {
          const msg = data.failed.map((c) => `- ${c.message}`).join("\n");
          showToast(`Failed challenges:\n${msg}`, "error");
        }
        localStorage.setItem("lastChallengeToast", localDate);
        window.dispatchEvent(new Event("challenges:updated"));
      },
    }
  );
}
