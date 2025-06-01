"use client";

import { useEffect, useState } from "react";
import ChallengeBlock from "../ChallengeBlock/challenge-block";
import NewChallengeBtn from "../NewChallengeBtn/new-challenge-btn";
import ChallengeForm from "@/components/FormComponents/ChallengeForm/challenge-form";
import ChallengeFormSmall from "@/components/FormComponents/ChallengeForm/challenge-form-small";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "nextjs13-progress";
import { getChallengesByUser } from "@/lib/db/challenge";

import styles from "./challenges.module.css";

export default function ChallengesList() {
  const [newFormOpen, setNewFormOpen] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [smallFormOpen, setSmallFormOpen] = useState(false);
  const [smallFormChallenge, setSmallFormChallenge] = useState(null);

  const router = useRouter();

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      const userChallenges = await getChallengesByUser(userId);
      setChallenges(userChallenges);
    };
    fetchData();
  }, [userId]);

  const newChallengeActions = [
    {
      label: "Book challenge",
      onClick: () => {
        setSmallFormOpen(true);
        setSmallFormChallenge("book");
      },
    },
    {
      label: "Page challenge",
      onClick: () => {
        setSmallFormOpen(true);
        setSmallFormChallenge("page");
      },
    },
    {
      label: "Hour challenge",
      onClick: () => {
        setSmallFormOpen(true);
        setSmallFormChallenge("hour");
      },
    },
    { label: "Own challenge", onClick: () => setNewFormOpen(true) },
  ];

  const groupedChallenges = {
    active: challenges.filter((c) => c.status === "in-progress"),
    completed: challenges.filter((c) => c.status === "completed"),
    upcoming: challenges.filter((c) => c.status === "upcoming"),
    failed: challenges.filter((c) => c.status === "failed"),
  };

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    for (const key of Object.keys(groupedChallenges)) {
      initial[key] = true;
    }
    return initial;
  });

  const toggleGroup = (status) => {
    setOpenGroups((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.challengesContainer}>
        {Object.entries(groupedChallenges).map(([status, group]) => (
          <div key={status} className={styles.challengeGroup}>
            <div
              className={styles.groupTitle}
              onClick={() => toggleGroup(status)}
            >
              <h2>
                {status.charAt(0).toUpperCase() + status.slice(1)} Challenges{" "}
                <span>{group.length > 0 ? `(${group.length})` : ""}</span>
              </h2>

              {group.length > 0 ? (
                openGroups[status] ? (
                  <ChevronDown />
                ) : (
                  <ChevronUp />
                )
              ) : (
                ""
              )}
            </div>

            {openGroups[status] &&
              (group.length > 0 ? (
                group.map((challenge) => (
                  <ChallengeBlock key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <p className={styles.noItems}>No {status} challenges yet.</p>
              ))}
          </div>
        ))}
      </div>

      <NewChallengeBtn actions={newChallengeActions} />

      <ChallengeForm
        isOpen={newFormOpen}
        onCancel={() => setNewFormOpen(false)}
        onDone={() => {
          setNewFormOpen(false);
          window.dispatchEvent(new Event("challenges:updated"));
        }}
      />
      <ChallengeFormSmall
        isOpen={smallFormOpen}
        onCancel={() => {
          setSmallFormOpen(false);
          setSmallFormChallenge(null);
        }}
        onDone={() => {
          setSmallFormOpen(false);
          setSmallFormChallenge(null);
          window.dispatchEvent(new Event("challenges:updated"));
        }}
        challenge={smallFormChallenge}
      />
    </div>
  );
}
