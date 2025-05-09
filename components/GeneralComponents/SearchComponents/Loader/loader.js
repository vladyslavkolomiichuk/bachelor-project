import styles from "./loader.module.css";

export default function Loader() {
  return (
    <div className={styles.loader}>
      <span className={styles.loader__element1}></span>
      <span className={styles.loader__element2}></span>
      <span className={styles.loader__element3}></span>
    </div>
  );
}
