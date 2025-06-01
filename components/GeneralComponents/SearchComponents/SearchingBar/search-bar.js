"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import SearchSmallBookItem from "../SearchSmallBookItem/search-small-book-item";
import Loader from "../Loader/loader";
import DropdownMenu from "../DropdownMenu/dropdown-menu";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs13-progress";

import styles from "./search-bar.module.css";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const [shouldClear, setShouldClear] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (shouldClear && pathname.startsWith("/search")) {
      setSearchQuery("");
      setSearchResults(null);
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
      setShouldClear(false);
    }
  }, [pathname, shouldClear]);

  const router = useRouter();

  const handleSearchOnChange = async (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (!value) {
      setSearchQuery("");
    }
    if (timer) {
      clearTimeout(timer);
    }
    if (value === "") {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    setTimer(
      setTimeout(async () => {
        try {
          const response = await fetch(`/api/search?q=${value}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data.books);
          } else {
            setSearchResults([]);
          }

          setLoading(false);
        } catch {
          setLoading(false);
        }
      }, 1000)
    );
  };

  const handleClickOutside = (event) => {
    const clickedButton = buttonRef.current?.contains(event.target);
    const clickedDropdown = dropdownRef.current?.contains(event.target);
    const clickedInput = inputRef.current?.contains(event.target);

    if (clickedButton && isOpenRef.current) {
      setIsOpen(false);
    } else if (clickedButton || clickedDropdown || clickedInput) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchBox}>
        <button
          ref={buttonRef}
          className={styles.searchButton}
          style={{ transform: "translateY(-50%) translateX(20%)" }}
          type="button"
          onClick={() => {
            if (searchQuery.trim() && isOpen) {
              setShouldClear(true);
              router.push(
                `/search?q=${encodeURIComponent(searchQuery.trim())}`
              );
            }
          }}
        >
          <Search strokeWidth={3} />
        </button>
        <input
          ref={inputRef}
          type="text"
          className={`${styles.searchInput} ${isOpen ? styles.open : ""}`}
          placeholder="Search book by name..."
          value={searchQuery}
          onChange={handleSearchOnChange}
        />
      </div>

      <DropdownMenu isOpen={isOpen} ref={dropdownRef}>
        {loading && (
          <div className={styles.spinnerContainer}>
            <Loader />
          </div>
        )}
        {!loading && !searchResults && <p>Enter your search</p>}
        {!loading && searchResults && searchResults.length === 0 && (
          <p>No results</p>
        )}
        {!loading &&
          searchResults &&
          searchResults.length > 0 &&
          searchResults.map((book) => (
            <SearchSmallBookItem key={book.isbn13} book={book} />
          ))}
      </DropdownMenu>
    </div>
  );
}
