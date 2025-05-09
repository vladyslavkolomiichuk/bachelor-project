import BookPreviewSkeleton from "../BookPreview/book-preview-skeleton";
import styles from "./transparent-book-block-skeleton.module.css";

export default function TransparentBookBlockSkeleton() {
  return (
    <div className={styles.transparentBookBlockSkeleton}>
      <BookPreviewSkeleton />
    </div>
  );
}
