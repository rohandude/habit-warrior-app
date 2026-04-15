import { Shield, Sword, Trophy, Zap, Flame, Crown, Skull } from "lucide-react";

export interface RankStyle {
  name: string;
  color: string;
  bgClass: string;
  cardClass: string;
  glowClass: string;
  icon: any;
  animationClass?: string;
  // Warrior Visuals
  weapon: 'stick' | 'sword' | 'greatsword' | 'flaming-sword' | 'mythic-blade';
  aura: 'none' | 'glow' | 'smoke' | 'fire' | 'lightning' | 'mythic';
  armor: 'none' | 'leather' | 'iron' | 'steel' | 'gold' | 'mythic';
}

export const RANK_STYLES: Record<string, RankStyle> = {
  "Novice Recruit": {
    name: "Novice Recruit",
    color: "#888888",
    bgClass: "bg-[#1a1a1a]",
    cardClass: "border-warrior-metal/30 bg-warrior-metal/5",
    glowClass: "",
    icon: Shield,
    weapon: 'stick',
    aura: 'none',
    armor: 'none',
  },
  "Iron Vanguard": {
    name: "Iron Vanguard",
    color: "#a1a1a1",
    bgClass: "bg-gradient-to-b from-[#1e1e1e] to-[#121212]",
    cardClass: "border-warrior-metal/50 bg-warrior-metal/10",
    glowClass: "shadow-[0_0_10px_rgba(161,161,161,0.1)]",
    icon: Sword,
    weapon: 'sword',
    aura: 'none',
    armor: 'leather',
  },
  "Steel Sentinel": {
    name: "Steel Sentinel",
    color: "#e2c08d",
    bgClass: "bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f]",
    cardClass: "border-warrior-gold/20 bg-warrior-gold/5",
    glowClass: "shadow-[0_0_15px_rgba(226,192,141,0.15)]",
    icon: Shield,
    weapon: 'sword',
    aura: 'glow',
    armor: 'iron',
  },
  "Bronze Berserker": {
    name: "Bronze Berserker",
    color: "#cd7f32",
    bgClass: "bg-gradient-to-br from-[#3d2a1a] via-[#1a1a1a] to-[#0a0a0a]",
    cardClass: "border-[#cd7f32]/30 bg-[#cd7f32]/5",
    glowClass: "shadow-[0_0_20px_rgba(205,127,50,0.2)]",
    icon: Flame,
    weapon: 'greatsword',
    aura: 'smoke',
    armor: 'steel',
  },
  "Silver Slayer": {
    name: "Silver Slayer",
    color: "#c0c0c0",
    bgClass: "bg-gradient-to-br from-[#4a4a4a] via-[#1a1a1a] to-[#000000]",
    cardClass: "border-white/20 bg-white/5",
    glowClass: "shadow-[0_0_25px_rgba(192,192,192,0.25)]",
    icon: Zap,
    weapon: 'greatsword',
    aura: 'lightning',
    armor: 'steel',
  },
  "Golden Gladiator": {
    name: "Golden Gladiator",
    color: "#ffd700",
    bgClass: "bg-gradient-to-br from-[#4a3a00] via-[#1a1a1a] to-[#000000]",
    cardClass: "border-warrior-gold/40 bg-warrior-gold/10",
    glowClass: "shadow-[0_0_30px_rgba(255,215,0,0.3)]",
    icon: Crown,
    animationClass: "animate-pulse",
    weapon: 'flaming-sword',
    aura: 'fire',
    armor: 'gold',
  },
  "Mythic Warlord": {
    name: "Mythic Warlord",
    color: "#ff3131",
    bgClass: "bg-gradient-to-br from-[#4a0000] via-[#0a0000] to-[#000000]",
    cardClass: "border-warrior-red/50 bg-warrior-red/10",
    glowClass: "shadow-[0_0_40px_rgba(255,49,49,0.4)]",
    icon: Skull,
    animationClass: "animate-pulse shadow-[0_0_20px_rgba(255,49,49,0.2)]",
    weapon: 'mythic-blade',
    aura: 'mythic',
    armor: 'mythic',
  },
};
