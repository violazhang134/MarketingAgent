"use client";

import { useState, useRef } from "react";
import { Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentInputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AgentInput({ onSubmit, placeholder = "Ask anything...", disabled }: AgentInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <motion.div
        animate={{
          boxShadow: isFocused 
            ? "0 0 0 1px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.2)" 
            : "0 0 0 0px rgba(0,0,0,0)",
        }}
        className={cn(
          "relative flex items-center gap-3 p-4 rounded-full",
          "bg-white/5 border border-white/10 backdrop-blur-xl",
          "transition-colors duration-300",
          isFocused ? "bg-white/10 border-indigo-500/30" : "hover:bg-white/10"
        )}
      >
        <Sparkles className={cn("w-5 h-5 text-indigo-400 transition-opacity", value ? "opacity-100" : "opacity-50")} />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-lg font-light"
        />

        <button
          type="submit"
          disabled={!value || disabled}
          className={cn(
            "p-2 rounded-full transition-all duration-300",
            value 
              ? "bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/25" 
              : "bg-white/5 text-white/20 cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </motion.div>
    </form>
  );
}
