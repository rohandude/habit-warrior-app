import React, { useState, useEffect } from "react";
import WarriorCard from "@/src/components/WarriorCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, AlertCircle, Sword, Flame } from "lucide-react";
import { motion } from "motion/react";

export default function ChallengeScreen() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  
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

  const tasks = [
    { id: 1, text: "50 Explosive Push-ups", xp: "+50 XP" },
    { id: 2, text: "2 Minute Cold Shower", xp: "+30 XP" },
    { id: 3, text: "10 Minute Meditation", xp: "+20 XP" },
    { id: 4, text: "Hydrate (500ml Water)", xp: "+10 XP" },
  ];

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
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <WarriorCard className="p-0">
              <div className="flex items-center p-4 gap-4">
                <Checkbox 
                  id={`task-${task.id}`}
                  className="h-6 w-6 border-2 border-warrior-red/50 data-[state=checked]:bg-warrior-red data-[state=checked]:text-white"
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`task-${task.id}`}
                    className="text-sm font-bold text-white cursor-pointer"
                  >
                    {task.text}
                  </label>
                  <p className="text-[10px] text-warrior-gold font-mono">{task.xp}</p>
                </div>
                <Sword size={16} className="text-muted-foreground" />
              </div>
            </WarriorCard>
          </motion.div>
        ))}
      </div>

      <div className="pt-4">
        <Button 
          disabled={timeLeft === 0}
          className="w-full bg-gradient-to-r from-warrior-red to-warrior-orange hover:from-warrior-red/80 hover:to-warrior-orange/80 text-white font-heading py-8 text-lg warrior-glow"
        >
          CLAIM VICTORY
        </Button>
        <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest">
          Failure results in streak reset
        </p>
      </div>
    </div>
  );
}
