"use client";

import { useDailyChallengeToasts } from "@/hooks/useDailyChallengeToasts";
import { useNotificationToasts } from "@/hooks/useNotificationToast";

export default function Notifier({ userId }) {
  useDailyChallengeToasts(userId);
  useNotificationToasts(userId);
  return null;
}
