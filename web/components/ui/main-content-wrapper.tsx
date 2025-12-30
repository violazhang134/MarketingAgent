"use client";

import { useAppStore } from "@/lib/stores/app-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useAppStore();

  return (
    <motion.main
      initial={false}
      animate={{ 
        paddingRight: isSidebarOpen ? 320 : 0 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 26 
      }}
      className={cn(
        "min-h-screen transition-all duration-300 ease-in-out relative z-0"
      )}
    >
      {children}
    </motion.main>
  );
}
