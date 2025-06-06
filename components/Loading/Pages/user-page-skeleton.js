import shimmerStyles from "../shimmer.module.css";
import styles from "./user-page-skeleton.module.css";

export function UserImagePageSkeleton() {
  return (
    <div className={styles.imageContainer}>
      <div className={`${shimmerStyles.shimmer} ${styles.image}`}></div>
      <div className={`${shimmerStyles.shimmer} ${styles.button}`}></div>
    </div>
  );
}
export function UserInfoPageSkeleton() {
  return (
    <div className={styles.formContainer}>
      <div className={styles.wrapper}>
        <div className={`${shimmerStyles.shimmer} ${styles.input}`}></div>
        <div className={`${shimmerStyles.shimmer} ${styles.input}`}></div>
        <div className={`${shimmerStyles.shimmer} ${styles.input}`}></div>
      </div>

      <div className={`${shimmerStyles.shimmer} ${styles.input}`}></div>
      <div className={`${shimmerStyles.shimmer} ${styles.button}`}></div>
    </div>
  );
}
export function UserPasswordPageSkeleton() {
  return (
    <div className={styles.formContainer}>
      <div className={`${shimmerStyles.shimmer} ${styles.input}`}></div>
      <div className={`${shimmerStyles.shimmer} ${styles.input}`}></div>
      <div className={`${shimmerStyles.shimmer} ${styles.button}`}></div>
    </div>
  );
}
