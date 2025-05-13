import { Pause, Play } from "lucide-react";
import styles from "./timer.module.css";

export default function Timer({
  timer,
  isTimerRunning,
  btnStyle,
  onPauseClick,
  onStartClick,
}) {
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <>
      <div className={styles.timerContainer}>
        <span>{formatTime(timer)}</span>
      </div>

      <button
        type="button"
        onClick={onPauseClick}
        className={`${btnStyle} ${styles.pause}`}
        disabled={!isTimerRunning}
      >
        <Pause />
      </button>

      <button
        type="button"
        onClick={onStartClick}
        className={`${btnStyle} ${
          isTimerRunning ? styles.startDisabled : styles.start
        }`}
        disabled={isTimerRunning}
      >
        <Play />
      </button>
    </>
  );
}
