import React from "react";
import WarriorCard from "@/src/components/WarriorCard";
import { Trophy, Award, Star, Zap, Lock, Gift } from "lucide-react";
import { motion } from "motion/react";

export default function RewardsScreen() {
  const badges = [
    { name: "First Blood", desc: "Complete your first challenge", unlocked: true, icon: Zap, color: "text-blue-400" },
    { name: "Flame Keeper", desc: "Reach a 7-day streak", unlocked: true, icon: Star, color: "text-warrior-orange" },
    { name: "Iron Will", desc: "Complete 100 push-ups in one go", unlocked: true, icon: Award, color: "text-warrior-red" },
    { name: "Sun Chaser", desc: "Wake up at 5AM for 30 days", unlocked: false, icon: Star, color: "text-warrior-gold" },
    { name: "Gladiator", desc: "Reach Warrior Level 25", unlocked: false, icon: Trophy, color: "text-purple-400" },
    { name: "Legend", desc: "Complete the 100-day campaign", unlocked: false, icon: Award, color: "text-warrior-gold" },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading fire-text">The Armory</h2>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Claim your spoils of war</p>
      </div>

      {/* Loot Box Section */}
      <WarriorCard orange glow className="bg-gradient-to-t from-warrior-dark to-warrior-metal">
        <div className="flex flex-col items-center py-4 space-y-4">
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Gift size={64} className="text-warrior-gold drop-shadow-[0_0_15px_rgba(255,204,51,0.5)]" />
            </motion.div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-heading text-white">Daily Loot Chest</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Available in 12:45:10</p>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
            <div className="bg-warrior-gold h-full w-1/2" />
          </div>
        </div>
      </WarriorCard>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-[2px] text-[#888] px-1">Recent Achievements</h4>
        <div className="flex gap-4 px-1">
          {[
            { color: "#ffcc00", icon: "⚡" },
            { color: "#00ffcc", icon: "🔥" },
            { color: "#ff00ff", icon: "🛡️" },
          ].map((badge, i) => (
            <div key={i} className="w-12 h-12 bg-[#222] border border-warrior-gold rotate-45 flex items-center justify-center">
              <div className="-rotate-45 text-xl" style={{ color: badge.color }}>{badge.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Shop Placeholder */}
      <WarriorCard title="The Merchant">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-warrior-gold/20 flex items-center justify-center">
              <Zap size={20} className="text-warrior-gold" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Warrior Coins</p>
              <p className="text-[10px] text-muted-foreground">Spend on gear & perks</p>
            </div>
          </div>
          <div className="text-xl font-heading text-warrior-gold">2,450</div>
        </div>
      </WarriorCard>
    </div>
  );
}
