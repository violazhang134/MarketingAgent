"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  gradient?: boolean;
  spotlight?: boolean;
  children?: React.ReactNode;
}

export function GlassCard({ className, children, gradient, spotlight = true, ...props }: GlassCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the motion
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Create the gradient string using useTransform to avoid conditional hook calls
  const background = useTransform(
    [springX, springY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(129, 140, 248, 0.15), transparent 80%)`
  );

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden group rounded-3xl border border-glass-border bg-glass backdrop-blur-xl transition-all duration-300",
        "hover:bg-glass-hover hover:border-white/20 hover:shadow-2xl hover:shadow-indigo-500/20",
        className
      )}
      {...props}
    >
      {/* Spotlight Effect - Visible only on hover via group-hover */}
      {spotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{ background }}
        />
      )}

      {gradient && (
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/0 blur-3xl pointer-events-none" />
      )}
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
