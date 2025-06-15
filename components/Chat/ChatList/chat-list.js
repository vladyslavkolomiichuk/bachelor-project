"use client";

import { useState } from "react";
import styles from "./chat-list.module.css";
import { MessageSquareText, Plus } from "lucide-react";
import ChatItem from "../ChatItem/chat-item";
import Loader from "@/components/GeneralComponents/SearchComponents/Loader/loader";

export default function ChatList({
  chats,
  activeChatId,
  userId,
  onSelect,
  onDelete,
  onCreate,
  loading,
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

      {!loading ? (
        <div className={styles.chatsList}>
          {[...chats]
            .sort((a, b) => {
              const aTime = new Date(a.last_message_time).getTime();
              const bTime = new Date(b.last_message_time).getTime();
              return bTime - aTime;
            })
            .map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                userId={userId}
                onDelete={onDelete}
                onSelect={onSelect}
                activeChatId={activeChatId}
              />
            ))}
        </div>
      ) : (
        <Loader />
      )}

      {chats.length === 0 && !loading && (
        <p className={styles.noItem}>
          You don't have any chats, create your own.
        </p>
      )}
    </div>
  );
}
