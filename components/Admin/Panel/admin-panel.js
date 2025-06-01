"use client";

import { useEffect, useState } from "react";
import BookItem from "../BookItem/book-item";
import AdminControls from "../Controls/admin-controls";
import UserItem from "../UserItem/user-item";
import { getAllBooksFromDb, getAllUsersFromDb } from "@/lib/db/admin";

import styles from "./admin-panel.module.css";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  const fetchUsers = async () => {
    try {
      const dbUsers = await getAllUsersFromDb();
      setUsers(dbUsers);
    } catch (error) {
      console.error("Fetch users error:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const dbBooks = await getAllBooksFromDb();
      setBooks(dbBooks);
    } catch (error) {
      console.error("Fetch books error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Data Base Control Panel</h2>

      <div className={styles.controls}>
        <AdminControls type="users" items={users}>
          {(item) => <UserItem user={item} />}
        </AdminControls>

        <AdminControls type="books" items={books}>
          {(item) => <BookItem book={item} />}
        </AdminControls>
      </div>
    </div>
  );
}
