import BookPreviewSkeleton from "../BookPreview/book-preview-skeleton";
import styles from "./colored-book-block-skeleton.module.css";

export default function ColoredBookBlockSkeleton() {
  return (
    <div className={styles.coloredBookBlockSkeleton}>
      <BookPreviewSkeleton />
    </div>
  );
}
