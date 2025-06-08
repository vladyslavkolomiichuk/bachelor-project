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
import { useRouter } from "next/navigation";

let socket;

export default function ChatPage() {
  const result = useUser();
  const [userId, setUserId] = useState(null);

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [chatsLoading, setChatsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const { showToast } = useToast();
  const confirm = useConfirm();

  const router = useRouter();

  useEffect(() => {
    if (result?.user === null) {
      router.push("/login");
    }
  }, [result, router]);

  useEffect(() => {
    if (result?.user) setUserId(result.user.id);
  }, [result]);

  useEffect(() => {
    if (!userId) return;

    socket = io("http://localhost:3002");
    socket.emit("register", userId);

    socket.on("newMessage", (msg) => {
      const isCurrentChat = msg.chat_id === activeChatId;
      const isFromMe = msg.sender_id === userId;

      if (isCurrentChat && !isFromMe) {
        setMessages((prev) => [...prev, msg]);
      }

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === msg.chat_id
            ? {
                ...chat,
                last_message_text: msg.text,
                last_message_time: msg.created_at,
                unread_count:
                  isCurrentChat || isFromMe
                    ? 0
                    : (Number(chat.unread_count) || 0) + 1,
              }
            : chat
        )
      );

      if (!isCurrentChat && !isFromMe) {
        window.dispatchEvent(new Event("chats:updated"));
      }
    });

    socket.on("chatAdded", ({ chat }) => {
      setChats((prev) => [...prev, chat]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, activeChatId]);

  useEffect(() => {
    if (!userId) return;

    fetch("/api/chats")
      .then((res) => res.json())
      .then(setChats)
      .catch(console.error)
      .finally(() => setChatsLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!activeChatId || !userId) {
      setMessages([]);
      return;
    }

    fetch(`/api/chats/${activeChatId}/messages`)
      .then((res) => res.json())
      .then(setMessages)
      .catch(console.error)
      .finally(() => setMessagesLoading(false));

    fetch(`/api/chats/${activeChatId}/read`, {
      method: "POST",
    }).catch(console.error);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, unread_count: 0 } : chat
      )
    );

    window.dispatchEvent(new Event("chats:updated"));
  }, [activeChatId, userId]);

  const createChat = async (name) => {
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const newChat = await res.json();
    setChats((prev) => [...prev, newChat]);
  };

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
    window.dispatchEvent(new Event("chats:updated"));
  };

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
          loading={chatsLoading}
        />

        <ChatWindow
          chat={chats.find((c) => c.id === activeChatId)}
          messages={messages}
          userId={userId}
          onSendMessage={sendMessage}
          loading={messagesLoading}
        />
      </div>
    </Section>
  );
}
