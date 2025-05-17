import { forwardRef } from "react";
import Section from "../../Section/section";
import SearchSmallBookItem from "../SearchSmallBookItem/search-small-book-item";

import styles from "./dropdown-menu.module.css";

const DropdownMenu = forwardRef(({ isOpen, children }, ref) => {
  return (
    <div
      ref={ref}
      className={`${styles.dropdownMenu} ${isOpen ? styles.open : ""}`}
    >
      {children}
    </div>
  );
});

export default DropdownMenu;
