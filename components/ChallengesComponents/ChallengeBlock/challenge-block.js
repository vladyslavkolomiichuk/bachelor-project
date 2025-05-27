import { Check, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useConfirm } from "@/context/ConfirmContext";
import { useState } from "react";
import styles from "./challenge-block.module.css";
import ChallengeForm from "@/components/FormComponents/ChallengeForm/challenge-form";
import { redirect, useRouter } from "next/navigation";
import ChallengeEndDateForm from "@/components/FormComponents/ChallengeForm/challenge-end-date-form";

export default function ChallengeBlock({ challenge }) {
  const {
    id,
    message,
    start_date: startDate,
    end_date: endDate,
    status,
    category,
  } = challenge;
  const [editFormOpen, setEditFormOpen] = useState();
  const [resetFormOpen, setResetFormOpen] = useState();

  const router = useRouter();

  const confirm = useConfirm();

  const handleComplete = async () => {
    const res = await fetch("/api/challenges/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });

    if (res.ok) {
      window.dispatchEvent(new Event("challenges:updated"));
      router.push("/challenges");
    } else {
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

    const res = await fetch("/api/challenges/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });

    if (res.ok) {
      window.dispatchEvent(new Event("challenges:updated"));
      router.push("/challenges");
    } else {
      console.error("Failed to delete challenge");
    }
  };

  const handleRestart = () => {
    setResetFormOpen(true);
  };

  const renderActions = () => {
    if (status === "in-progress") {
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

    if (status === "completed" || status === "failed") {
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

    if (status === "upcoming") {
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
    <div className={`${styles.challengeBlock} ${styles[status]}`}>
      <div className={styles.info}>
        <p className={styles.message}>{message}</p>
        <p className={styles.category}>{category}</p>
        <p className={styles.time}>
          {new Date(startDate).toLocaleDateString()}
        </p>
        <p className={styles.time}>{new Date(endDate).toLocaleDateString()}</p>
        <p className={styles.status}>{status}</p>
      </div>

      <div className={styles.actions}>{renderActions()}</div>

      <ChallengeForm
        isOpen={editFormOpen}
        onCancel={() => setEditFormOpen(false)}
        onDone={() => {
          setEditFormOpen(false);
          window.dispatchEvent(new Event("challenges:updated"));
        }}
        formType="update"
        challengeId={id}
        defaultMessage={message}
        defaultStartDate={formatDateForInput(startDate)}
        defaultEndDate={formatDateForInput(endDate)}
      />
      <ChallengeEndDateForm
        isOpen={resetFormOpen}
        onCancel={() => setResetFormOpen(false)}
        onDone={() => {
          setResetFormOpen(false);
          window.dispatchEvent(new Event("challenges:updated"));
        }}
        formType="update"
        challengeId={id}
        message={message}
        startDate={formatDateForInput(startDate)}
        category={category}
        defaultEndDate={formatDateForInput(endDate)}
      />
    </div>
  );
}
