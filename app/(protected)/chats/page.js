"use client";

import ChatList from "@/components/Chat/ChatList/chat-list";
import ChatWindow from "@/components/Chat/ChatWindow/chat-window";
import Section from "@/components/GeneralComponents/Section/section";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import styles from "@/components/Chat/chat.module.css";
import { useConfirm } from "@/context/ConfirmContext";

let socket;

export default function ChatPage() {
  const { user } = useUser();
  const [userId, setUserId] = useState(null);

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  const { showToast } = useToast();
  const confirm = useConfirm();

  // Встановлюємо userId при завантаженні користувача
  useEffect(() => {
    if (user) setUserId(user.id);
  }, [user]);

  // Підключення та обробка сокета
  useEffect(() => {
    if (!userId) return;

    socket = io("http://localhost:3002");
    socket.emit("register", userId);

    socket.on("newMessage", (msg) => {
      if (msg.chat_id === activeChatId && msg.sender_id !== userId) {
        setMessages((prev) => [...prev, msg]);
      } else if (msg.sender_id !== userId) {
        // Якщо повідомлення для неактивного чату — оновлюємо last_message і збільшуємо unread_count
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === msg.chat_id
              ? {
                  ...chat,
                  last_message_text: msg.text,
                  last_message_time: msg.created_at,
                  unread_count: (Number(chat.unread_count) || 0) + 1,
                }
              : chat
          )
        );
      } else {
        // Додаємо нове повідомлення у поточний чат
        // Оновлюємо last_message та unread_count (0 — бо відкритий чат)
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  last_message_text: msg.text,
                  last_message_time: msg.created_at,
                  unread_count: 0,
                }
              : chat
          )
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, activeChatId]);

  // Завантаження списку чатів
  useEffect(() => {
    if (!userId) return;

    fetch("/api/chats")
      .then((res) => res.json())
      .then(setChats)
      .catch(console.error);
  }, [userId]);

  // Завантаження повідомлень чату + відмітка прочитаних
  useEffect(() => {
    if (!activeChatId || !userId) {
      setMessages([]);
      return;
    }

    fetch(`/api/chats/${activeChatId}/messages`)
      .then((res) => res.json())
      .then(setMessages)
      .catch(console.error);

    fetch(`/api/chats/${activeChatId}/read`, {
      method: "POST",
    }).catch(console.error);

    // Локально скидаємо лічильник unread
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, unread_count: 0 } : chat
      )
    );
  }, [activeChatId, userId]);

  // Створення нового чату
  const createChat = async (name) => {
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const newChat = await res.json();
    setChats((prev) => [...prev, newChat]);
  };

  // Видалення чату
  const deleteChat = async (chatId) => {
    const confirmed = await confirm({
      title: "You're about to delete this chat",
      message:
        "Deleting a chat will completely delete all messages without recovery.",
      buttonName: "Delete",
    });

    if (!confirmed) return;

    await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
  };

  // Відправка повідомлення з можливістю прикріплення книги
  const sendMessage = ({ text, bookId }) => {
    if (!text || !activeChatId || !userId) return;

    socket.emit(
      "sendMessage",
      { chatId: activeChatId, userId, message: text, bookId },
      (response) => {
        if (response.error) {
          showToast("Failed to send", "error");
        } else {
          setMessages((prev) => [...prev, response.msg]);
        }
      }
    );
  };

  return (
    <Section sectionName="Group Chats">
      <div className={styles.mainContainer}>
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelect={setActiveChatId}
          onDelete={deleteChat}
          onCreate={createChat}
        />

        <ChatWindow
          chat={chats.find((c) => c.id === activeChatId)}
          messages={messages}
          userId={userId}
          onSendMessage={sendMessage}
        />
      </div>
    </Section>
  );
}
