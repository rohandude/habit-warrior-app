import React, { createContext, useContext, useState, useEffect } from "react";

export interface Rank {
  name: string;
  minXP: number;
  color: string;
}

export const RANKS: Rank[] = [
  { name: "Novice Recruit", minXP: 0, color: "#888888" },
  { name: "Iron Vanguard", minXP: 500, color: "#a1a1a1" },
  { name: "Steel Sentinel", minXP: 1500, color: "#e2c08d" },
  { name: "Bronze Berserker", minXP: 3500, color: "#cd7f32" },
  { name: "Silver Slayer", minXP: 7500, color: "#c0c0c0" },
  { name: "Golden Gladiator", minXP: 15000, color: "#ffd700" },
  { name: "Mythic Warlord", minXP: 30000, color: "#ff3131" },
];

interface XPContextType {
  xp: number;
  level: number;
  streak: number;
  currentRank: Rank;
  nextRank: Rank | null;
  addXP: (amount: number) => void;
  deductXP: (amount: number) => void;
  progressToNext: number;
  completeTask: (taskId: string, xpAmount: number) => boolean;
  isTaskCompleted: (taskId: string) => boolean;
}

const XPContext = createContext<XPContextType | undefined>(undefined);

export const XPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [xp, setXP] = useState<number>(() => {
    const saved = localStorage.getItem("warrior_xp");
    return saved ? parseInt(saved) : 0;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem("warrior_streak");
    return saved ? parseInt(saved) : 0;
  });

  const [lastCheckIn, setLastCheckIn] = useState<string | null>(() => {
    return localStorage.getItem("warrior_last_checkin");
  });

  const [completedTasks, setCompletedTasks] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("warrior_completed_tasks");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("warrior_xp", xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("warrior_streak", streak.toString());
  }, [streak]);

  useEffect(() => {
    if (lastCheckIn) {
      localStorage.setItem("warrior_last_checkin", lastCheckIn);
    }
  }, [lastCheckIn]);

  useEffect(() => {
    localStorage.setItem("warrior_completed_tasks", JSON.stringify(completedTasks));
  }, [completedTasks]);

  // Streak Logic
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (lastCheckIn !== today) {
      if (lastCheckIn === yesterday) {
        // Streak continues when they check in today
      } else if (lastCheckIn && lastCheckIn < yesterday) {
        // Streak broken
        setStreak(0);
      }
    }
  }, [lastCheckIn]);

  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
  };

  const deductXP = (amount: number) => {
    setXP(prev => Math.max(0, prev - amount));
  };

  const isTaskCompleted = (taskId: string) => {
    const today = new Date().toISOString().split("T")[0];
    return completedTasks[taskId] === today;
  };

  const completeTask = (taskId: string, xpAmount: number) => {
    if (isTaskCompleted(taskId)) return false;

    const today = new Date().toISOString().split("T")[0];
    
    // Update streak on first task of the day
    if (lastCheckIn !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (lastCheckIn === yesterday) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(1);
      }
      setLastCheckIn(today);
    }

    setCompletedTasks(prev => ({ ...prev, [taskId]: today }));
    addXP(xpAmount);
    return true;
  };

  const currentRankIndex = [...RANKS].reverse().findIndex(r => xp >= r.minXP);
  const currentRank = RANKS[RANKS.length - 1 - currentRankIndex] || RANKS[0];
  const nextRank = RANKS[RANKS.length - currentRankIndex] || null;
  
  const level = Math.floor(Math.sqrt(xp / 10)) + 1;

  let progressToNext = 100;
  if (nextRank) {
    const range = nextRank.minXP - currentRank.minXP;
    const currentProgress = xp - currentRank.minXP;
    progressToNext = Math.min(100, (currentProgress / range) * 100);
  }

  return (
    <XPContext.Provider value={{ 
      xp, level, streak, currentRank, nextRank, addXP, deductXP, progressToNext, 
      completeTask, isTaskCompleted 
    }}>
      {children}
    </XPContext.Provider>
  );
};

export const useXP = () => {
  const context = useContext(XPContext);
  if (context === undefined) {
    throw new Error("useXP must be used within an XPProvider");
  }
  return context;
};
