import { forwardRef } from "react";
import styles from "./badge.module.css";

const Badge = forwardRef(function Badge({ count, children }, ref) {
  return (
    <div ref={ref} className={styles.badgeWrapper}>
      {children}
      {count > 0 && <small className={styles.badge}>{count}</small>}
    </div>
  );
});

export default Badge;
