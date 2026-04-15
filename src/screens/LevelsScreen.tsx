import React from "react";
import WarriorCard from "@/src/components/WarriorCard";
import WarriorAvatar from "@/src/components/WarriorAvatar";
import { Shield, Lock, ChevronRight, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function LevelsScreen() {
  const ranks = [
    { level: 1, name: "Novice Recruit", status: "Completed", xp: "100/100" },
    { level: 5, name: "Iron Vanguard", status: "Current", xp: "450/1000" },
    { level: 10, name: "Steel Sentinel", status: "Locked", xp: "0/2500" },
    { level: 20, name: "Bronze Berserker", status: "Locked", xp: "0/5000" },
    { level: 50, name: "Silver Slayer", status: "Locked", xp: "0/15000" },
    { level: 100, name: "Golden Gladiator", status: "Locked", xp: "0/50000" },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-warrior-gold">Warrior Progression</h2>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Ascend the ranks of legend</p>
      </div>

      {/* Current Level Detail */}
      <WarriorCard glow className="bg-gradient-to-br from-warrior-metal to-black">
        <div className="flex items-center gap-4">
          <WarriorAvatar level={12} className="w-24 h-24" />
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-heading text-white leading-none">Iron Vanguard</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                <span className="text-muted-foreground">Path to Steel Sentinel</span>
                <span className="text-warrior-gold">45%</span>
              </div>
              <Progress value={45} className="h-1.5 bg-black/50" />
            </div>
            <p className="text-[10px] text-muted-foreground italic">"The iron is forged in the fire of discipline."</p>
          </div>
        </div>
      </WarriorCard>

      {/* Rank List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest px-1">All Ranks</h4>
        {ranks.map((rank, i) => (
          <div 
            key={i} 
            className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
              rank.status === "Current" 
                ? "bg-warrior-red/10 border-warrior-red/50 warrior-glow" 
                : rank.status === "Completed"
                ? "bg-warrior-metal/20 border-warrior-metal/50 opacity-70"
                : "bg-black/20 border-white/5 opacity-40"
            }`}
          >
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              rank.status === "Locked" ? "bg-black/40" : "bg-warrior-metal"
            }`}>
              {rank.status === "Locked" ? <Lock size={16} className="text-muted-foreground" /> : <Star size={20} className="text-warrior-gold" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h5 className="text-sm font-bold text-white">{rank.name}</h5>
                <span className="text-[10px] font-mono text-muted-foreground">LVL {rank.level}</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{rank.xp} XP</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
