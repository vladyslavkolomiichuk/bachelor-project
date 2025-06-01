"use client";

import texts from "@/data/texts.json";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/context/ToastContext";

import styles from "./user-test.module.css";
import { saveTestResult } from "@/lib/db/test";
import { useRouter } from "nextjs13-progress";
import { useUser } from "@/context/UserContext";

export default function UserTest() {
  const [phase, setPhase] = useState("blurred"); // "blurred", "reading", "questions"
  const [selected, setSelected] = useState(1);

  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: selectedAnswer }
  const [score, setScore] = useState(null);
  const [timeReading, setTimeReading] = useState(0);

  const timerRef = useRef(null);

  const { showToast } = useToast();

  const router = useRouter();

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * texts.length);
    setSelected(randomIndex);
    setPhase("blurred");
  }, []);

  useEffect(() => {
    if (phase === "reading") {
      timerRef.current = setInterval(() => {
        setTimeReading((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleBegin = () => {
    setPhase("reading");
    setUserAnswers({});
    setScore(null);
    setTimeReading(0);
  };

  const handleStop = () => {
    setPhase("questions");
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleFinish = async () => {
    const questions = texts[selected].questions;
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] && userAnswers[index] === q.trueAnswer) {
        correctCount++;
      }
    });

    const wpm = Math.round(
      (texts[selected].content.split(" ").length / timeReading) * 60
    );
    const comprehension = Math.round((correctCount / questions.length) * 100);

    setScore(correctCount);
    setPhase("finished");

    try {
      await saveTestResult(userId, wpm, comprehension, timeReading);
    } catch (error) {
      showToast(`Error saving test result. Try again later.`, "error");
    }
  };

  return (
    <main className={styles.container}>
      {(phase === "blurred" || phase === "reading") && (
        <>
          <div className={styles.description}>
            The standard way to measure your reading speed is words per minute
            (WPM). It is calculated by measuring the time you spend reading a
            text (in minutes) and dividing this value by the number of words in
            the text.
            <br />
            <br />
            You can measure this value yourself using a stopwatch, but it’s
            easier to use this free tool we prepared for you.
            <br />
            <br />
            <span style={{ fontWeight: 700 }}>How to use this test?</span>
            <br />
            <ol>
              <li>Take a few deep breaths to better focus.</li>
              <li>Press the Start button.</li>
              <li> Read the entire text.</li>
              <li> Press the “Finish Reading” button.</li>
              <li>Answer a few questions about the text.</li>
              <li>
                Review your speed results in WPM and your comprehension
                percentage.
              </li>
            </ol>
          </div>
          {/* <p className={styles.description}>Timer: {timeReading} s.</p> */}
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.button}
              onClick={handleBegin}
              disabled={phase !== "blurred" && phase !== "finished"}
            >
              Start
            </button>
          </div>
          <div
            className={`${styles.textBox} ${
              phase === "blurred" ? styles.blurred : ""
            }`}
          >
            {texts[selected].content}
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.button}
              onClick={handleStop}
              disabled={phase !== "reading"}
            >
              Stop
            </button>
          </div>
        </>
      )}

      {phase === "questions" && (
        <>
          {/* <p className={styles.description}>Description</p> */}
          <h2>Test your reading comprehension</h2>
          {texts[selected].questions.map((q, index) => (
            <div key={index} className={styles.questionBlock}>
              <p className={styles.questionText}>
                {index + 1}. {q.question}
              </p>
              <ul className={styles.answersList}>
                {q.answers.map((answer, idx) => (
                  <li key={idx} className={styles.answerItem}>
                    <label className={styles.answerLabel}>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={answer}
                        checked={userAnswers[index] === answer}
                        disabled={phase === "finished"}
                        onChange={() => handleAnswerSelect(index, answer)}
                      />
                      {answer}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              onClick={handleFinish}
              disabled={
                Object.keys(userAnswers).length !==
                texts[selected].questions.length
              }
            >
              Check
            </button>
          </div>
        </>
      )}

      {phase === "finished" &&
        (() => {
          const wpm = Math.round(
            (texts[selected].content.split(" ").length / timeReading) * 60
          );
          const comprehension = Math.round(
            (score / texts[selected].questions.length) * 100
          );

          let speedCategory = "";
          if (wpm < 150) speedCategory = "slow";
          else if (wpm < 250) speedCategory = "average";
          else if (wpm < 400) speedCategory = "fast";
          else speedCategory = "speed";

          const tips = {
            slow: "Take your time — but consider practicing to improve your reading pace.",
            average:
              "You're doing great! You balance speed and understanding well.",
            fast: "Impressive speed! Just ensure comprehension stays high.",
            speed:
              "You're a speed reader! Perfect for scanning large texts quickly.",
          };

          return (
            <>
              <h2>Current Test Results</h2>

              <div className={styles.resultBlocks}>
                <div className={styles.blockLeft}>
                  <div className={styles.resultItem}>
                    <p>Reading speed:</p>
                    <div className={styles.resultValue}>{wpm}</div>
                    <p>Words per Minute (WPM)</p>
                  </div>

                  <h2 className={styles.blockHeading}>
                    How your reading speed compares
                  </h2>

                  <table className={styles.speedTable}>
                    <tbody>
                      <tr
                        className={
                          speedCategory === "slow" ? styles.activeRow : ""
                        }
                      >
                        <td>Slow</td>
                        <td>150 WPM</td>
                      </tr>
                      <tr
                        className={
                          speedCategory === "average" ? styles.activeRow : ""
                        }
                      >
                        <td>Average</td>
                        <td>250 WPM</td>
                      </tr>
                      <tr
                        className={
                          speedCategory === "fast" ? styles.activeRow : ""
                        }
                      >
                        <td>Fast</td>
                        <td>400 WPM</td>
                      </tr>
                      <tr
                        className={
                          speedCategory === "speed" ? styles.activeRow : ""
                        }
                      >
                        <td>Speed reader</td>
                        <td>600 WPM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={styles.blockRight}>
                  <div className={styles.resultItem}>
                    <p>Comprehension:</p>
                    <div className={styles.resultValue}>{comprehension}%</div>
                    <p>of questions answered correctly</p>
                  </div>

                  <div className={styles.speedDescription}>
                    <p className={styles.tip}>{tips[speedCategory]}</p>
                  </div>
                </div>
              </div>

              <p className={styles.footer}>
                A skilled reader is someone who is able to read slowly or
                quickly, depending on their goals for the reading, while at the
                same time maintaining a good understanding/comprehension of what
                they read.
              </p>
            </>
          );
        })()}
    </main>
  );
}
