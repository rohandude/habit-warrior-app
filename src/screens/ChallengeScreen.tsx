import React, { useState, useEffect } from "react";
import WarriorCard from "@/src/components/WarriorCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Clock, AlertCircle, Sword, Flame, Plus, Trash2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHabits } from "@/src/context/HabitContext";
import { useXP } from "@/src/context/XPContext";

export default function ChallengeScreen() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useHabits();
  const { completeTask, isTaskCompleted } = useXP();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [newHabitText, setNewHabitText] = useState("");
  const [showVictory, setShowVictory] = useState(false);
  
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
      addHabit(newHabitText.trim());
      setNewHabitText("");
    }
  };

  const handleToggleHabit = (id: string, completed: boolean) => {
    toggleHabit(id);
    // If we are marking it as completed, try to award XP
    if (!completed) {
      completeTask(`habit_${id}`, 25);
    }
  };

  const handleClaimVictory = () => {
    const allCompleted = habits.every(h => h.completed);
    if (allCompleted && habits.length > 0) {
      if (completeTask("daily_victory_bonus", 100)) {
        setShowVictory(true);
        setTimeout(() => setShowVictory(false), 3000);
      }
    }
  };

  const allTasksDone = habits.length > 0 && habits.every(h => h.completed);
  const isVictoryClaimed = isTaskCompleted("daily_victory_bonus");

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

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {habits.map((habit, i) => {
            const isClaimed = isTaskCompleted(`habit_${habit.id}`);
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
              >
                <WarriorCard className="p-0">
                  <div className="flex items-center p-4 gap-4 group">
                    <Checkbox 
                      id={habit.id}
                      checked={habit.completed}
                      onCheckedChange={() => handleToggleHabit(habit.id, habit.completed)}
                      className="h-6 w-6 border-2 border-warrior-red/50 data-[state=checked]:bg-warrior-red data-[state=checked]:text-white"
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={habit.id}
                        className={`text-sm font-bold cursor-pointer transition-all ${habit.completed ? "text-muted-foreground line-through" : "text-white"}`}
                      >
                        {habit.text}
                      </label>
                      <div className="flex items-center gap-2">
                        <p className={`text-[10px] font-mono ${isClaimed ? "text-warrior-red line-through opacity-50" : "text-warrior-gold"}`}>
                          +25 XP
                        </p>
                        {isClaimed && (
                          <span className="text-[8px] bg-warrior-red/20 text-warrior-red px-1 rounded font-bold uppercase">Honor Gained</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteHabit(habit.id)}
                      className="text-muted-foreground hover:text-warrior-red opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </WarriorCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add Habit Form */}
        <form onSubmit={handleAddHabit} className="flex gap-2 mt-4 pt-4 border-t border-warrior-metal/30">
          <Input 
            value={newHabitText}
            onChange={(e) => setNewHabitText(e.target.value)}
            placeholder="Add custom objective..."
            className="bg-black/40 border-warrior-metal text-xs h-10"
          />
          <Button type="submit" size="icon" className="bg-warrior-metal hover:bg-warrior-red shrink-0">
            <Plus size={18} />
          </Button>
        </form>
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
