import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Sword, Shield, Trophy, User, Clock } from "lucide-react";
import { useXP } from "@/src/context/XPContext";

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

export default function Layout({ children, currentScreen, onScreenChange }: LayoutProps) {
  const { level, currentRank, progressToNext, xp } = useXP();
  
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "rituals", icon: Clock, label: "Rituals" },
    { id: "challenge", icon: Sword, label: "Habits", isCenter: true },
    { id: "levels", icon: Shield, label: "Rank" },
    { id: "profile", icon: User, label: "Hero" },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background overflow-hidden relative border-x border-warrior-metal shadow-2xl">
      {/* Header Area */}
      <header className="p-4 border-b-3 border-warrior-red flex justify-between items-center bg-gradient-to-b from-[#1e1a19] to-[#0a0808] z-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-warrior-red rank-hexagon flex items-center justify-center font-heading text-xl text-white warrior-glow">
            {level}
          </div>
          <div className="rank-info">
            <h1 className="text-lg font-heading text-warrior-gold tracking-widest leading-none">{currentRank.name}</h1>
            <div className="w-32 h-2 bg-[#222] rounded-full mt-1 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                className="h-full bg-gradient-to-r from-warrior-orange to-warrior-red warrior-glow" 
              />
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest">Total Honor</p>
          <span className="text-xs font-heading text-warrior-orange">{xp} XP</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-4 pointer-events-none">
        <nav className="bg-[#1a1614]/95 backdrop-blur-md border border-warrior-metal/50 rounded-2xl h-16 flex items-center justify-around relative pointer-events-auto shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <div key={item.id} className="relative -mt-12">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onScreenChange(item.id)}
                    className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
                      isActive 
                        ? "bg-warrior-red text-white warrior-glow rotate-45" 
                        : "bg-warrior-metal text-warrior-gold border-2 border-warrior-gold/30 rotate-45"
                    }`}
                  >
                    <div className="-rotate-45 flex flex-col items-center">
                      <Icon size={24} />
                      <span className="text-[8px] font-bold uppercase mt-0.5">{item.label}</span>
                    </div>
                  </motion.button>
                  {isActive && (
                    <motion.div 
                      layoutId="active-glow"
                      className="absolute -inset-2 bg-warrior-red/20 blur-xl rounded-full -z-10"
                    />
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`flex flex-col items-center justify-center w-14 h-full transition-all duration-300 relative ${
                  isActive ? "text-warrior-orange" : "text-muted-foreground hover:text-white"
                }`}
              >
                <Icon size={20} className={isActive ? "scale-110" : ""} />
                <span className={`text-[9px] font-bold uppercase mt-1 tracking-tighter ${isActive ? "opacity-100" : "opacity-60"}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -bottom-1 w-1 h-1 bg-warrior-orange rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-warrior-red to-transparent opacity-50" />
    </div>
  );
}
