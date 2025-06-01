"use client";

import useDailyChallengeToasts from "@/hooks/useDailyChallengeToasts";
import { useVisitToasts } from "@/hooks/useVisitToast";

export default function Notifier() {
  useDailyChallengeToasts();
  useVisitToasts();
  return null;
}
