import styles from "./buttons-render.module.css";

export default function Buttons({ buttons, btnStyle }) {
  return (
    <>
      {buttons.map((button, index) => (
        <button
          key={index}
          type="button"
          className={`${btnStyle} ${button.pressed ? styles.active : ""}`}
          onClick={button.onClick}
        >
          {button.icon}
        </button>
      ))}
    </>
  );
}
