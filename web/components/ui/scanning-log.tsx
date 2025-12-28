"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LOGS = [
  "Initializing crawler protocol v4.2...",
  "Connecting to global ad networks...",
  "Bypassing cache layers...",
  "Found 12,402 related ad creatives...",
  "Analyzing 'Hook' patterns in first 3s...",
  "Detecting high-performing color palettes...",
  "Cloning verified user reviews...",
  "Synthesizing win-rate probability models...",
  "Generating strategic recommendations..."
];

interface ScanningLogProps {
  onComplete?: () => void;
  className?: string;
}

export function ScanningLog({ onComplete, className }: ScanningLogProps) {
  const [lines, setLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < LOGS.length) {
        setLines(prev => [...prev, LOGS[index]]);
        index++;
        
        // Scroll to bottom
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setTimeout(() => onComplete?.(), 800);
      }
    }, 600); // Speed of logs

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={cn("font-mono text-xs leading-relaxed space-y-1 h-32 overflow-hidden relative", className)}>
       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
       <div ref={scrollRef} className="h-full overflow-y-auto flex flex-col justify-end pb-8">
          {lines.map((line, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-green-400/80"
             >
                <span className="text-white/20 mr-2">{`>`}</span>
                {line}
             </motion.div>
          ))}
          <motion.div 
               animate={{ opacity: [0, 1] }} 
               transition={{ repeat: Infinity, duration: 0.5 }}
               className="h-4 w-2 bg-green-500/50 mt-1"
          />
       </div>
    </div>
  );
}
