"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import styles from "./star-rating-input.module.css";

export default function StarRatingInput({ value = 0, onChange }) {
  const [hovered, setHovered] = useState(null);

  const handleClick = (index) => {
    onChange(index + 1);
  };

  return (
    <div className={styles.starContainer}>
      {[0, 1, 2, 3, 4].map((index) => {
        const isFilled = hovered != null ? index <= hovered : index < value;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className={styles.starButton}
          >
            <Star
              className={`${styles.starIcon} ${isFilled ? styles.filled : styles.empty}`}
            />
          </button>
        );
      })}
    </div>
  );
}
