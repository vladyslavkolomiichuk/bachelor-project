import { Check, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useConfirm } from "@/context/ConfirmContext";
import { useEffect, useState } from "react";
import ChallengeForm from "@/components/FormComponents/ChallengeForm/challenge-form";
import ChallengeEndDateForm from "@/components/FormComponents/ChallengeForm/challenge-end-date-form";
import { useToast } from "@/context/ToastContext";

import styles from "./challenge-block.module.css";

export default function ChallengeBlock({ initChallenge, resetChallenges }) {
  // const {
  //   id,
  //   message,
  //   start_date: startDate,
  //   end_date: endDate,
  //   status,
  //   category,
  // } = challenge;
  const [challenge, setChallenge] = useState(null);
  const [editFormOpen, setEditFormOpen] = useState();
  const [resetFormOpen, setResetFormOpen] = useState();

  const confirm = useConfirm();
  const { showToast } = useToast();

  useEffect(() => {
    if (initChallenge) {
      setChallenge(initChallenge);
    }
  }, [initChallenge]);

  const handleComplete = async () => {
    const prevChallenge = challenge;
    resetChallenges((prev) =>
      prev.map((c) =>
        c.id === challenge?.id ? { ...c, status: "completed" } : c
      )
    );

    const challengeId = challenge?.id;

    const res = await fetch("/api/challenges/complete", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: challengeId }),
    });

    if (res.ok) {
      window.dispatchEvent(new Event("challenges:updated"));
    } else {
      resetChallenges((prev) =>
        prev.map((c) => (c.id === prevChallenge.id ? prevChallenge : c))
      );
      showToast("Failed to mark challenge as completed", "error");
      console.error("Failed to mark challenge as completed");
    }
  };

  const handleEdit = () => {
    setEditFormOpen(true);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "You're about to delete this challenge from your list",
      message: "This action will remove the challenge from your list.",
      buttonName: "Delete",
    });
    if (!confirmed) return;

    const prevChallenge = challenge;
    resetChallenges((prev) => prev.filter((c) => c.id !== challenge?.id));

    const challengeId = challenge?.id;

    const res = await fetch("/api/challenges/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: challengeId }),
    });

    if (res.ok) {
      window.dispatchEvent(new Event("challenges:updated"));
    } else {
      resetChallenges((prev) => [...prev, prevChallenge]);
      showToast("Failed to delete challenge", "error");
      console.error("Failed to delete challenge");
    }
  };

  const handleRestart = () => {
    setResetFormOpen(true);
  };

  const renderActions = () => {
    if (challenge?.status === "in-progress") {
      return (
        <>
          <button
            className={styles.actionButton}
            onClick={handleComplete}
            title="Mark as completed"
          >
            <Check />
          </button>
          <button
            className={styles.actionButton}
            onClick={handleEdit}
            title="Edit"
          >
            <Pencil />
          </button>
          <button
            className={styles.actionButton}
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 />
          </button>
        </>
      );
    }

    if (challenge?.status === "completed" || challenge?.status === "failed") {
      return (
        <>
          <button
            className={styles.actionButton}
            onClick={handleRestart}
            title="Restart"
          >
            <RotateCcw />
          </button>
          <button
            className={styles.actionButton}
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 />
          </button>
        </>
      );
    }

    if (challenge?.status === "upcoming") {
      return (
        <>
          <button
            className={styles.actionButton}
            onClick={handleEdit}
            title="Edit"
          >
            <Pencil />
          </button>
          <button
            className={styles.actionButton}
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 />
          </button>
        </>
      );
    }

    return null;
  };

  function formatDateForInput(dateInput) {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className={`${styles.challengeBlock} ${styles[challenge?.status]}`}>
      <div className={styles.info}>
        <p className={styles.message}>{challenge?.message}</p>
        <p className={styles.category}>{challenge?.category}</p>
        <p className={styles.time}>
          {new Date(challenge?.start_date).toLocaleDateString()}
        </p>
        <p className={styles.time}>
          {new Date(challenge?.end_date).toLocaleDateString()}
        </p>
        <p className={styles.status}>{challenge?.status}</p>
      </div>

      <div className={styles.actions}>{renderActions()}</div>

      <ChallengeForm
        isOpen={editFormOpen}
        onCancel={() => setEditFormOpen(false)}
        onDone={(newChallenge) => {
          setEditFormOpen(false);
          if (newChallenge) {
            resetChallenges((prev) =>
              prev.map((c) => (c.id === newChallenge.id ? newChallenge : c))
            );
          }
          window.dispatchEvent(new Event("challenges:updated"));
        }}
        formType="update"
        defaultChallenge={challenge}
      />
      <ChallengeEndDateForm
        isOpen={resetFormOpen}
        onCancel={() => setResetFormOpen(false)}
        onDone={(newChallenge) => {
          setResetFormOpen(false);
          if (newChallenge) {
            resetChallenges((prev) =>
              prev.map((c) => (c.id === newChallenge.id ? newChallenge : c))
            );
          }
          window.dispatchEvent(new Event("challenges:updated"));
        }}
        challengeId={challenge?.id}
        message={challenge?.message}
        startDate={formatDateForInput(new Date())}
        category={challenge?.category}
        defaultEndDate={formatDateForInput(challenge?.endDate)}
      />
    </div>
  );
}
