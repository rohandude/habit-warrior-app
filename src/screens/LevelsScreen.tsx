import React from "react";
import WarriorCard from "@/src/components/WarriorCard";
import WarriorAvatar from "@/src/components/WarriorAvatar";
import { Shield, Lock, ChevronRight, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useXP, RANKS } from "@/src/context/XPContext";

export default function LevelsScreen() {
  const { xp, level, currentRank, nextRank, progressToNext } = useXP();

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-warrior-gold">Warrior Progression</h2>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Ascend the ranks of legend</p>
      </div>

      {/* Current Level Detail */}
      <WarriorCard glow className="bg-gradient-to-br from-warrior-metal to-black">
        <div className="flex items-center gap-4">
          <WarriorAvatar level={level} className="w-24 h-24" />
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-heading text-white leading-none">{currentRank.name}</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                <span className="text-muted-foreground">
                  {nextRank ? `Path to ${nextRank.name}` : "Max Rank Achieved"}
                </span>
                <span className="text-warrior-gold">{Math.floor(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="h-1.5 bg-black/50" />
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              {xp} Total XP • Level {level}
            </p>
          </div>
        </div>
      </WarriorCard>

      {/* Rank List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest px-1">The Hierarchy of Power</h4>
        {RANKS.map((rank, i) => {
          const isUnlocked = xp >= rank.minXP;
          const isCurrent = currentRank.name === rank.name;
          
          return (
            <div 
              key={i} 
              className={`flex items-center gap-4 p-3 border transition-all ${
                isCurrent 
                  ? "bg-warrior-red/10 border-warrior-red warrior-glow" 
                  : isUnlocked
                  ? "bg-warrior-metal/20 border-warrior-metal/50 opacity-70"
                  : "bg-black/20 border-white/5 opacity-40"
              }`}
            >
              <div className={`h-10 w-10 rank-hexagon flex items-center justify-center ${
                !isUnlocked ? "bg-black/40" : "bg-warrior-metal"
              }`}>
                {!isUnlocked ? <Lock size={16} className="text-muted-foreground" /> : <Star size={20} className="text-warrior-gold" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h5 className="text-sm font-heading text-white">{rank.name}</h5>
                  {isCurrent && (
                    <span className="text-[8px] bg-warrior-red text-white px-2 py-0.5 rounded-full font-bold uppercase">Current</span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                  {rank.minXP} XP REQUIRED
                </p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
