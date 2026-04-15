import React, { useState } from "react";
import WarriorCard from "@/src/components/WarriorCard";
import WarriorAvatar from "@/src/components/WarriorAvatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Sword, Trophy, Zap, Clock, Shield } from "lucide-react";
import { motion } from "motion/react";

export default function HomeScreen() {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const handleReady = () => {
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 2000);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Hero Section: Avatar & Stats */}
      <div className="flex items-center gap-6">
        <WarriorAvatar 
          level={12} 
          isCelebrating={isCelebrating} 
          className="w-32 h-32" 
        />
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[2px] text-[#888]">Unstoppable Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-heading text-warrior-red">34</span>
              <span className="text-xs text-[#555] font-bold uppercase">Days</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[2px] text-[#888]">Willpower Score</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-heading text-warrior-red">890</span>
              <span className="text-[10px] text-[#555] font-bold uppercase">Pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Morning Challenge Card */}
      <WarriorCard title="Next Rite of Passage" glow>
        <div className="space-y-4 text-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-heading text-white tracking-widest">50 Combat Push-ups</h2>
            <div className="text-[100px] font-heading leading-none text-warrior-red drop-shadow-[0_0_30px_rgba(255,49,49,0.4)]">
              04:59
            </div>
            <p className="text-[11px] uppercase tracking-[2px] text-[#888]">Countdown to Glory • NO SNOOZE</p>
          </div>

          <Button 
            onClick={handleReady}
            className="w-full bg-gradient-to-b from-warrior-red to-[#8b0000] hover:from-warrior-red/80 hover:to-[#8b0000]/80 text-white font-heading text-2xl py-8 warrior-btn warrior-glow"
          >
            I AM READY
          </Button>
        </div>
      </WarriorCard>

      {/* 100 Day Challenge Progress */}
      <WarriorCard title="The 100-Day Conquest">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-[2px] text-[#888]">34% Carved in Stone</span>
          </div>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square border flex items-center justify-center text-[8px] ${
                  i < 14 
                    ? "bg-warrior-orange border-[#ffcc00] text-black font-bold" 
                    : i === 14
                    ? "border-2 border-warrior-red warrior-glow text-white"
                    : "bg-[#222] border-[#333] text-[#444]"
                }`} 
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-center text-[#666] italic leading-relaxed">"Steel is forged in the fire of daily discipline."</p>
        </div>
      </WarriorCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="border-warrior-metal bg-warrior-metal/30 hover:bg-warrior-metal/50 text-white font-heading py-8">
          <Sword className="mr-2" size={18} />
          Set Habits
        </Button>
        <Button variant="outline" className="border-warrior-metal bg-warrior-metal/30 hover:bg-warrior-metal/50 text-white font-heading py-8">
          <Trophy className="mr-2" size={18} />
          Rewards
        </Button>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Power", val: "85", icon: Zap, color: "text-blue-400" },
          { label: "Will", val: "92", icon: Shield, color: "text-warrior-gold" },
          { label: "Speed", val: "74", icon: Clock, color: "text-warrior-red" },
        ].map((stat, i) => (
          <div key={i} className="bg-warrior-metal/20 border border-warrior-metal p-2 rounded-lg text-center">
            <stat.icon size={14} className={`mx-auto mb-1 ${stat.color}`} />
            <div className="text-lg font-heading leading-none">{stat.val}</div>
            <div className="text-[8px] uppercase font-bold text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
