import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface AlarmContextType {
  alarmTime: string | null;
  setAlarmTime: (time: string | null) => void;
  isAlarmActive: boolean;
  isRinging: boolean;
  stopAlarm: () => void;
  solvePuzzle: () => void;
  isPuzzleSolved: boolean;
  earlySolve: () => void;
  triggerNotification: (title: string, body: string) => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alarmTime, setAlarmTimeState] = useState<string | null>(localStorage.getItem("warrior_alarm_time"));
  const [isAlarmActive, setIsAlarmActive] = useState(localStorage.getItem("warrior_alarm_active") === "true");
  const [isRinging, setIsRinging] = useState(false);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [hasNotified15, setHasNotified15] = useState(false);
  const [hasNotifiedMissed, setHasNotifiedMissed] = useState(false);
  const [hasNotifiedStreak, setHasNotifiedStreak] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ringStartTime = useRef<number | null>(null);

  const setAlarmTime = (time: string | null) => {
    setAlarmTimeState(time);
    if (time) {
      localStorage.setItem("warrior_alarm_time", time);
      localStorage.setItem("warrior_alarm_active", "true");
      setIsAlarmActive(true);
      setHasNotified15(false);
      setHasNotifiedMissed(false);
      setIsPuzzleSolved(false);
    } else {
      localStorage.removeItem("warrior_alarm_time");
      localStorage.setItem("warrior_alarm_active", "false");
      setIsAlarmActive(false);
    }
  };

  const stopAlarm = () => {
    if (isPuzzleSolved) {
      setIsRinging(false);
      setIsAlarmActive(false);
      localStorage.setItem("warrior_alarm_active", "false");
      ringStartTime.current = null;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const solvePuzzle = () => {
    setIsPuzzleSolved(true);
  };

  const earlySolve = () => {
    setIsPuzzleSolved(true);
    setIsAlarmActive(false);
    localStorage.setItem("warrior_alarm_active", "false");
  };

  const triggerNotification = (title: string, body: string) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/favicon.ico" });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(title, { body, icon: "/favicon.ico" });
          }
        });
      }
    }
    console.log(`NOTIFICATION: ${title} - ${body}`);
  };

  useEffect(() => {
    const checkAlarm = () => {
      const now = new Date();
      
      // Daily Streak Notification (e.g., at 10:00 AM if not checked in)
      if (now.getHours() === 10 && now.getMinutes() === 0 && !hasNotifiedStreak) {
        triggerNotification("Maintain Your Streak!", "Don't let your fire go out. Log your morning rituals now.");
        setHasNotifiedStreak(true);
      }
      // Reset streak notification flag at midnight
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setHasNotifiedStreak(false);
      }

      if (!isAlarmActive || !alarmTime) return;

      const [hours, minutes] = alarmTime.split(":").map(Number);
      const alarmDate = new Date();
      alarmDate.setHours(hours, minutes, 0, 0);

      if (alarmDate.getTime() < now.getTime() - 1000 * 60 * 60) { // More than 1 hour ago
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      const diffMs = alarmDate.getTime() - now.getTime();
      const diffMins = diffMs / (1000 * 60);

      // 15 minute notification
      if (diffMins <= 15 && diffMins > 14 && !hasNotified15) {
        triggerNotification("The Battle Approaches", "Your morning ritual begins in 15 minutes. Prepare yourself, Warrior.");
        setHasNotified15(true);
      }

      // Trigger Alarm
      if (diffMs <= 0 && !isRinging && !isPuzzleSolved) {
        setIsRinging(true);
        ringStartTime.current = Date.now();
        playAlarmSound();
      }

      // Missed Alarm Warning (if ringing for more than 5 minutes)
      if (isRinging && ringStartTime.current && !hasNotifiedMissed) {
        const ringDuration = (Date.now() - ringStartTime.current) / (1000 * 60);
        if (ringDuration >= 5) {
          triggerNotification("ALARM MISSED!", "You have failed to answer the call. Your honor is at stake!");
          setHasNotifiedMissed(true);
        }
      }
    };

    const interval = setInterval(checkAlarm, 1000);
    return () => clearInterval(interval);
  }, [isAlarmActive, alarmTime, isRinging, isPuzzleSolved, hasNotified15, hasNotifiedMissed, hasNotifiedStreak]);

  const playAlarmSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3");
      audioRef.current.loop = true;
      audioRef.current.onerror = (e) => console.error("Alarm audio error:", e);
    }
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => console.warn("Alarm audio play failed (interaction required):", e));
    }
  };

  return (
    <AlarmContext.Provider value={{ alarmTime, setAlarmTime, isAlarmActive, isRinging, stopAlarm, solvePuzzle, isPuzzleSolved, earlySolve, triggerNotification }}>
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error("useAlarm must be used within an AlarmProvider");
  }
  return context;
};
