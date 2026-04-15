import React, { useState, useEffect } from "react";
import WarriorCard from "@/src/components/WarriorCard";
import WarriorAvatar from "@/src/components/WarriorAvatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Sword, Trophy, Zap, Clock, Shield, AlertCircle, Play, Pause, Volume2, CheckCircle2, XCircle, Star, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAlarm } from "@/src/context/AlarmContext";
import { useXP } from "@/src/context/XPContext";
import { useAudioManager } from "@/src/context/AudioManagerContext";
import { useHabits, HabitType } from "@/src/context/HabitContext";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RANK_STYLES } from "@/src/constants/rankStyles";
import WarriorCharacter from "@/src/components/WarriorCharacter";

export default function HomeScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const { isAlarmActive, alarmTime, earlySolve } = useAlarm();
  const { level, xp, streak, completeTask, isTaskCompleted, currentRank, nextRank, progressToNext } = useXP();
  const { isBgmPlaying, bgmVolume, toggleBgm, setBgmVolume, playSfx } = useAudioManager();
  const { getTodayHabits, completeHabit } = useHabits();
  const [habitInputs, setHabitInputs] = useState<Record<string, string>>({});

  const todayHabits = getTodayHabits();
  const rankStyle = RANK_STYLES[currentRank.name] || RANK_STYLES["Novice Recruit"];
  const RankIcon = rankStyle.icon;

  const handleCompleteHabit = (id: string, type: HabitType, targetValue?: number) => {
    if (isTaskCompleted(`habit_${id}`)) return;

    const achieved = habitInputs[id] ? Number(habitInputs[id]) : undefined;
    completeHabit(id, achieved);
    
    let xpAmount = 0;
    if (type === "simple") {
      xpAmount = 10;
    } else if (type === "target" && targetValue !== undefined && achieved !== undefined) {
      if (achieved >= targetValue) {
        xpAmount = achieved > targetValue ? 20 : 10;
      }
    }

    if (xpAmount > 0) {
      const success = completeTask(`habit_${id}`, xpAmount);
      if (success) {
        playSfx("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3");
        
        // Check if this was the last habit for the day
        const updatedHabits = todayHabits.map(h => h.id === id ? { ...h, completed: true } : h);
        const allDone = updatedHabits.every(h => h.completed || (h.type === "target" && h.result !== undefined));
        if (allDone && updatedHabits.length > 0) {
          const bonusSuccess = completeTask("daily_mastery_bonus", 50);
          if (bonusSuccess) {
            setIsCelebrating(true);
            setTimeout(() => setIsCelebrating(false), 3000);
          }
        }
      }
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "excellent": return <Star size={16} className="text-warrior-gold" />;
      case "pass": return <CheckCircle2 size={16} className="text-green-500" />;
      case "fail": return <XCircle size={16} className="text-warrior-red" />;
      default: return null;
    }
  };

  const getResultMessage = (result: string) => {
    switch (result) {
      case "excellent": return "EXCELLENT";
      case "pass": return "PASSED";
      case "fail": return "FAILED";
      default: return "";
    }
  };

  return (
    <div className={`min-h-full transition-all duration-1000 relative overflow-hidden ${rankStyle.bgClass}`}>
      {/* Particle Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: "110%", 
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5 
            }}
            animate={{ 
              y: "-10%", 
              opacity: [0, 0.3, 0],
              x: (Math.random() * 100 - 50) + "%"
            }}
            transition={{ 
              duration: 5 + Math.random() * 10, 
              repeat: Infinity, 
              delay: Math.random() * 10,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
            style={{ 
              backgroundColor: i % 2 === 0 ? rankStyle.color : 'white',
              boxShadow: `0 0 10px ${rankStyle.color}`
            }}
          />
        ))}
        {/* Smoke/Fog Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/60 to-transparent blur-3xl opacity-50" />
      </div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {isCelebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center space-y-4 p-8"
            >
              <div className="relative inline-block">
                <Trophy size={80} className="text-warrior-gold animate-bounce" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-warrior-gold/20 blur-2xl rounded-full"
                />
              </div>
              <h2 className="text-4xl font-heading text-white tracking-tighter">DAILY MASTERY</h2>
              <p className="text-warrior-gold font-mono text-xl">+50 XP BONUS</p>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">All Rites Completed</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 p-4 space-y-8">
        {/* Warrior Stage */}
        <div className="relative pt-4 pb-2 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRank.name}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <WarriorCharacter style={rankStyle} />
              
              <div className="mt-4 text-center space-y-1">
                <h2 className="text-3xl font-heading text-white tracking-tighter drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                  {currentRank.name}
                </h2>
                <div className="flex items-center justify-center gap-2">
                   <div className="h-px w-8 bg-gradient-to-r from-transparent to-warrior-red/50" />
                   <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground" style={{ color: rankStyle.color }}>
                     RANK {level}
                   </p>
                   <div className="h-px w-8 bg-gradient-to-l from-transparent to-warrior-red/50" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* XP Progression Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-2 space-y-2"
        >
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Warrior XP</p>
              <p className="text-lg font-mono font-bold text-white leading-none">
                {xp.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">XP</span>
              </p>
            </div>
            {nextRank && (
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Next Rank</p>
                <p className="text-[10px] font-mono text-warrior-gold">
                  {nextRank.minXP.toLocaleString()} XP
                </p>
              </div>
            )}
          </div>
          
          <div className="relative h-3 w-full bg-black/40 rounded-full border border-warrior-metal/30 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ 
                backgroundColor: rankStyle.color,
                boxShadow: `0 0 10px ${rankStyle.color}40`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          </div>
          
          {nextRank && (
            <p className="text-[9px] text-center text-muted-foreground uppercase tracking-tighter">
              {Math.max(0, nextRank.minXP - xp).toLocaleString()} XP to {nextRank.name}
            </p>
          )}
        </motion.div>

        {/* Today's Habits Section - Upgraded Card View */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-muted-foreground" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Today's Objectives</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-warrior-gold bg-warrior-gold/10 px-2 py-0.5 rounded-full border border-warrior-gold/20">
                {todayHabits.filter(h => h.completed).length}/{todayHabits.length} DONE
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {todayHabits.length > 0 ? (
              todayHabits.map((habit) => {
                const isCompleted = habit.completed || (habit.type === "target" && habit.result !== undefined);
                
                return (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <WarriorCard className={`p-0 overflow-hidden transition-all duration-500 ${
                      isCompleted 
                        ? "opacity-60 border-transparent bg-warrior-metal/10 scale-[0.98]" 
                        : `${rankStyle.cardClass} ${rankStyle.glowClass} border-l-4`
                    }`} style={{ borderLeftColor: isCompleted ? 'transparent' : rankStyle.color }}>
                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-4">
                          {habit.type === "simple" ? (
                            <Checkbox 
                              checked={habit.completed}
                              onCheckedChange={() => handleCompleteHabit(habit.id, "simple")}
                              disabled={habit.completed}
                              className={`h-8 w-8 border-2 transition-all active:scale-90 ${
                                habit.completed 
                                  ? "bg-muted-foreground border-muted-foreground" 
                                  : "border-warrior-red/50 data-[state=checked]:bg-warrior-red"
                              }`}
                            />
                          ) : (
                            <div className={`h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                              isCompleted ? "border-transparent bg-warrior-metal/30" : "border-warrior-red/50"
                            }`}>
                              <Sword size={16} className={isCompleted ? "text-muted-foreground" : "text-warrior-red"} />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <p className={`text-base font-bold tracking-tight transition-all ${isCompleted ? "text-muted-foreground line-through" : "text-white"}`}>
                              {habit.text}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {habit.type === "target" && !isCompleted && (
                                <span className="text-[10px] font-mono text-warrior-gold flex items-center gap-1">
                                  <Target size={10} /> Target: {habit.targetValue} {habit.unit}
                                </span>
                              )}
                              {isCompleted && habit.result && (
                                <div className="flex items-center gap-1">
                                  {getResultIcon(habit.result)}
                                  <span className={`text-[10px] font-bold uppercase tracking-tighter ${habit.result === "fail" ? "text-warrior-red" : "text-warrior-gold"}`}>
                                    {getResultMessage(habit.result)}
                                  </span>
                                  {habit.type === "target" && (
                                    <span className="text-[10px] text-muted-foreground ml-1">
                                      ({habit.achieved}/{habit.targetValue} {habit.unit})
                                    </span>
                                  )}
                                </div>
                              )}
                              {!isCompleted && habit.type === "simple" && (
                                <span className="text-[10px] font-mono text-warrior-gold">+10 XP</span>
                              )}
                              {!isCompleted && habit.type === "target" && (
                                <span className="text-[10px] font-mono text-warrior-gold">+10-20 XP</span>
                              )}
                            </div>
                          </div>

                          <AnimatePresence>
                            {isCompleted && (
                              <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="bg-warrior-red/20 p-2 rounded-full"
                              >
                                <Zap size={18} className="text-warrior-orange" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {habit.type === "target" && !isCompleted && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2 pt-3 border-t border-warrior-metal/20"
                          >
                            <Input 
                              type="number"
                              placeholder={`Achieved (${habit.unit})`}
                              value={habitInputs[habit.id] || ""}
                              onChange={(e) => setHabitInputs(prev => ({ ...prev, [habit.id]: e.target.value }))}
                              className="bg-black/40 border-warrior-metal text-sm h-10 flex-1 focus:border-warrior-red transition-all"
                            />
                            <Button 
                              onClick={() => handleCompleteHabit(habit.id, "target", habit.targetValue)}
                              disabled={isCompleted}
                              className={`h-10 px-6 font-bold text-[10px] uppercase tracking-widest warrior-glow ${
                                isCompleted ? "bg-muted-foreground" : "bg-warrior-red hover:bg-warrior-red/80"
                              }`}
                            >
                              {isCompleted ? "SLAIN" : "Slay"}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </WarriorCard>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-16 space-y-4 border-2 border-dashed border-warrior-metal/30 rounded-[2rem] bg-black/20">
                <div className="bg-warrior-metal/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <Shield size={40} className="text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-white">No rites scheduled for today</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Rest and recover, Warrior</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate?.("challenge")}
                  className="border-warrior-metal text-[10px] h-10 px-6 font-bold uppercase tracking-widest mt-4"
                >
                  Manage Habits
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Summary - Minimal */}
        {todayHabits.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4"
          >
            <div className={`bg-black/40 backdrop-blur-sm border ${rankStyle.cardClass} p-5 rounded-3xl flex items-center justify-between ${rankStyle.glowClass}`}>
              <div className="flex items-center gap-4">
                <div className="bg-warrior-red/10 p-3 rounded-2xl">
                  <Trophy size={24} className="text-warrior-red" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Daily Mastery</p>
                  <p className="text-xl font-heading text-white">
                    {Math.round((todayHabits.filter(h => h.completed).length / todayHabits.length) * 100)}% Complete
                  </p>
                </div>
              </div>
              <div className="relative h-12 w-12 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-warrior-metal/30"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="125.6"
                    initial={{ strokeDashoffset: 125.6 }}
                    animate={{ strokeDashoffset: 125.6 - (125.6 * (todayHabits.filter(h => h.completed).length / todayHabits.length)) }}
                    className="text-warrior-red"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-white">
                  {Math.round((todayHabits.filter(h => h.completed).length / todayHabits.length) * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
