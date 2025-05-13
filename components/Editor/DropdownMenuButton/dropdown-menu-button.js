import { useEffect, useRef, useState } from "react";
import styles from "./dropdown-menu-button.module.css";
import { ChevronDown } from "lucide-react";

export default function DropdownMenuButton({
  MainBtn,
  mainBtnStyles,
  children,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleToggleDropdownMenu = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdownMenuContainer}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.mainButton} ${mainBtnStyles}`}
        onClick={handleToggleDropdownMenu}
      >
        {MainBtn}
        <ChevronDown strokeWidth={4}/>
      </button>
      <div
        ref={dropdownRef}
        className={`${styles.dropdownMenu} ${
          isDropdownOpen ? styles.open : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
