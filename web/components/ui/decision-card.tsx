"use client";

import { GlassCard } from "./glass-card";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, ArrowRight } from "lucide-react";

export type DecisionType = 'winner' | 'insight' | 'action';

interface DecisionCardProps {
  type: DecisionType;
  title: string;
  description: string;
  metric?: string;
  image?: string;
  onAction?: () => void;
  className?: string;
}

export function DecisionCard({ type, title, description, metric, image, onAction, className }: DecisionCardProps) {
  return (
    <GlassCard 
      className={cn(
        "p-6 flex gap-4 items-start relative transition-all duration-300",
        type === 'winner' && "border-green-500/30 bg-green-500/5 hover:border-green-500/50 hover:bg-green-500/10",
        type === 'action' && "cursor-pointer hover:scale-[1.02] border-indigo-500/30",
        className
      )}
      onClick={type === 'action' ? onAction : undefined}
    >
      {/* Icon/Image Section */}
      <div className="shrink-0 relative">
        {image ? (
            <div className="w-16 h-20 rounded-lg bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${image})` }} />
        ) : (
            <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border border-white/10",
                type === 'winner' ? "bg-green-500/20 text-green-400" :
                type === 'insight' ? "bg-cyan-500/20 text-cyan-400" :
                "bg-indigo-500/20 text-indigo-400 animate-pulse"
            )}>
                {type === 'winner' && <Trophy className="w-6 h-6" />}
                {type === 'insight' && <TrendingUp className="w-6 h-6" />}
                {type === 'action' && <ArrowRight className="w-6 h-6" />}
            </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
            <h3 className={cn("font-semibold text-lg", type === 'winner' ? "text-green-400" : "text-white")}>
                {title}
            </h3>
            {metric && (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-mono text-white/80 border border-white/10">
                    {metric}
                </span>
            )}
        </div>
        <p className="text-sm text-white/60 leading-relaxed">
            {description}
        </p>
        
        {type === 'action' && (
            <div className="pt-2 text-indigo-400 text-sm font-medium flex items-center gap-1 group">
                Execute Action <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
        )}
      </div>
    </GlassCard>
  );
}
