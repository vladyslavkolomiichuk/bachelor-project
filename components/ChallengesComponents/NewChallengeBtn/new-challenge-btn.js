import CircleButton from "@/components/GeneralComponents/CircleButton/circle-button";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import styles from "./new-challenge-btn.module.css";

export default function NewChallengeBtn({ actions }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen((prev) => !prev);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className={styles.newChallengeButton} ref={menuRef}>
      <CircleButton
        buttonType="button"
        colorType="success"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <Plus />
      </CircleButton>

      {isMenuOpen && (
        <div className={styles.menu}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={styles.menuItem}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
