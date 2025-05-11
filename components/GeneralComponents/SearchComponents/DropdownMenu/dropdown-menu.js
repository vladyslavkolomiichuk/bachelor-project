import { forwardRef } from "react";
import Section from "../../Section/section";
import styles from "./dropdown-menu.module.css";
import SearchSmallBookItem from "../SearchSmallBookItem/search-small-book-item";

// Використовуємо React.forwardRef, щоб передавати ref до DOM елемента
const DropdownMenu = forwardRef(
  ({ isOpen, books, authors, notes, children }, ref) => {
    return (
      <div
        ref={ref} // Тепер ref передається тут ${isOpen ? styles.open : ""}
        className={`${styles.dropdownMenu} ${isOpen ? styles.open : ""}`}
      >
        <Section sectionName={["Books", "Authors", "Notes"]} multi>
          <div>
            {books && books.map((book) => (
              <SearchSmallBookItem key={book.isbn13} book={book} />
            ))}
          </div>
          <div>{notes}</div>
          <div>{authors}</div>
        </Section>
        {children}
      </div>
    );
  }
);

export default DropdownMenu;
