"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./chat-window.module.css";
import ChatUsers from "../ChatUsers/chat-users";
import { Send } from "lucide-react";
import Image from "next/image";
import { getUserBooks } from "@/lib/db/book";
import BookLink from "@/components/GeneralComponents/BookLink/book-link";

export default function ChatWindow({
  chat,
  messages,
  userId,
  onSendMessage,
  onAddUser,
}) {
  const [messageText, setMessageText] = useState("");
  const messageEndRef = useRef(null);

  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      const booksRes = await getUserBooks(userId);
      const filteredBooks = booksRes.filter(
        (book) => book.person_share_id === null
      );
      setBooks(filteredBooks);
    };

    fetchData();
  }, [userId]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    onSendMessage({
      text: messageText.trim(),
      bookId: selectedBookId,
    });

    setMessageText("");
    setSelectedBookId(null);
  };

  if (!chat) return;

  return (
    <div className={styles.container}>
      <div className={styles.chatTitleContainer}>
        <h3 className={styles.title}>{chat.name}</h3>
        <div className={styles.together}>
          <ChatUsers chatId={chat.id} onAddUser={onAddUser} />
        </div>
      </div>

      <div className={styles.messagesWrapper}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageInfo} ${
              msg.sender_id === userId
                ? styles.messageUserInfo
                : styles.messageSenderInfo
            }`}
          >
            {msg.sender_id !== userId && (
              <Image
                src={msg.image}
                alt={msg.username}
                width={35}
                height={35}
                className={styles.avatar}
              />
            )}
            <div className={styles.messageContainer}>
              <p
                className={styles.username}
                style={{
                  textAlign: msg.sender_id !== userId ? "left" : "right",
                }}
              >
                {msg.username}
              </p>

              {msg.book_isbn13 && msg.book_title && msg.book_image && (
                <BookLink
                  href={`/book/${msg.book_isbn13}`}
                  style={styles.bookItem}
                >
                  <div className={styles.bookAttachment}>
                    <Image
                      src={msg.book_image}
                      alt={msg.book_title}
                      width={60}
                      height={90}
                      className={styles.bookImage}
                    />
                    <p className={styles.bookTitle}>{msg.book_title}</p>
                  </div>
                </BookLink>
              )}

              <div
                className={`${styles.message} ${
                  msg.sender_id === userId
                    ? styles.messageUser
                    : styles.messageSender
                }`}
              >
                <p className={styles.text}>{msg.text}</p>

                <p className={styles.date}>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
            </div>

            {msg.sender_id === userId && (
              <Image
                src={msg.image}
                alt={msg.username}
                width={35}
                height={35}
                className={styles.avatar}
              />
            )}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Write a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          className={styles.input}
        />
        <div className={styles.actions}>
          <select
            className={styles.select}
            value={selectedBookId || ""}
            onChange={(e) =>
              setSelectedBookId(e.target.value === "" ? null : e.target.value)
            }
          >
            <option value="">Without book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
          <button onClick={handleSend} className={styles.buttonSend}>
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}
