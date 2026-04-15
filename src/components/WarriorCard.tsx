import React from "react";
import { cn } from "@/lib/utils";

interface WarriorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  glow?: boolean;
  orange?: boolean;
  className?: string;
  style?: React.CSSProperties;
  key?: React.Key;
}

export default function WarriorCard({ 
  children, 
  title, 
  glow = false, 
  orange = false,
  className,
  ...props 
}: WarriorCardProps) {
  return (
    <div 
      className={cn(
        "battle-border bg-warrior-surface panel-shadow overflow-hidden relative group",
        glow && (orange ? "warrior-glow-orange" : "warrior-glow"),
        className
      )}
      {...props}
    >
      {title && (
        <div className="px-4 py-2 border-b border-warrior-metal bg-black/40 flex justify-between items-center">
          <h3 className="text-sm font-heading tracking-widest text-warrior-gold">{title}</h3>
          <div className="h-0.5 w-8 bg-warrior-red/50" />
        </div>
      )}
      <div className="p-4 relative z-10">
        {children}
      </div>
    </div>
  );
}
