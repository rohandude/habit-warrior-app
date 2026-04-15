import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAlarm } from "@/src/context/AlarmContext";
import { useXP } from "@/src/context/XPContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, AlertTriangle, Zap, Sword } from "lucide-react";
import WarriorCard from "@/src/components/WarriorCard";

export default function AlarmOverlay() {
  const { isRinging, stopAlarm, solvePuzzle, isPuzzleSolved } = useAlarm();
  const { completeTask, deductXP } = useXP();
  const [answer, setAnswer] = useState("");
  const [puzzle, setPuzzle] = useState({ q: "", a: 0 });
  const [error, setError] = useState(false);

  // Deduct XP if alarm rings for too long (simulated)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRinging && !isPuzzleSolved) {
      timer = setInterval(() => {
        deductXP(10); // Penalty for slow wake up
      }, 30000); // Every 30 seconds
    }
    return () => clearInterval(timer);
  }, [isRinging, isPuzzleSolved, deductXP]);

  useEffect(() => {
    if (isRinging && !isPuzzleSolved) {
      generatePuzzle();
    }
  }, [isRinging, isPuzzleSolved]);

  const generatePuzzle = () => {
    const ops = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1, n2, ans;

    if (op === "+") {
      n1 = Math.floor(Math.random() * 50) + 10;
      n2 = Math.floor(Math.random() * 50) + 10;
      ans = n1 + n2;
    } else if (op === "-") {
      n1 = Math.floor(Math.random() * 50) + 50;
      n2 = Math.floor(Math.random() * 40) + 10;
      ans = n1 - n2;
    } else {
      n1 = Math.floor(Math.random() * 12) + 2;
      n2 = Math.floor(Math.random() * 12) + 2;
      ans = n1 * n2;
    }

    setPuzzle({ q: `${n1} ${op} ${n2}`, a: ans });
    setAnswer("");
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer) === puzzle.a) {
      solvePuzzle();
      completeTask("alarm_cipher", 100); // Reward for breaking the cipher (once a day)
      // The requirement says "Correct answer stops alarm"
      // We can either wait for the user to click "Silence" or do it automatically.
      // Let's make it automatic after a brief success delay for better UX.
      setTimeout(() => {
        stopAlarm();
      }, 1000);
    } else {
      setError(true);
      setAnswer("");
      setTimeout(() => setError(false), 500);
    }
  };

  if (!isRinging) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center"
      >
        {/* Pulsing Background Glow */}
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-warrior-red blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 w-full max-w-sm space-y-8">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="flex justify-center"
          >
            <div className="h-24 w-24 bg-warrior-red rank-hexagon flex items-center justify-center warrior-glow">
              <AlertTriangle size={48} className="text-white animate-pulse" />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-5xl font-heading text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,49,49,0.8)]">
              WAKE UP WARRIOR
            </h1>
            <p className="text-warrior-gold font-heading text-xl tracking-widest uppercase">
              The Morning Trial Begins
            </p>
          </div>

          <WarriorCard title="The Cipher of Strength" glow className={error ? "animate-shake" : ""}>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground uppercase tracking-widest">
                Solve the cipher to silence the alarm
              </p>
              
              <div className="text-4xl font-heading text-white py-4 border-y border-warrior-metal bg-black/40">
                {puzzle.q} = ?
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="ENTER ANSWER"
                  className="bg-warrior-dark border-warrior-metal text-center text-2xl font-heading h-16 focus:border-warrior-red transition-all"
                  autoFocus
                />
                
                {!isPuzzleSolved ? (
                  <Button 
                    type="submit"
                    className="w-full bg-warrior-red hover:bg-warrior-red/80 text-white font-heading text-xl py-8 warrior-btn warrior-glow"
                  >
                    SOLVE CIPHER
                  </Button>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="text-warrior-orange font-heading text-2xl flex items-center justify-center gap-2">
                      <Zap size={24} /> CIPHER BROKEN
                    </div>
                    <Button 
                      onClick={stopAlarm}
                      className="w-full bg-warrior-gold text-black font-heading text-xl py-8 warrior-btn warrior-glow-orange"
                    >
                      SILENCE ALARM
                    </Button>
                  </motion.div>
                )}
              </form>
            </div>
          </WarriorCard>

          <div className="flex justify-center gap-4 opacity-50">
            <Shield size={20} className="text-warrior-metal" />
            <Sword size={20} className="text-warrior-metal" />
            <Shield size={20} className="text-warrior-metal" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
