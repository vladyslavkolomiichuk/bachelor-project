import shimmerStyles from "../shimmer.module.css";
import styles from "./challenge-block-preview-skeleton.module.css";

export default function ChallengeBlockPreviewSkeleton() {
  return (
    <div className={styles.container}>
      <div className={`${styles.item} ${shimmerStyles.shimmer}`} />
    </div>
  );
}
