import React, { createContext, useContext, useState, useEffect } from "react";

export interface Habit {
  id: string;
  text: string;
  completed: boolean;
  days: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  history: Record<string, boolean>; // YYYY-MM-DD -> completed
}

interface HabitStats {
  completionRate: number;
  weeklyData: { date: string; completed: boolean }[];
}

interface HabitContextType {
  habits: Habit[];
  addHabit: (text: string, days: number[]) => void;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  resetDaily: () => void;
  getTodayHabits: () => Habit[];
  getHabitStats: (id: string) => HabitStats;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const DEFAULT_HABITS: Habit[] = [
  { id: "1", text: "Hydrate: Drink 500ml Water", completed: false, days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { id: "2", text: "Refresh: Cold Shower / Face Wash", completed: false, days: [0, 1, 2, 3, 4, 5, 6], history: {} },
  { id: "3", text: "Ready: Gear Up & Stretch", completed: false, days: [0, 1, 2, 3, 4, 5, 6], history: {} },
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
        history: h.history || {}
      }));

      if (lastReset !== today) {
        // New day, reset completion
        return migrated.map((h: Habit) => ({ ...h, completed: false }));
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

  const addHabit = (text: string, days: number[]) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      text,
      completed: false,
      days: days.length > 0 ? days : [0, 1, 2, 3, 4, 5, 6],
      history: {},
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newCompleted = !h.completed;
        return {
          ...h,
          completed: newCompleted,
          history: {
            ...h.history,
            [today]: newCompleted
          }
        };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const resetDaily = () => {
    setHabits(prev => prev.map(h => ({ ...h, completed: false })));
  };

  const getTodayHabits = () => {
    const today = new Date().getDay();
    return habits.filter(h => h.days.includes(today));
  };

  const getHabitStats = (id: string): HabitStats => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return { completionRate: 0, weeklyData: [] };

    const historyArray = Object.values(habit.history);
    const completedCount = historyArray.filter(v => v).length;
    const totalDaysTracked = Math.max(1, historyArray.length);
    const completionRate = Math.round((completedCount / totalDaysTracked) * 100);

    // Get last 7 days
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      weeklyData.push({
        date: dateStr,
        completed: !!habit.history[dateStr]
      });
    }

    return { completionRate, weeklyData };
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit, resetDaily, getTodayHabits, getHabitStats }}>
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
