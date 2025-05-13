import styles from "./circle-button.module.css";

export default function CircleButton({
  buttonType = "button",
  colorType = "primary",
  onClick = null,
  children,
  ...props
}) {
  return (
    <button
      className={`${styles.circleButton} ${styles[colorType]}`}
      type={buttonType}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
