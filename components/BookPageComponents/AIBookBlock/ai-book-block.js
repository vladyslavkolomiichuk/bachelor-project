"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ai-book-block.module.css";

export default function AIBookBlock({ title, authors, subjects }) {
  const [aiText, setAIText] = useState("");
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchStream = async () => {
      setAIText("");
      setError(null);
      setIsTyping(true);

      try {
        const res = await fetch("/api/ai-book-description", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, authors, subjects }),
        });

        if (!res.ok || !res.body) {
          throw new Error("AI response error.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          for (let i = 0; i < chunk.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 30));
            setAIText((prev) => prev + chunk[i]);
          }
        }
      } catch (err) {
        console.error("AI fetch error:", err);
        setError("Failed to generate description. Please try again later.");
      } finally {
        setIsTyping(false);
      }
    };

    fetchStream();
  }, [title, authors, subjects]);

  return (
    <div className={styles.aiContainer}>
      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          {aiText}
          {isTyping && <span className={styles.blink}>|</span>}
        </>
      )}
    </div>
  );
}
