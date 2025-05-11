import styles from "./main-button.module.css";

export default function MainButton({
  onClick = null,
  type = "button",
  children,
  ...props
}) {
  return (
    <button className={styles.button} type={type} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
