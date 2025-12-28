"use client";

import { motion } from "framer-motion";
import { Home, Zap, Rocket, BookOpen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'agent', label: 'Agent', icon: Zap, path: '/agent' },
  { id: 'feed', label: 'Decisions', icon: Rocket, path: '/feed' },
  { id: 'playbook', label: 'Playbook', icon: BookOpen, path: '/playbook' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center gap-1 shadow-2xl shadow-black/50 overflow-hidden"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={cn(
                "relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300",
                isActive ? "text-white" : "text-white/40 hover:text-white/60"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "text-indigo-400")} />
              <span className={cn("text-xs font-medium", !isActive && "hidden")}>{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute inset-0 bg-white/5 rounded-full z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
