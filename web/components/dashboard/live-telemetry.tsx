"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, TrendingUp, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useSensory } from '@/lib/hooks/use-sensory';

interface TelemetryEvent {
  id: string;
  type: 'traffic' | 'conversion' | 'milestone';
  label: string;
  value: string;
  timestamp: string;
}

const EVENT_POOL = [
  { type: 'traffic', label: 'Qualified Start', value: '0x32A...F2' },
  { type: 'conversion', label: 'ROI Lift', value: '+12.4%' },
  { type: 'milestone', label: 'Winner Found', value: 'Variant B' },
  { type: 'traffic', label: 'New Player', value: 'from US/TikTok' },
  { type: 'conversion', label: 'CTR Spike', value: '+8.2%' },
  { type: 'milestone', label: 'Payload Ready', value: 'Pack #12' },
];

export function LiveTelemetry() {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const { trigger } = useSensory();

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      const newEvent: TelemetryEvent = {
        ...randomEvent,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      } as TelemetryEvent;

      setEvents(prev => [newEvent, ...prev].slice(0, 5));
      trigger('ping');
    }, 4000 + Math.random() * 6000);

    return () => clearInterval(interval);
  }, [trigger]);

  return (
    <GlassCard className="p-4 overflow-hidden border-indigo-500/20 bg-black/40">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300">Live Telemetry</h3>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 font-mono">
          SYNCED
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              className="group flex items-center gap-3 text-xs"
            >
              <div className={`p-1.5 rounded-lg ${
                event.type === 'traffic' ? 'bg-blue-500/20 text-blue-400' :
                event.type === 'conversion' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {event.type === 'traffic' && <Users className="w-3.5 h-3.5" />}
                {event.type === 'conversion' && <TrendingUp className="w-3.5 h-3.5" />}
                {event.type === 'milestone' && <Zap className="w-3.5 h-3.5" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-white/70 font-medium truncate">{event.label}</span>
                  <span className="text-[10px] text-white/30 font-mono">{event.timestamp}</span>
                </div>
                <div className="text-[10px] font-mono text-white/40 truncate">{event.value}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="py-8 text-center text-white/20 text-xs italic">
            Awaiting incoming telemetry...
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
              className="w-1 h-3 bg-indigo-500/40 rounded-full"
            />
          ))}
        </div>
        <span className="text-[10px] text-white/20 font-mono uppercase">Node: US-EAST-1</span>
      </div>
    </GlassCard>
  );
}
