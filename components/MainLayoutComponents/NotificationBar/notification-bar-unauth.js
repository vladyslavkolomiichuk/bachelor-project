import { redirect } from "next/navigation";
import { UserRoundX } from "lucide-react";
import { Bell } from "lucide-react";
import { Flame } from "lucide-react";

import styles from "./notification-bar.module.css";

export default function NotificationBarUnauth() {
  const handleClickLogin = () => {
    redirect("/login");
  };

  const handleClickSignup = () => {
    redirect("/signup");
  };

  return (
    <div className={styles.notificationBar}>
      <button type="button" className={styles.button} disabled={true}>
        <UserRoundX strokeWidth={3} />
      </button>

      <div className={styles.authActions}>
        <p onClick={handleClickLogin} className={styles.authBtn}>
          Log In
        </p>
        <p>/</p>
        <p onClick={handleClickSignup} className={styles.authBtn}>
          Sign Up
        </p>
      </div>

      <button type="button" className={styles.button}>
        <Bell strokeWidth={3} />
      </button>

      <button type="button" className={styles.button}>
        <div className={styles.flameWrapper}>
          <Flame strokeWidth={3} />
        </div>
      </button>
    </div>
  );
}
