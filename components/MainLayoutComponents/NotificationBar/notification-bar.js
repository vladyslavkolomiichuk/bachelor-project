import styles from "./notification-bar.module.css";

import { UserRoundX } from "lucide-react";
import { UserRoundCheck } from "lucide-react";
import { Bell } from "lucide-react";
import { Flame } from "lucide-react";

export default function NotificationBar() {
  return (
    <div className={styles.notificationBar}>
      <button type="button" className={styles.button}>
        <UserRoundX strokeWidth={3} />
      </button>
      <p>USER NAME</p>
      <button type="button" className={styles.button}>
        <Bell strokeWidth={3} />
      </button>
      <button type="button" className={styles.button}>
        <Flame strokeWidth={3} />
      </button>
    </div>
  );
}
