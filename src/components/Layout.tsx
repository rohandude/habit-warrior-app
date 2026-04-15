import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Sword, Shield, Trophy, User } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

export default function Layout({ children, currentScreen, onScreenChange }: LayoutProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "challenge", icon: Sword, label: "Battle" },
    { id: "levels", icon: Shield, label: "Rank" },
    { id: "rewards", icon: Trophy, label: "Loot" },
    { id: "profile", icon: User, label: "Hero" },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background overflow-hidden relative border-x border-warrior-metal shadow-2xl">
      {/* Header Area */}
      <header className="p-4 border-b-3 border-warrior-red flex justify-between items-center bg-gradient-to-b from-[#1e1a19] to-[#0a0808] z-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-warrior-red rank-hexagon flex items-center justify-center font-heading text-xl text-white warrior-glow">
            12
          </div>
          <div className="rank-info">
            <h1 className="text-lg font-heading text-warrior-gold tracking-widest leading-none">Warrior Habit</h1>
            <div className="w-32 h-2 bg-[#222] rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-warrior-orange to-warrior-red w-3/4 warrior-glow" />
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest">Kingdom Rank</p>
          <span className="text-xs font-heading text-warrior-orange">Top 3% Global</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 z-20">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`flex-1 flex flex-col items-center justify-center h-16 bg-warrior-surface border-2 transition-all duration-300 ${
                isActive 
                  ? "text-warrior-orange border-warrior-orange bg-warrior-orange/5" 
                  : "text-muted-foreground border-warrior-metal hover:text-white hover:border-white/20"
              }`}
            >
              <span className="text-[10px] uppercase font-heading tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-warrior-red to-transparent opacity-50" />
    </div>
  );
}
