"use client";

import { createContext, useState, useContext, useEffect } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    // saveTimerData();
  };

  // const saveTimerData = async () => {
  //   // const response = await fetch('/api/saveTimer', {
  //   //   method: 'POST',
  //   //   body: JSON.stringify({ time: timer }),
  //   //   headers: {
  //   //     'Content-Type': 'application/json',
  //   //   },
  //   // });
  //   // const data = await response.json();
  //   console.log("Timer data saved:", timer);
  // };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <TimerContext.Provider value={{ timer, isRunning, startTimer, pauseTimer, stopTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  return useContext(TimerContext);
};
