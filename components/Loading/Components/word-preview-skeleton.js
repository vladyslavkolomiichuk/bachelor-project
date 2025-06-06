import shimmerStyles from "../shimmer.module.css";
import styles from "./word-preview-skeleton.module.css";

export default function WordPreviewSkeleton() {
  return (
    <>
      <td>
        <div className={`${styles.item} ${shimmerStyles.shimmer}`}></div>
      </td>
      <td>
        <div className={`${styles.item} ${shimmerStyles.shimmer}`}></div>
      </td>
      <td>
        <div className={`${styles.item} ${shimmerStyles.shimmer}`}></div>
      </td>
      <td>
        <div className={`${styles.item} ${shimmerStyles.shimmer}`}></div>
      </td>
      <td>
        <div className={`${styles.item} ${shimmerStyles.shimmer}`}></div>
      </td>
    </>
  );
}
