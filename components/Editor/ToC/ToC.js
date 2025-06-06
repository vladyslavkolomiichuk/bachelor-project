"use client";

import { useEffect, useState } from "react";
import styles from "./ToC.module.css";

export default function ToC({ content }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    // Extract headings from content
    const extractHeadings = () => {
      const doc = new DOMParser().parseFromString(content, "text/html");
      const elements = Array.from(
        doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
      );

      return elements.map((heading) => ({
        id: heading.id,
        text: heading.textContent,
        level: parseInt(heading.tagName.substring(1)),
      }));
    };

    setHeadings(extractHeadings());
  }, [content]);

  return (
    <nav className={styles.tocContainer}>
      <h2 className={styles.tocTitle}>Table of Contents</h2>
      <ul className={styles.tocList}>
        {headings.map((heading, index) => (
          <li
            key={index}
            className={styles.tocItem}
            style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
          >
            {heading.text}
          </li>
        ))}
      </ul>
    </nav>
  );
}
