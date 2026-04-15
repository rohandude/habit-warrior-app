import React, { useState } from "react";
import WarriorCard from "@/src/components/WarriorCard";
import WarriorAvatar from "@/src/components/WarriorAvatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Sword, Trophy, Zap, Clock, Shield, AlertCircle, Play, Pause, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAlarm } from "@/src/context/AlarmContext";
import { useXP } from "@/src/context/XPContext";
import { useAudioManager } from "@/src/context/AudioManagerContext";
import { useHabits } from "@/src/context/HabitContext";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export default function HomeScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const { isAlarmActive, alarmTime } = useAlarm();
  const { level, xp, streak, completeTask, isTaskCompleted } = useXP();
  const { isBgmPlaying, bgmVolume, toggleBgm, setBgmVolume, playSfx } = useAudioManager();
  const { getTodayHabits, toggleHabit } = useHabits();

  const isReadyCompleted = isTaskCompleted("morning_ready");
  const todayHabits = getTodayHabits();

  const handleReady = () => {
    if (completeTask("morning_ready", 10)) { // Small reward for answering the call
      setIsCelebrating(true);
      setTimeout(() => setIsCelebrating(false), 2000);
    }
  };

  const handleToggleHabit = (id: string, completed: boolean) => {
    toggleHabit(id);
    if (!completed) {
      completeTask(`habit_${id}`, 25);
      playSfx("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3");
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Hero Section: Avatar & Stats */}
      <div className="flex items-center gap-6">
        <WarriorAvatar 
          level={level} 
          isCelebrating={isCelebrating} 
          className="w-32 h-32" 
        />
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[2px] text-[#888]">Unstoppable Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-heading text-warrior-red">{streak}</span>
              <span className="text-xs text-[#555] font-bold uppercase">Days</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[2px] text-[#888]">Total Honor</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-heading text-warrior-red">{xp}</span>
              <span className="text-[10px] text-[#555] font-bold uppercase">XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alarm Status Banner */}
      <AnimatePresence>
        {isAlarmActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div 
              onClick={() => onNavigate?.("rituals")}
              className="bg-warrior-red/10 border border-warrior-red/30 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-warrior-red/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-warrior-red animate-pulse" />
                <div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-tighter">Ritual Pending</p>
                  <p className="text-[12px] font-heading text-warrior-red">{alarmTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-warrior-orange uppercase">
                <AlertCircle size={12} /> Solve Early
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Morning Challenge Card */}
      <WarriorCard title="The Call to Arms" glow>
        <div className="space-y-4 text-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-heading text-white tracking-widest">Answer the Call</h2>
            <div className="text-[100px] font-heading leading-none text-warrior-red drop-shadow-[0_0_30px_rgba(255,49,49,0.4)]">
              {isReadyCompleted ? "DONE" : "NOW"}
            </div>
            <p className="text-[11px] uppercase tracking-[2px] text-[#888]">
              {isReadyCompleted ? "Ritual Commenced • Proceed to Battle" : "The fire awaits your presence"}
            </p>
          </div>

          <Button 
            onClick={handleReady}
            disabled={isReadyCompleted}
            className={`w-full font-heading text-2xl py-8 warrior-btn ${
              isReadyCompleted 
                ? "bg-warrior-metal text-muted-foreground cursor-not-allowed" 
                : "bg-gradient-to-b from-warrior-red to-[#8b0000] hover:from-warrior-red/80 hover:to-[#8b0000]/80 text-white warrior-glow"
            }`}
          >
            {isReadyCompleted ? "RITUAL STARTED" : "I AM READY"}
          </Button>
        </div>
      </WarriorCard>

      {/* Today's Habits Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today's Objectives</h3>
          <span className="text-[10px] font-mono text-warrior-gold">{todayHabits.filter(h => h.completed).length}/{todayHabits.length} DONE</span>
        </div>
        
        <div className="space-y-2">
          {todayHabits.length > 0 ? (
            todayHabits.map((habit) => {
              const isClaimed = isTaskCompleted(`habit_${habit.id}`);
              return (
                <WarriorCard key={habit.id} className="p-0">
                  <div className="flex items-center p-3 gap-3">
                    <Checkbox 
                      checked={habit.completed}
                      onCheckedChange={() => handleToggleHabit(habit.id, habit.completed)}
                      disabled={habit.completed}
                      className="h-5 w-5 border-2 border-warrior-red/50 data-[state=checked]:bg-warrior-red data-[state=checked]:text-white"
                    />
                    <div className="flex-1">
                      <p className={`text-xs font-bold ${habit.completed ? "text-muted-foreground line-through" : "text-white"}`}>
                        {habit.text}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono ${isClaimed ? "text-warrior-red opacity-50" : "text-warrior-gold"}`}>
                          +25 XP
                        </span>
                        {isClaimed && (
                          <span className="text-[7px] bg-warrior-red/20 text-warrior-red px-1 rounded font-bold uppercase">Honor Gained</span>
                        )}
                      </div>
                    </div>
                    {habit.completed && (
                      <Zap size={14} className="text-warrior-orange animate-pulse" />
                    )}
                  </div>
                </WarriorCard>
              );
            })
          ) : (
            <p className="text-[10px] text-center text-muted-foreground py-4 border border-dashed border-warrior-metal rounded-xl">
              No objectives scheduled for today. Rest and recover, Warrior.
            </p>
          )}
        </div>
      </div>

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

      {/* War Drums (Music) Section */}
      <WarriorCard title="War Drums">
        <div className="flex items-center gap-4">
          <Button 
            onClick={toggleBgm}
            className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
              isBgmPlaying 
                ? "bg-warrior-red text-white warrior-glow" 
                : "bg-warrior-metal/30 text-muted-foreground border border-warrior-metal"
            }`}
          >
            {isBgmPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </Button>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
                <Volume2 size={12} /> Intensity
              </span>
              <span className="text-[10px] font-mono text-warrior-gold">{Math.round(bgmVolume * 100)}%</span>
            </div>
            <Slider 
              value={[isNaN(bgmVolume) ? 50 : bgmVolume * 100]} 
              onValueChange={(vals) => setBgmVolume(vals[0] / 100)} 
              max={100} 
              step={1}
              className="[&_[role=slider]]:bg-warrior-red [&_[role=slider]]:border-warrior-red"
            />
          </div>
        </div>
        <p className="text-[9px] text-center text-[#555] mt-3 uppercase tracking-tighter">
          {isBgmPlaying ? "The drums of war echo in your soul" : "Silence before the storm"}
        </p>
      </WarriorCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={() => onNavigate?.("rituals")}
          className="border-warrior-metal bg-warrior-metal/30 hover:bg-warrior-metal/50 text-white font-heading py-8"
        >
          <Clock className="mr-2" size={18} />
          Set Rituals
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onNavigate?.("rewards")}
          className="border-warrior-metal bg-warrior-metal/30 hover:bg-warrior-metal/50 text-white font-heading py-8"
        >
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
