"use client";

import { useEffect, useState } from "react";
import styles from "./badge.module.css";
import { useUser } from "@/context/UserContext";

export default function Badge({ getCount, type, children }) {
  const [count, setCount] = useState(0);

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      const result = await getCount(userId);
      setCount(result);
    };

    fetchData();

    const handler = () => {
      fetchData();
    };

    window.addEventListener(`${type}:updated`, handler);

    return () => {
      window.removeEventListener(`${type}:updated`, handler);
    };
  }, [userId, getCount, type]);

  return (
    <div className={styles.badgeWrapper}>
      {children}
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </div>
  );
}
