import React, { createContext, useContext, useState, useEffect } from "react";

export interface Habit {
  id: string;
  text: string;
  completed: boolean;
}

interface HabitContextType {
  habits: Habit[];
  addHabit: (text: string) => void;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  resetDaily: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const DEFAULT_HABITS: Habit[] = [
  { id: "1", text: "Hydrate: Drink 500ml Water", completed: false },
  { id: "2", text: "Refresh: Cold Shower / Face Wash", completed: false },
  { id: "3", text: "Ready: Gear Up & Stretch", completed: false },
];

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("warrior_habits");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if it's a new day to reset? 
      // For simplicity in this demo, we just load them.
      return parsed;
    }
    return DEFAULT_HABITS;
  });

  useEffect(() => {
    localStorage.setItem("warrior_habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (text: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const resetDaily = () => {
    setHabits(prev => prev.map(h => ({ ...h, completed: false })));
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit, resetDaily }}>
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
