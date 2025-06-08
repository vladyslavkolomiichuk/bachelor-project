"use client";

import { useState, useEffect } from "react";
import styles from "./add-user-to-chat.module.css";
import { useToast } from "@/context/ToastContext";

export default function AddUserToChat({ chatId, onAddUser }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setError(null);
      try {
        const res = await fetch(
          `/api/user/search?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Failed to get users");
        const users = await res.json();
        setResults(users);
      } catch (e) {
        setError(e.message);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const addUser = async (username) => {
    try {
      const res = await fetch(`/api/chats/${chatId}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const text = await res.text();
        showToast(`Error adding user: ${text}`, "error");
      } else {
        const newChatUser = await res.json();
        showToast(`User ${username} added to chat!`, "success");
        onAddUser((prev) => [...prev, newChatUser]);
        setQuery("");
        setResults([]);
      }
    } catch (e) {
      showToast("Network error", "error");
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
      />

      {error && showToast(error, "error")}

      {results.length > 0 && (
        <ul className={styles.dropdown}>
          {results.map((user) => (
            <li
              key={user.id}
              className={styles.item}
              onClick={() => addUser(user.username)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
