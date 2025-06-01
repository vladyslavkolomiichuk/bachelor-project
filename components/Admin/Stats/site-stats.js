"use client";

import { useEffect, useState } from "react";
import { getSiteStatistics } from "@/lib/db/admin-stats";

import styles from "./site-stats.module.css";

export default function SiteStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchSiteStats = async () => {
      try {
        const dbStats = await getSiteStatistics();
        setStats(dbStats);
      } catch (error) {
        console.error("Fetch stats error:", error);
      }
    };

    fetchSiteStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      subtitle: "All registered users",
    },
    {
      title: "Active (7d)",
      value: stats.activeUsers7d,
      subtitle: "Logged in last 7 days",
    },
    {
      title: "New (30d)",
      value: stats.newUsers30d,
      subtitle: "Registered last 30 days",
    },
    {
      title: "Total Books",
      value: stats.totalBooks,
      subtitle: "Books in catalog",
    },
    {
      title: "Used Books",
      value: stats.uniqueUsedBooks,
      subtitle: "Unique in users' shelves",
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      subtitle: "All reviews",
    },
    {
      title: "Avg Rating",
      value: stats.avgReviewRating,
      subtitle: "Average review score",
    },
    {
      title: "Note Sessions",
      value: stats.totalNoteSessions,
      subtitle: "All note sessions",
    },
    {
      title: "Dictionary Words",
      value: stats.totalDictionaryWords,
      subtitle: "All dictionary entries",
    },
    {
      title: "Tests Taken",
      value: stats.totalTestsTaken,
      subtitle: "Total tests completed",
    },
    {
      title: "Challenges",
      value: stats.totalChallenges,
      subtitle: "All challenges",
    },
  ];

  return (
    <main className={styles.container}>
      <h2 className={styles.header}>Site Statistics</h2>

      <div className={styles.grid}>
        {statCards.map((card, index) => (
          <div key={index} className={styles.card}>
            <h3 className={styles.title}>{card.title}</h3>
            <p className={styles.value}>{card.value}</p>
            <span className={styles.subtitle}>{card.subtitle}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
