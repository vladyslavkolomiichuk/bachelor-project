"use client";

import { useState } from "react";
import styles from "./chat-list.module.css";
import { MessageSquareText, Plus } from "lucide-react";
import ChatItem from "../ChatItem/chat-item";

export default function ChatList({
  chats,
  activeChatId,
  onSelect,
  onDelete,
  onCreate,
}) {
  const [newChatName, setNewChatName] = useState("");

  const handleCreate = () => {
    if (newChatName.trim()) {
      onCreate(newChatName.trim());
      setNewChatName("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <MessageSquareText />
        <h3 className={styles.title}>Your Chats</h3>
      </div>

      <div className={styles.newChat}>
        <input
          type="text"
          placeholder="New Chat Name"
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          className={styles.input}
        />
        <div
          className={`${styles.buttonWrapper} ${
            newChatName.trim() ? styles.visible : ""
          }`}
        >
          <button onClick={handleCreate} className={styles.buttonCreate}>
            <Plus />
          </button>
        </div>
      </div>

      <div className={styles.chatsList}>
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            onDelete={onDelete}
            onSelect={onSelect}
            activeChatId={activeChatId}
          />
        ))}
      </div>
    </div>
  );
}
