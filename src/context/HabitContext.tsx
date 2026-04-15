import React, { createContext, useContext, useState, useEffect } from "react";

export type HabitType = "simple" | "target";
export type HabitResult = "fail" | "pass" | "excellent";

export interface HabitHistoryEntry {
  completed: boolean;
  achieved?: number;
  result?: HabitResult;
}

export interface Habit {
  id: string;
  text: string;
  completed: boolean;
  days: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  type: HabitType;
  targetValue?: number;
  unit?: string;
  history: Record<string, HabitHistoryEntry>;
  achieved?: number; // Today's achieved value
  result?: HabitResult; // Today's result
}

interface HabitStats {
  completionRate: number;
  weeklyData: { date: string; completed: boolean; result?: HabitResult }[];
}

interface HabitContextType {
  habits: Habit[];
  addHabit: (text: string, days: number[], type: HabitType, targetValue?: number, unit?: string) => void;
  completeHabit: (id: string, achieved?: number) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, text: string, days: number[], type: HabitType, targetValue?: number, unit?: string) => void;
  resetDaily: () => void;
  getTodayHabits: () => Habit[];
  getHabitStats: (id: string) => HabitStats;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const DEFAULT_HABITS: Habit[] = [
  { id: "1", text: "Hydrate: Drink 500ml Water", completed: false, days: [0, 1, 2, 3, 4, 5, 6], type: "simple", history: {} },
  { id: "2", text: "Refresh: Cold Shower / Face Wash", completed: false, days: [0, 1, 2, 3, 4, 5, 6], type: "simple", history: {} },
  { id: "3", text: "Ready: Gear Up & Stretch", completed: false, days: [0, 1, 2, 3, 4, 5, 6], type: "simple", history: {} },
];

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("warrior_habits");
    const lastReset = localStorage.getItem("warrior_habits_reset");
    const today = new Date().toISOString().split("T")[0];

    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all habits have the 'days' and 'history' property (migration)
      const migrated = parsed.map((h: any) => ({
        ...h,
        days: h.days || [0, 1, 2, 3, 4, 5, 6],
        type: h.type || "simple",
        history: h.history || {}
      }));

      if (lastReset !== today) {
        // New day, reset completion and today's values
        return migrated.map((h: Habit) => ({ 
          ...h, 
          completed: false, 
          achieved: undefined, 
          result: undefined 
        }));
      }
      return migrated;
    }
    return DEFAULT_HABITS;
  });

  useEffect(() => {
    localStorage.setItem("warrior_habits", JSON.stringify(habits));
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("warrior_habits_reset", today);
  }, [habits]);

  // Check for midnight reset while app is open
  useEffect(() => {
    const checkReset = () => {
      const lastReset = localStorage.getItem("warrior_habits_reset");
      const today = new Date().toISOString().split("T")[0];
      if (lastReset && lastReset !== today) {
        resetDaily();
        localStorage.setItem("warrior_habits_reset", today);
      }
    };

    const interval = setInterval(checkReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const addHabit = (text: string, days: number[], type: HabitType, targetValue?: number, unit?: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      text,
      completed: false,
      days: days.length > 0 ? days : [0, 1, 2, 3, 4, 5, 6],
      type,
      targetValue,
      unit,
      history: {},
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const completeHabit = (id: string, achieved?: number) => {
    const today = new Date().toISOString().split("T")[0];
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        let result: HabitResult | undefined;
        let completed = true;

        if (h.type === "target" && h.targetValue !== undefined && achieved !== undefined) {
          if (achieved < h.targetValue) {
            result = "fail";
            completed = false; // Still marked as "attempted" but not "completed" for XP purposes?
            // Actually user says achieved < target -> no XP.
          } else if (achieved === h.targetValue) {
            result = "pass";
            completed = true;
          } else {
            result = "excellent";
            completed = true;
          }
        }

        const historyEntry: HabitHistoryEntry = {
          completed,
          achieved,
          result
        };

        return {
          ...h,
          completed,
          achieved,
          result,
          history: {
            ...h.history,
            [today]: historyEntry
          }
        };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const updateHabit = (id: string, text: string, days: number[], type: HabitType, targetValue?: number, unit?: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, text, days, type, targetValue, unit } : h));
  };

  const resetDaily = () => {
    setHabits(prev => prev.map(h => ({ 
      ...h, 
      completed: false, 
      achieved: undefined, 
      result: undefined 
    })));
  };

  const getTodayHabits = () => {
    const today = new Date().getDay();
    return habits.filter(h => h.days.includes(today));
  };

  const getHabitStats = (id: string): HabitStats => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return { completionRate: 0, weeklyData: [] };

    const historyArray = Object.values(habit.history) as HabitHistoryEntry[];
    const completedCount = historyArray.filter(v => v.completed).length;
    const totalDaysTracked = Math.max(1, historyArray.length);
    const completionRate = Math.round((completedCount / totalDaysTracked) * 100);

    // Get last 7 days
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const entry = habit.history[dateStr];
      weeklyData.push({
        date: dateStr,
        completed: entry ? entry.completed : false,
        result: entry ? entry.result : undefined
      });
    }

    return { completionRate, weeklyData };
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, completeHabit, deleteHabit, updateHabit, resetDaily, getTodayHabits, getHabitStats }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};
