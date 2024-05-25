import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState({});

  const resetTimer = (id, duration) => {
    setTimers(prevTimers => ({
      ...prevTimers,
      [id]: duration
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        Object.keys(newTimers).forEach(key => {
          if (newTimers[key] > 0) {
            newTimers[key] -= 1;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TimerContext.Provider value={{ timers, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};
