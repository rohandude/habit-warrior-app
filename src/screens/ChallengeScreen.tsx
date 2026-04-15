import React, { useState, useEffect } from "react";
import WarriorCard from "@/src/components/WarriorCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Clock, AlertCircle, Sword, Flame, Plus, Trash2, Trophy, Edit2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHabits, HabitType } from "@/src/context/HabitContext";
import { useXP } from "@/src/context/XPContext";
import { useAudioManager } from "@/src/context/AudioManagerContext";
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, YAxis, Tooltip } from "recharts";

export default function ChallengeScreen() {
  const { habits, addHabit, deleteHabit, updateHabit, getHabitStats } = useHabits();
  const { completeTask, isTaskCompleted } = useXP();
  const { playSfx } = useAudioManager();
  const [newHabitText, setNewHabitText] = useState("");
  const [newHabitType, setNewHabitType] = useState<HabitType>("simple");
  const [newTargetValue, setNewTargetValue] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ text: "", days: [] as number[], type: "simple" as HabitType, targetValue: "", unit: "" });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const DAYS = [
    { id: 1, label: "M" },
    { id: 2, label: "T" },
    { id: 3, label: "W" },
    { id: 4, label: "T" },
    { id: 5, label: "F" },
    { id: 6, label: "S" },
    { id: 0, label: "S" },
  ];

  const toggleDay = (dayId: number, isEdit = false) => {
    if (isEdit) {
      setEditForm(prev => ({
        ...prev,
        days: prev.days.includes(dayId) 
          ? prev.days.filter(d => d !== dayId) 
          : [...prev.days, dayId]
      }));
    } else {
      setSelectedDays(prev => 
        prev.includes(dayId) 
          ? prev.filter(d => d !== dayId) 
          : [...prev, dayId]
      );
    }
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitText.trim()) {
      addHabit(
        newHabitText.trim(), 
        selectedDays, 
        newHabitType, 
        newHabitType === "target" ? Number(newTargetValue) : undefined,
        newHabitType === "target" ? newUnit : undefined
      );
      setNewHabitText("");
      setNewTargetValue("");
      setNewUnit("");
      setNewHabitType("simple");
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const startEditing = (habit: any) => {
    setEditingHabit(habit.id);
    setEditForm({ 
      text: habit.text, 
      days: [...habit.days], 
      type: habit.type, 
      targetValue: habit.targetValue?.toString() || "", 
      unit: habit.unit || "" 
    });
  };

  const saveEdit = () => {
    if (editingHabit && editForm.text.trim()) {
      updateHabit(
        editingHabit, 
        editForm.text.trim(), 
        editForm.days, 
        editForm.type,
        editForm.type === "target" ? Number(editForm.targetValue) : undefined,
        editForm.type === "target" ? editForm.unit : undefined
      );
      setEditingHabit(null);
    }
  };

  const today = new Date().getDay();

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-white">Habit Mastery</h2>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Forge your daily disciplines</p>
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
          
          <div className="flex gap-2">
            <Button 
              type="button"
              onClick={() => setNewHabitType("simple")}
              variant={newHabitType === "simple" ? "default" : "outline"}
              className={`flex-1 h-10 text-[10px] font-bold uppercase tracking-widest ${newHabitType === "simple" ? "bg-warrior-red" : "border-warrior-metal"}`}
            >
              Simple
            </Button>
            <Button 
              type="button"
              onClick={() => setNewHabitType("target")}
              variant={newHabitType === "target" ? "default" : "outline"}
              className={`flex-1 h-10 text-[10px] font-bold uppercase tracking-widest ${newHabitType === "target" ? "bg-warrior-red" : "border-warrior-metal"}`}
            >
              Target
            </Button>
          </div>

          {newHabitType === "target" && (
            <div className="flex gap-2">
              <Input 
                type="number"
                value={newTargetValue}
                onChange={(e) => setNewTargetValue(e.target.value)}
                placeholder="Target (e.g. 5)"
                className="bg-black/40 border-warrior-metal text-sm h-10 flex-1"
              />
              <Input 
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="Unit (e.g. km)"
                className="bg-black/40 border-warrior-metal text-sm h-10 flex-1"
              />
            </div>
          )}

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

      {/* Habit List Management */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">All Disciplines</h3>
          <span className="text-[10px] font-mono text-warrior-gold">{habits.length} TOTAL</span>
        </div>
        
        <AnimatePresence initial={false}>
          {habits.map((habit, i) => {
            const isActiveToday = habit.days.includes(today);
            const stats = getHabitStats(habit.id);
            const isExpanded = expandedHabit === habit.id;
            const isEditing = editingHabit === habit.id;
            const isConfirmingDelete = confirmDelete === habit.id;
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
              >
                <WarriorCard className={`p-0 ${!isActiveToday ? "opacity-60" : ""}`}>
                  <div className="p-4 space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <Input 
                          value={editForm.text}
                          onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
                          className="bg-black/40 border-warrior-red text-sm"
                        />
                        
                        <div className="flex gap-2">
                          <Button 
                            type="button"
                            onClick={() => setEditForm(prev => ({ ...prev, type: "simple" }))}
                            variant={editForm.type === "simple" ? "default" : "outline"}
                            className={`flex-1 h-8 text-[9px] font-bold uppercase tracking-widest ${editForm.type === "simple" ? "bg-warrior-red" : "border-warrior-metal"}`}
                          >
                            Simple
                          </Button>
                          <Button 
                            type="button"
                            onClick={() => setEditForm(prev => ({ ...prev, type: "target" }))}
                            variant={editForm.type === "target" ? "default" : "outline"}
                            className={`flex-1 h-8 text-[9px] font-bold uppercase tracking-widest ${editForm.type === "target" ? "bg-warrior-red" : "border-warrior-metal"}`}
                          >
                            Target
                          </Button>
                        </div>

                        {editForm.type === "target" && (
                          <div className="flex gap-2">
                            <Input 
                              type="number"
                              value={editForm.targetValue}
                              onChange={(e) => setEditForm(prev => ({ ...prev, targetValue: e.target.value }))}
                              placeholder="Target"
                              className="bg-black/40 border-warrior-metal text-xs h-8 flex-1"
                            />
                            <Input 
                              value={editForm.unit}
                              onChange={(e) => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
                              placeholder="Unit"
                              className="bg-black/40 border-warrior-metal text-xs h-8 flex-1"
                            />
                          </div>
                        )}

                        <div className="flex justify-between gap-1">
                          {DAYS.map((day) => (
                            <button
                              key={day.id}
                              type="button"
                              onClick={() => toggleDay(day.id, true)}
                              className={`flex-1 h-8 rounded text-[9px] font-bold transition-all border ${
                                editForm.days.includes(day.id)
                                  ? "bg-warrior-red border-warrior-red text-white"
                                  : "bg-warrior-metal/30 border-warrior-metal text-muted-foreground"
                              }`}
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveEdit} className="flex-1 bg-warrior-red h-10 font-bold text-xs">
                            <Check size={16} className="mr-2" /> SAVE
                          </Button>
                          <Button onClick={() => setEditingHabit(null)} variant="outline" className="flex-1 border-warrior-metal h-10 font-bold text-xs">
                            <X size={16} className="mr-2" /> CANCEL
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 group">
                        <div className="flex-1" onClick={() => setExpandedHabit(isExpanded ? null : habit.id)}>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white">{habit.text}</p>
                            <span className="text-[8px] bg-warrior-metal/50 text-muted-foreground px-1 rounded uppercase font-bold">
                              {habit.type} {habit.type === "target" && `(${habit.targetValue}${habit.unit})`}
                            </span>
                            {!isActiveToday && (
                              <span className="text-[8px] bg-white/10 text-white/40 px-1 rounded uppercase font-bold">Inactive Today</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex gap-1">
                              {DAYS.map(d => (
                                <span key={d.id} className={`text-[7px] font-bold ${habit.days.includes(d.id) ? "text-warrior-red" : "text-muted-foreground/30"}`}>
                                  {d.label}
                                </span>
                              ))}
                            </div>
                            <span className="text-[9px] font-bold text-warrior-orange uppercase tracking-tighter">
                              {stats.completionRate}% Mastery
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1">
                              <Button 
                                size="sm" 
                                onClick={() => deleteHabit(habit.id)}
                                className="h-8 w-8 p-0 bg-warrior-red"
                              >
                                <Check size={14} />
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => setConfirmDelete(null)}
                                variant="outline"
                                className="h-8 w-8 p-0 border-warrior-metal"
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <button 
                                onClick={() => startEditing(habit)}
                                className="text-muted-foreground hover:text-white transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => setConfirmDelete(habit.id)}
                                className="text-muted-foreground hover:text-warrior-red transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Weekly Progress Graph */}
                    <AnimatePresence>
                      {isExpanded && !isEditing && (
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
                                    />
                                  ))}
                                </Bar>
                                <XAxis dataKey="date" hide />
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
    </div>
  );
}
