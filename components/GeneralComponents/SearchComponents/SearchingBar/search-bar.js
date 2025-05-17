"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import SearchSmallBookItem from "../SearchSmallBookItem/search-small-book-item";
import Loader from "../Loader/loader";
import DropdownMenu from "../DropdownMenu/dropdown-menu";

import styles from "./search-bar.module.css";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearchOnChange = async (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (!value) {
      searchResults(null);
    }
    if (timer) {
      clearTimeout(timer);
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
        } catch {}
      }, 1000)
    );
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      inputRef.current &&
      !inputRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    } else setIsOpen(true);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.searchWrapper} ref={inputRef}>
      <form className={styles.searchBox}>
        <button
          className={styles.searchButton}
          type="submit"
          onFocus={() => setIsOpen(true)}
        >
          <Search strokeWidth={3} />
        </button>
        <input
          type="text"
          className={`${styles.searchInput} ${isOpen ? styles.open : ""}`}
          placeholder="Search book by name..."
          value={searchQuery}
          onChange={handleSearchOnChange}
          onFocus={() => setIsOpen(true)}
        />
      </form>

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
