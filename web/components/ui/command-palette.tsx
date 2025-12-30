"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Rocket, Zap, BookOpen, LayoutTemplate,
  RefreshCcw, Terminal, ArrowRight, Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSensory } from '@/lib/hooks/use-sensory';
import { useCampaignStore } from '@/lib/stores/campaign-store';

const ACTIONS = [
  { id: 'agent', label: 'Start Agent Mode', icon: Zap, color: 'text-amber-400', href: '/agent' },
  { id: 'expert', label: 'Expert Analysis', icon: Search, color: 'text-emerald-400', href: '/launch/report' },
  { id: 'creative', label: 'Creative Studio', icon: Rocket, color: 'text-indigo-400', href: '/create/studio' },
  { id: 'canvas', label: 'Research Canvas', icon: LayoutTemplate, color: 'text-cyan-400', href: '/canvas' },
  { id: 'playbook', label: 'Growth Playbook', icon: BookOpen, color: 'text-purple-400', href: '/playbook' },
  { id: 'reset', label: 'Reset Agent State', icon: RefreshCcw, color: 'text-rose-400', action: 'reset' },
  { id: 'dev', label: 'Open Dev Console', icon: Terminal, color: 'text-white/40', href: '/docs' },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { trigger } = useSensory();
  const { setPhase } = useCampaignStore();

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) trigger('ping');
      return !prev;
    });
  }, [trigger]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  const filteredActions = ACTIONS.filter(a => 
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (a: typeof ACTIONS[0]) => {
    trigger('tap');
    if (a.action === 'reset') {
      setPhase('idle');
      router.push('/');
    } else if (a.href) {
      router.push(a.href);
    }
    setIsOpen(false);
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
          >
            <div className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
              {/* SearchBar */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
                <Search className="w-5 h-5 text-white/30" />
                <input 
                  autoFocus
                  placeholder="What are we doing today?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/20 text-sm"
                />
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-white/40 border border-white/10 font-mono">ESC</span>
                </div>
              </div>

              {/* Results */}
              <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">
                  Suggested Actions
                </div>
                {filteredActions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleAction(a)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-white/5 ${a.color} group-hover:scale-110 transition-transform`}>
                        <a.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-white/70 group-hover:text-white">{a.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/0 group-hover:text-white/20 transition-all" />
                  </button>
                ))}

                {filteredActions.length === 0 && (
                  <div className="py-12 text-center">
                    <Shield className="w-8 h-8 text-white/10 mx-auto mb-3" />
                    <p className="text-sm text-white/20">No commands found for &quot;{search}&quot;</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 font-mono">
                <div className="flex gap-4">
                  <span>ENTER to Select</span>
                  <span>↑↓ to Navigate</span>
                </div>
                <div className="flex items-center gap-1 text-indigo-400">
                  <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                  Sentient Mode Active
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
