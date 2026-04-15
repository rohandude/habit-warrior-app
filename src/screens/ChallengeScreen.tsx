import React, { useState, useEffect } from "react";
import WarriorCard from "@/src/components/WarriorCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Clock, AlertCircle, Sword, Flame, Plus, Trash2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHabits } from "@/src/context/HabitContext";
import { useXP } from "@/src/context/XPContext";
import { useAudioManager } from "@/src/context/AudioManagerContext";
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, YAxis, Tooltip } from "recharts";

export default function ChallengeScreen() {
  const { habits, addHabit, toggleHabit, deleteHabit, getHabitStats } = useHabits();
  const { completeTask, isTaskCompleted } = useXP();
  const { playSfx } = useAudioManager();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [newHabitText, setNewHabitText] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [showVictory, setShowVictory] = useState(false);
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);

  const DAYS = [
    { id: 1, label: "M" },
    { id: 2, label: "T" },
    { id: 3, label: "W" },
    { id: 4, label: "T" },
    { id: 5, label: "F" },
    { id: 6, label: "S" },
    { id: 0, label: "S" },
  ];

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId) 
        : [...prev, dayId]
    );
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitText.trim()) {
      addHabit(newHabitText.trim(), selectedDays);
      setNewHabitText("");
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const handleToggleHabit = (id: string, completed: boolean) => {
    toggleHabit(id);
    // If we are marking it as completed, try to award XP
    if (!completed) {
      completeTask(`habit_${id}`, 25);
      playSfx("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"); // Short drum beat
    }
  };

  const handleClaimVictory = () => {
    const allCompleted = habits.every(h => h.completed);
    if (allCompleted && habits.length > 0) {
      if (completeTask("daily_victory_bonus", 100)) {
        playSfx("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"); // Victory drum
        setShowVictory(true);
        setTimeout(() => setShowVictory(false), 3000);
      }
    }
  };

  const allTasksDone = habits.length > 0 && habits.every(h => h.completed);
  const isVictoryClaimed = isTaskCompleted("daily_victory_bonus");
  const today = new Date().getDay();

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading fire-text">The Morning Trial</h2>
        <p className="text-xs text-muted-foreground">Complete all tasks before the fire dies out.</p>
      </div>

      {/* Timer Section */}
      <div className="relative flex justify-center py-8">
        <div className="relative z-10 text-center">
          <div className="text-[120px] font-heading leading-none text-warrior-red drop-shadow-[0_0_30px_rgba(255,49,49,0.4)]">
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center justify-center gap-2 text-[#888] font-bold uppercase text-[11px] tracking-[2px] mt-2">
            Countdown to Glory • NO SNOOZE
          </div>
        </div>
      </div>

      {/* Add Habit Form */}
      <WarriorCard title="New Objective" className="p-4">
        <form onSubmit={handleAddHabit} className="space-y-4">
          <Input 
            value={newHabitText}
            onChange={(e) => setNewHabitText(e.target.value)}
            placeholder="Enter habit name..."
            className="bg-black/40 border-warrior-metal text-sm h-12"
          />
          
          <div className="flex justify-between gap-1">
            {DAYS.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`flex-1 h-10 rounded-lg text-[10px] font-bold transition-all border ${
                  selectedDays.includes(day.id)
                    ? "bg-warrior-red border-warrior-red text-white warrior-glow"
                    : "bg-warrior-metal/30 border-warrior-metal text-muted-foreground"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          <Button type="submit" className="w-full bg-warrior-metal hover:bg-warrior-red h-12 font-heading tracking-widest">
            <Plus size={18} className="mr-2" /> ADD HABIT
          </Button>
        </form>
      </WarriorCard>

      {/* Task List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Objectives</h3>
          <span className="text-[10px] font-mono text-warrior-gold">{habits.length} TOTAL</span>
        </div>
        
        <AnimatePresence initial={false}>
          {habits.map((habit, i) => {
            const isClaimed = isTaskCompleted(`habit_${habit.id}`);
            const isActiveToday = habit.days.includes(today);
            const stats = getHabitStats(habit.id);
            const isExpanded = expandedHabit === habit.id;
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
              >
                <WarriorCard className={`p-0 ${!isActiveToday ? "opacity-40" : ""}`}>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-4 group">
                      <Checkbox 
                        id={habit.id}
                        checked={habit.completed}
                        onCheckedChange={() => handleToggleHabit(habit.id, habit.completed)}
                        disabled={!isActiveToday}
                        className="h-6 w-6 border-2 border-warrior-red/50 data-[state=checked]:bg-warrior-red data-[state=checked]:text-white"
                      />
                      <div className="flex-1" onClick={() => setExpandedHabit(isExpanded ? null : habit.id)}>
                        <div className="flex items-center gap-2">
                          <label 
                            htmlFor={habit.id}
                            className={`text-sm font-bold cursor-pointer transition-all ${habit.completed ? "text-muted-foreground line-through" : "text-white"}`}
                          >
                            {habit.text}
                          </label>
                          {!isActiveToday && (
                            <span className="text-[8px] bg-white/10 text-white/40 px-1 rounded uppercase font-bold">Inactive Today</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className={`text-[10px] font-mono ${isClaimed ? "text-warrior-red line-through opacity-50" : "text-warrior-gold"}`}>
                              +25 XP
                            </p>
                            {isClaimed && (
                              <span className="text-[8px] bg-warrior-red/20 text-warrior-red px-1 rounded font-bold uppercase">Honor Gained</span>
                            )}
                          </div>
                          <span className="text-[9px] font-bold text-warrior-orange uppercase tracking-tighter">
                            {stats.completionRate}% Mastery
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteHabit(habit.id)}
                        className="text-muted-foreground hover:text-warrior-red opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Weekly Progress Graph */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pt-2 border-t border-warrior-metal/30"
                        >
                          <div className="h-24 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={stats.weeklyData}>
                                <Bar dataKey="completed" radius={[2, 2, 0, 0]}>
                                  {stats.weeklyData.map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={entry.completed ? "#ff3131" : "#222"} 
                                      className={entry.completed ? "warrior-glow" : ""}
                                    />
                                  ))}
                                </Bar>
                                <XAxis 
                                  dataKey="date" 
                                  hide 
                                />
                                <YAxis hide domain={[0, 1]} />
                                <Tooltip 
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-black/90 border border-warrior-metal p-2 rounded text-[8px] uppercase font-bold">
                                          <p className="text-white">{data.date}</p>
                                          <p className={data.completed ? "text-warrior-red" : "text-muted-foreground"}>
                                            {data.completed ? "VICTORY" : "MISSED"}
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex justify-between mt-1 px-1">
                            <span className="text-[7px] text-muted-foreground uppercase">7 Days Ago</span>
                            <span className="text-[7px] text-muted-foreground uppercase">Today</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </WarriorCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleClaimVictory}
          disabled={timeLeft === 0 || !allTasksDone || isVictoryClaimed}
          className={`w-full font-heading py-8 text-lg warrior-glow disabled:opacity-50 ${
            isVictoryClaimed 
              ? "bg-warrior-metal text-muted-foreground cursor-not-allowed" 
              : allTasksDone
              ? "bg-gradient-to-r from-warrior-red to-warrior-orange hover:from-warrior-red/80 hover:to-warrior-orange/80 text-white"
              : "bg-warrior-metal/50 text-muted-foreground"
          }`}
        >
          {isVictoryClaimed ? "VICTORY SECURED" : allTasksDone ? "CLAIM DAILY BONUS (+100 XP)" : "COMPLETE ALL TASKS"}
        </Button>
        <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest">
          Finish all rites to claim the ultimate honor
        </p>
      </div>

      <AnimatePresence>
        {showVictory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-warrior-surface border-2 border-warrior-gold p-8 rounded-2xl shadow-[0_0_50px_rgba(226,192,141,0.3)] text-center space-y-4">
              <Trophy size={64} className="text-warrior-gold mx-auto animate-bounce" />
              <h3 className="text-3xl font-heading text-white">ULTIMATE VICTORY</h3>
              <p className="text-warrior-gold font-bold uppercase tracking-widest">Daily Bonus Gained: +100 XP</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
