import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Badge from "@/components/Badge/simple-badge";
import { Bell } from "lucide-react";
import { useUser } from "@/context/UserContext";
import NotificationItem from "./notification-item";

import generalStyles from "./notification-bar.module.css";
import styles from "./notification-bell.module.css";

let socket;

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();
  const userId = user?.id;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const dropdownRef = useRef();
  const buttonRef = useRef();

  const isOpenRef = useRef();

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const handleClickOutside = (event) => {
    const clickedDropdown = dropdownRef.current?.contains(event.target);
    const clickedButton = buttonRef.current?.contains(event.target);

    if (clickedButton && isOpenRef.current) {
      setIsOpen(false);
    } else if (clickedButton || clickedDropdown) {
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/notifications`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const messages = await response.json();

      const sortedMessages = messages.sort((a, b) => a.is_read - b.is_read);
      setNotifications(sortedMessages);
    };
    fetchData();

    socket = io("http://localhost:3001");
    socket.emit("register", userId);

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, [userId]);

  const markAsRead = async (id) => {
    await fetch(`/api/notifications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const deleteNotification = async (id) => {
    await fetch(`/api/notifications`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className={styles.notificationContainer}>
      <Badge count={unreadCount} ref={buttonRef}>
        <button type="button" className={generalStyles.button} >
          <Bell strokeWidth={3} />
        </button>
      </Badge>

      {isOpen && (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <div className={styles.header}>Notifications</div>
          {notifications.length === 0 ? (
            <div className={styles.noItems}>There are no messages.</div>
          ) : (
            <div className={styles.notificationsWrapper}>
              {notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  deleteNotification={deleteNotification}
                  markAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
