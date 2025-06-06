import shimmerStyles from "../shimmer.module.css";
import styles from "./note-book-skeleton.module.css";

export default function NoteBlockSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.mainInfo}>
        <div className={`${styles.info} ${shimmerStyles.shimmer}`}></div>
        <div className={`${styles.info} ${shimmerStyles.shimmer}`}></div>
        <div className={`${styles.info} ${shimmerStyles.shimmer}`}></div>
      </div>
      <div className={styles.secondInfo}>
        <div className={`${styles.info} ${shimmerStyles.shimmer}`}></div>
        <div className={`${styles.info} ${shimmerStyles.shimmer}`}></div>
        <div className={`${styles.info} ${shimmerStyles.shimmer}`}></div>
      </div>
    </div>
  );
}
