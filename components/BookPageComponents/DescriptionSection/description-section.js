import styles from "./description-section.module.css";

export default function DescriptionSection({ title, children }) {
  return (
    <section className={styles.descriptionSection}>
      <h3 className={styles.descriptionTitle}>{title}</h3>
      <div className={styles.childItem}>{children}</div>
    </section>
  );
}
