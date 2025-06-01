"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import Badge from "./simple-badge";

export default function SeparateBadge({ getCount, type = "", children }) {
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

  return <Badge count={count}>{children}</Badge>;
}
