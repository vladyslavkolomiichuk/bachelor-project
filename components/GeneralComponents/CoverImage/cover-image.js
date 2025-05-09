import Image from "next/image";

import styles from "./cover-image.module.css";

import defaultCoverImg from "@/public/default-image.png";
import hardcoverImg from "@/public/hardcover.png";

export default function CoverImage({ coverImg, altText, width, height }) {
  return (
    <div className={styles.coverImage} style={{ minWidth: width, height: height }}>
      <Image
        className={styles.hardcover}
        src={hardcoverImg}
        alt={altText || "Book cover"}
        width={width}
        height={height}
      />
      <Image
        className={styles.image}
        src={coverImg || defaultCoverImg}
        alt={altText || "Book cover"}
        width={width}
        height={height}
      />
    </div>
  );
}
