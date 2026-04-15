import React from "react";
import { motion } from "motion/react";

interface WarriorAvatarProps {
  level: number;
  isCelebrating?: boolean;
  className?: string;
}

export default function WarriorAvatar({ level, isCelebrating = false, className }: WarriorAvatarProps) {
  // Determine tier based on level
  const tier = level < 10 ? 1 : level < 30 ? 2 : level < 60 ? 3 : 4;

  // Animation variants
  const idleVariants = {
    idle: {
      y: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    celebrate: {
      scale: [1, 1.2, 1],
      rotate: [0, -5, 5, -5, 0],
      y: [0, -20, 0],
      transition: {
        duration: 0.5,
        repeat: 2,
      },
    },
  };

  const glowVariants = {
    idle: {
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Aura */}
      <motion.div
        variants={glowVariants}
        animate="idle"
        className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${
          tier >= 3 ? "bg-warrior-red" : "bg-warrior-orange"
        }`}
      />

      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10"
        variants={idleVariants}
        animate={isCelebrating ? "celebrate" : "idle"}
      >
        {/* Shadow */}
        <ellipse cx="100" cy="180" rx="40" ry="10" fill="black" opacity="0.3" />

        {/* Cape (Unlocked at Tier 2) */}
        {tier >= 2 && (
          <motion.path
            d="M60 60 L40 160 L100 180 L160 160 L140 60 Z"
            fill={tier >= 3 ? "#8b0000" : "#4a1a1a"}
            initial={{ scaleY: 0.8 }}
            animate={{ scaleY: [0.8, 0.85, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}

        {/* Body / Armor */}
        <path
          d="M70 60 L130 60 L140 140 L60 140 Z"
          fill="#1a1514"
          stroke="#4a423f"
          strokeWidth="2"
        />
        
        {/* Chest Plate Details */}
        <path d="M80 70 L120 70 L125 100 L75 100 Z" fill="#2a2524" />
        {tier >= 2 && (
          <motion.path
            d="M90 80 L110 80 L112 90 L88 90 Z"
            fill="none"
            stroke={tier >= 3 ? "#ff3131" : "#ff8c00"}
            strokeWidth="1"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Helmet */}
        <path
          d="M80 20 L120 20 L125 60 L75 60 Z"
          fill="#1a1514"
          stroke="#4a423f"
          strokeWidth="2"
        />
        {/* Visor / Eyes */}
        <motion.rect
          x="85" y="35" width="30" height="5"
          fill={tier >= 3 ? "#ff3131" : tier >= 2 ? "#ff8c00" : "#e2c08d"}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Arms */}
        <path d="M60 70 L40 110 L50 120 L70 80 Z" fill="#1a1514" stroke="#4a423f" />
        <path d="M140 70 L160 110 L150 120 L130 80 Z" fill="#1a1514" stroke="#4a423f" />

        {/* Weapon (Sword) */}
        <motion.g
          animate={isCelebrating ? { rotate: [0, -45, 0] } : {}}
          transition={{ duration: 0.5 }}
          style={{ originX: "155px", originY: "115px" }}
        >
          <path
            d="M155 40 L165 40 L165 115 L155 115 Z"
            fill={tier >= 4 ? "#ffcc33" : tier >= 3 ? "#f0f0f0" : "#4a423f"}
            stroke={tier >= 3 ? "#ff3131" : "none"}
            strokeWidth="1"
          />
          {/* Sword Glow */}
          {tier >= 3 && (
            <motion.path
              d="M155 40 L165 40 L165 115 L155 115 Z"
              fill="none"
              stroke="#ff3131"
              strokeWidth="2"
              blur="4"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          <path d="M145 110 L175 110 L175 115 L145 115 Z" fill="#2a2524" />
        </motion.g>

        {/* Shield (Tier 2+) */}
        {tier >= 2 && (
          <path
            d="M30 80 L60 80 L65 130 L45 150 L25 130 Z"
            fill="#1a1514"
            stroke={tier >= 3 ? "#ff3131" : "#4a423f"}
            strokeWidth="2"
          />
        )}

        {/* Wings of Fire (Tier 4) */}
        {tier >= 4 && (
          <motion.g opacity="0.6">
            <path d="M60 80 Q 0 40 20 140" fill="none" stroke="#ff3131" strokeWidth="4" />
            <path d="M140 80 Q 200 40 180 140" fill="none" stroke="#ff3131" strokeWidth="4" />
          </motion.g>
        )}
      </motion.svg>

      {/* Level Badge Overlay */}
      <div className="absolute -bottom-2 bg-warrior-red text-white text-[10px] font-heading px-2 py-0.5 warrior-glow warrior-btn">
        LVL {level}
      </div>
    </div>
  );
}
