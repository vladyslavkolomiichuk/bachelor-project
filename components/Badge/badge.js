"use client";

import { useEffect, useState } from "react";
import styles from "./badge.module.css";

export default function Badge({ userId, getCount, type, children }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function load() {
      const result = await getCount(userId);
      setCount(result);
    }

    load();

    const handler = () => {
      load();
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
