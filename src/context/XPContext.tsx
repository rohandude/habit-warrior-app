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
  currentRank: Rank;
  nextRank: Rank | null;
  addXP: (amount: number) => void;
  deductXP: (amount: number) => void;
  progressToNext: number;
}

const XPContext = createContext<XPContextType | undefined>(undefined);

export const XPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [xp, setXP] = useState<number>(() => {
    const saved = localStorage.getItem("warrior_xp");
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("warrior_xp", xp.toString());
  }, [xp]);

  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
  };

  const deductXP = (amount: number) => {
    setXP(prev => Math.max(0, prev - amount));
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
    <XPContext.Provider value={{ xp, level, currentRank, nextRank, addXP, deductXP, progressToNext }}>
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
