import React from "react";
import WarriorCard from "@/src/components/WarriorCard";
import WarriorAvatar from "@/src/components/WarriorAvatar";
import { Separator } from "@/components/ui/separator";
import { Trophy, Zap, Shield, Flame, Target, Award } from "lucide-react";

export default function ProfileScreen() {
  const stats = [
    { label: "Battles Won", val: "142", icon: Trophy },
    { label: "Current Streak", val: "14", icon: Flame },
    { label: "Total XP", val: "12,450", icon: Zap },
    { label: "Achievements", val: "28", icon: Award },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4 pt-4">
        <div className="relative">
          <WarriorAvatar 
            level={12} 
            className="w-32 h-32" 
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-warrior-red text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest warrior-btn warrior-glow">
            Veteran
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-heading text-white">Rohan the Brave</h2>
          <p className="text-xs text-muted-foreground font-mono">ID: #WAR-06042006</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <WarriorCard key={i} className="p-3 text-center space-y-1">
            <stat.icon size={16} className="mx-auto text-warrior-orange" />
            <div className="text-xl font-heading text-white leading-none">{stat.val}</div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">{stat.label}</div>
          </WarriorCard>
        ))}
      </div>

      {/* Recent Achievements */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Recent Feats</h4>
          <span className="text-[10px] text-warrior-red font-bold uppercase cursor-pointer">View All</span>
        </div>
        
        <div className="space-y-3">
          {[
            { title: "Early Riser", desc: "Woke up before 6AM for 7 days", date: "2 days ago", icon: Flame },
            { title: "Push-up Master", desc: "Completed 500 push-ups in a week", date: "4 days ago", icon: Target },
            { title: "Cold Blooded", desc: "Took 5 cold showers in a row", date: "1 week ago", icon: Shield },
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-warrior-metal/20 border border-warrior-metal/50 rounded-xl">
              <div className="h-10 w-10 rounded-lg bg-warrior-dark border border-warrior-red/30 flex items-center justify-center">
                <feat.icon size={20} className="text-warrior-red" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold text-white">{feat.title}</h5>
                <p className="text-[10px] text-muted-foreground">{feat.desc}</p>
              </div>
              <span className="text-[8px] text-muted-foreground font-mono">{feat.date}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-warrior-metal" />
      
      <div className="text-center pb-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">Warrior Code</p>
        <p className="text-xs italic text-muted-foreground/60 px-8">
          "Discipline is the bridge between goals and accomplishment."
        </p>
      </div>
    </div>
  );
}
