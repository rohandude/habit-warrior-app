import React, { useState } from "react";
import { useAlarm } from "@/src/context/AlarmContext";
import WarriorCard from "@/src/components/WarriorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Bell, Shield, Zap, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function RitualsScreen() {
  const { alarmTime, setAlarmTime, isAlarmActive, earlySolve, triggerNotification } = useAlarm();
  const [tempTime, setTempTime] = useState(alarmTime || "06:00");
  const [showEarlySolve, setShowEarlySolve] = useState(false);
  const [earlyAnswer, setEarlyAnswer] = useState("");
  const [earlyPuzzle, setEarlyPuzzle] = useState({ q: "15 + 27", a: 42 });

  const handleSave = () => {
    setAlarmTime(tempTime);
  };

  const handleDisable = () => {
    setAlarmTime(null);
  };

  const generateEarlyPuzzle = () => {
    const ops = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1, n2, ans;

    if (op === "+") {
      n1 = Math.floor(Math.random() * 30) + 20;
      n2 = Math.floor(Math.random() * 30) + 20;
      ans = n1 + n2;
    } else if (op === "-") {
      n1 = Math.floor(Math.random() * 60) + 40;
      n2 = Math.floor(Math.random() * 30) + 10;
      ans = n1 - n2;
    } else {
      n1 = Math.floor(Math.random() * 10) + 3;
      n2 = Math.floor(Math.random() * 10) + 3;
      ans = n1 * n2;
    }

    setEarlyPuzzle({ q: `${n1} ${op} ${n2}`, a: ans });
    setShowEarlySolve(true);
    setEarlyAnswer("");
  };

  const checkEarlySolve = () => {
    if (parseInt(earlyAnswer) === earlyPuzzle.a) {
      earlySolve();
      setShowEarlySolve(false);
    } else {
      setEarlyAnswer("");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-warrior-red">Morning Rituals</h2>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Master your dawn, master your life</p>
      </div>

      {/* Alarm Setting Card */}
      <WarriorCard title="The Awakening" glow={isAlarmActive}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isAlarmActive ? "bg-warrior-red/20 text-warrior-red" : "bg-warrior-metal/20 text-muted-foreground"}`}>
                <Clock size={24} />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Alarm Status</Label>
                <p className="text-sm font-heading text-white">{isAlarmActive ? "ACTIVE" : "INACTIVE"}</p>
              </div>
            </div>
            <Switch 
              checked={isAlarmActive} 
              onCheckedChange={(checked) => !checked && handleDisable()}
              className="data-[state=checked]:bg-warrior-red"
            />
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type="time"
                value={tempTime}
                onChange={(e) => setTempTime(e.target.value)}
                className="bg-warrior-dark border-warrior-metal text-center text-5xl font-heading h-24 focus:border-warrior-red transition-all"
              />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
                Set Time
              </div>
            </div>

            <Button 
              onClick={handleSave}
              className="w-full bg-warrior-metal hover:bg-warrior-red text-white font-heading py-6 warrior-btn transition-all"
            >
              FORGE RITUAL
            </Button>
          </div>

          <div className="flex items-start gap-3 p-3 bg-black/40 border border-warrior-metal/30 rounded-lg">
            <AlertCircle size={16} className="text-warrior-orange shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              "The alarm will only silence once the Warrior's Cipher is broken. No snooze, no surrender."
            </p>
          </div>
        </div>
      </WarriorCard>

      {/* Early Solve Section */}
      <AnimatePresence>
        {isAlarmActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <WarriorCard title="Pre-emptive Strike" orange>
              <div className="space-y-4">
                {!showEarlySolve ? (
                  <div className="space-y-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                      Already awake? Solve the cipher now to cancel the alarm.
                    </p>
                    <Button 
                      onClick={generateEarlyPuzzle}
                      variant="outline"
                      className="w-full border-warrior-orange text-warrior-orange hover:bg-warrior-orange/10 font-heading py-6"
                    >
                      <Zap size={18} className="mr-2" /> BEGIN EARLY TRIAL
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Solve to Cancel</p>
                      <div className="text-3xl font-heading text-white py-2 border-y border-warrior-metal">
                        {earlyPuzzle.q} = ?
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={earlyAnswer}
                        onChange={(e) => setEarlyAnswer(e.target.value)}
                        placeholder="?"
                        className="bg-warrior-dark border-warrior-metal text-center text-2xl font-heading h-14"
                      />
                      <Button 
                        onClick={checkEarlySolve}
                        className="bg-warrior-orange text-white font-heading px-6"
                      >
                        STRIKE
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowEarlySolve(false)}
                      className="w-full text-[10px] text-muted-foreground uppercase"
                    >
                      Cancel Trial
                    </Button>
                  </div>
                )}
              </div>
            </WarriorCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Info */}
      <div className="flex items-center gap-3 p-4 border border-warrior-metal/20 rounded-xl bg-warrior-metal/5">
        <Bell size={20} className="text-warrior-gold" />
        <div className="flex-1">
          <p className="text-xs font-bold text-white uppercase tracking-tighter">Battle Warning</p>
          <p className="text-[10px] text-muted-foreground">You will be notified 15 minutes before the alarm triggers.</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => triggerNotification("Warrior Test", "The notification system is operational.")}
          className="text-[8px] border border-warrior-metal/30 h-6 px-2"
        >
          TEST
        </Button>
      </div>
    </div>
  );
}
