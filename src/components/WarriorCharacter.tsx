import React from "react";
import { motion } from "motion/react";
import { Shield, Sword, Flame, Zap, Crown, Skull, Target } from "lucide-react";
import { RankStyle } from "@/src/constants/rankStyles";

interface WarriorCharacterProps {
  style: RankStyle;
}

export default function WarriorCharacter({ style }: WarriorCharacterProps) {
  const { weapon, aura, armor, color } = style;

  const renderAura = () => {
    if (aura === 'none') return null;

    const auraColors: Record<string, string> = {
      glow: `rgba(255, 255, 255, 0.2)`,
      smoke: `rgba(100, 100, 100, 0.3)`,
      fire: `rgba(255, 49, 49, 0.4)`,
      lightning: `rgba(0, 200, 255, 0.4)`,
      mythic: `rgba(255, 49, 49, 0.6)`,
    };

    return (
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: aura === 'mythic' ? [0, 360] : 0,
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-80 h-80 rounded-full blur-[60px]"
          style={{ backgroundColor: auraColors[aura] || color }}
        />
        {(aura === 'fire' || aura === 'mythic') && (
           <div className="absolute inset-0 flex items-center justify-center">
             {[...Array(12)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ y: 0, opacity: 0, scale: 0.5, x: (Math.random() - 0.5) * 100 }}
                 animate={{ 
                   y: -150, 
                   opacity: [0, 0.8, 0], 
                   scale: [0.5, 1.2, 0.2],
                   x: (Math.random() - 0.5) * 150
                 }}
                 transition={{
                   duration: 2 + Math.random() * 2,
                   repeat: Infinity,
                   delay: i * 0.3,
                 }}
                 className={`absolute w-3 h-3 rounded-full blur-xl ${aura === 'fire' ? 'bg-warrior-red' : 'bg-warrior-orange'}`}
               />
             ))}
           </div>
        )}
        {aura === 'lightning' && (
           <div className="absolute inset-0 flex items-center justify-center">
             {[...Array(4)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ 
                   opacity: [0, 1, 0, 1, 0],
                   scale: [1, 1.5, 1],
                 }}
                 transition={{
                   duration: 0.2,
                   repeat: Infinity,
                   repeatDelay: Math.random() * 2,
                   delay: i * 0.5,
                 }}
                 className="absolute w-1 h-32 bg-blue-400 blur-sm rotate-45"
                 style={{ left: `${20 + i * 20}%`, top: `${10 + i * 10}%` }}
               />
             ))}
           </div>
        )}
      </div>
    );
  };

  const WarriorSVG = () => {
    const armorColors: Record<string, string> = {
      none: '#2a2a2a',
      leather: '#5d4037',
      iron: '#455a64',
      steel: '#78909c',
      gold: '#ffd700',
      mythic: '#ff3131',
    };

    const currentArmorColor = armorColors[armor] || armorColors.none;
    const isMythic = armor === 'mythic';
    const isGold = armor === 'gold';

    return (
      <svg viewBox="0 0 200 240" className="w-64 h-80 drop-shadow-2xl">
        <defs>
          <linearGradient id="armorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: currentArmorColor, stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: currentArmorColor, stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Legs */}
        <g className="legs">
          <rect x="75" y="180" width="20" height="50" fill="#1a1a1a" rx="5" />
          <rect x="105" y="180" width="20" height="50" fill="#1a1a1a" rx="5" />
          {/* Greaves */}
          <path d="M75 190 L95 190 L95 220 L75 220 Z" fill="url(#armorGradient)" />
          <path d="M105 190 L125 190 L125 220 L105 220 Z" fill="url(#armorGradient)" />
        </g>

        {/* Torso / Chestplate */}
        <g className="torso">
          <path d="M60 80 L140 80 L130 180 L70 180 Z" fill="url(#armorGradient)" />
          {/* Chestplate Details */}
          <path d="M75 95 L125 95 L120 115 L80 115 Z" fill="rgba(255,255,255,0.1)" />
          <path d="M85 130 L115 130 L112 150 L88 150 Z" fill="rgba(0,0,0,0.2)" />
          {isMythic && <circle cx="100" cy="120" r="8" fill="#ff3131" filter="url(#glow)" />}
          {isGold && <circle cx="100" cy="120" r="8" fill="#ffd700" filter="url(#glow)" />}
        </g>

        {/* Pauldrons (Shoulders) */}
        <g className="pauldrons">
          <path d="M50 75 Q40 75 45 110 L70 100 Q75 75 50 75" fill="url(#armorGradient)" />
          <path d="M150 75 Q160 75 155 110 L130 100 Q125 75 150 75" fill="url(#armorGradient)" />
        </g>

        {/* Head / Helmet */}
        <g className="head">
          <circle cx="100" cy="50" r="25" fill="#1a1a1a" />
          <path d="M75 50 Q75 25 100 25 Q125 25 125 50 L125 65 Q125 75 100 75 Q75 75 75 65 Z" fill="url(#armorGradient)" />
          {/* Visor */}
          <rect x="85" y="45" width="30" height="8" fill="#000" rx="2" />
          {/* Plume for high ranks */}
          {(isMythic || isGold) && (
            <path d="M100 25 Q100 0 130 10" stroke={isMythic ? "#ff3131" : "#ffd700"} strokeWidth="8" fill="none" strokeLinecap="round" />
          )}
        </g>

        {/* Arms */}
        <g className="arms">
          {/* Left Arm (Holding Shield) */}
          <rect x="40" y="100" width="15" height="60" fill="#1a1a1a" rx="5" transform="rotate(10 40 100)" />
          {/* Right Arm (Holding Sword) */}
          <rect x="145" y="100" width="15" height="60" fill="#1a1a1a" rx="5" transform="rotate(-10 145 100)" />
        </g>

        {/* Shield */}
        <g className="shield" transform="translate(20, 110) rotate(-5)">
          <path d="M0 0 L40 0 L35 50 Q20 65 5 50 Z" fill="url(#armorGradient)" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
          <path d="M10 10 L30 10 L28 40 Q20 50 12 40 Z" fill="rgba(0,0,0,0.1)" />
          {/* Crest */}
          <path d="M20 15 L25 25 L15 25 Z" fill={color} />
        </g>

        {/* Sword */}
        <g className="sword" transform="translate(160, 140) rotate(150)">
          {/* Blade */}
          <path d="M0 0 L6 0 L3 80 Z" fill={weapon === 'mythic-blade' ? '#ff3131' : (weapon === 'flaming-sword' ? '#ff8c00' : '#e0e0e0')} filter={weapon.includes('sword') || weapon === 'mythic-blade' ? "url(#glow)" : "none"} />
          {/* Crossguard */}
          <rect x="-5" y="0" width="16" height="4" fill="#4a423f" rx="1" />
          {/* Hilt */}
          <rect x="1" y="-15" width="4" height="15" fill="#2a2a2a" rx="1" />
          {/* Pommel */}
          <circle cx="3" cy="-17" r="3" fill="#4a423f" />
        </g>
      </svg>
    );
  };

  return (
    <div className="relative w-64 h-96 flex flex-col items-center justify-center">
      {renderAura()}
      
      {/* Warrior Body */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <WarriorSVG />
        </motion.div>
      </motion.div>

      {/* Shadow */}
      <div className="absolute bottom-4 w-32 h-6 bg-black/60 blur-xl rounded-full -z-10" />
    </div>
  );
}
