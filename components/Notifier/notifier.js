"use client";

import useDailyChallengeToasts from "@/hooks/useDailyChallengeToasts";
import { useNotificationToasts } from "@/hooks/useNotificationToast";

export default function Notifier() {
  useDailyChallengeToasts();
  useNotificationToasts();
  return null;
}
