import styles from "./description-section.module.css";

export default function DescriptionSection({ title, children }) {
  return (
    <section className={styles.descriptionSection}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
