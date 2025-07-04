"use client";

import { useEffect, useState } from "react";

import styles from "./chat-users.module.css";
import Image from "next/image";
import AddUserToChat from "../AddUserToChat/add-user-to-chat";
import { Plus } from "lucide-react";

export default function ChatUsers({ chatId }) {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    fetch(`/api/chats/${chatId}/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, [chatId]);

  if (!chatId) return null;

  const visibleUsers = users.slice(0, 5);

  return (
    <div>
      <div className={styles.container}>
        {visibleUsers.map((user) => (
          <Image
            key={user.id}
            src={user.image}
            alt={user.username}
            width={30}
            height={30}
            className={styles.avatar}
          />
        ))}

        <button
          className={styles.moreButton}
          onClick={() => setShowModal(true)}
        >
          <Plus />
        </button>
      </div>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h4>Chat participants</h4>
            <AddUserToChat chatId={chatId} onAddUser={setUsers} />
            <div className={styles.modalList}>
              {users.map((user) => (
                <div key={user.id} className={styles.userItem}>
                  <Image
                    src={user.image}
                    alt={user.username}
                    width={30}
                    height={30}
                    className={styles.avatar}
                  />
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
