import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '@/lib/stores/canvas-store';
import { useAppStore } from '@/lib/stores/app-store';
import { PixelCharacter } from './markie/pixel-character';
import { useSensory } from '@/lib/hooks/use-sensory';

// ========================================
// Minion Squad 配置 - Phase 2 升级版
// ========================================
interface MinionPersonality {
  stiffness: number;
  damping: number;
  baseDelay: number;
  idleVariant: number;
  roamSpeed: number; // 漫游速度系数
}

interface Minion {
  id: number;
  name: string;
  variant: 'orange' | 'blue' | 'purple' | 'green' | 'pink' | 'black';
  personality: MinionPersonality;
}

const SQUAD: Minion[] = [
  { id: 1, name: 'Byte', variant: 'orange', personality: { stiffness: 12, damping: 20, baseDelay: 0, idleVariant: 0, roamSpeed: 1.0 } },
  { id: 2, name: 'Bit', variant: 'blue', personality: { stiffness: 18, damping: 15, baseDelay: 0.1, idleVariant: 1, roamSpeed: 1.5 } },
  { id: 3, name: 'Kilobyte', variant: 'green', personality: { stiffness: 8, damping: 25, baseDelay: 0.2, idleVariant: 2, roamSpeed: 0.7 } },
  { id: 4, name: 'Meg', variant: 'pink', personality: { stiffness: 15, damping: 18, baseDelay: 0.05, idleVariant: 3, roamSpeed: 1.3 } },
  { id: 5, name: 'Giga', variant: 'purple', personality: { stiffness: 14, damping: 20, baseDelay: 0.15, idleVariant: 4, roamSpeed: 1.1 } },
  { id: 6, name: 'Tera', variant: 'black', personality: { stiffness: 10, damping: 22, baseDelay: 0.25, idleVariant: 0, roamSpeed: 0.9 } },
];

// 画布角落区域定义 (用于空闲时漫游)
const ROAM_ZONES = [
  { name: 'topLeft', xRange: [-200, 100], yRange: [-100, 150] },
  { name: 'topRight', xRange: [800, 1200], yRange: [-100, 150] },
  { name: 'bottomLeft', xRange: [-200, 150], yRange: [400, 700] },
  { name: 'bottomRight', xRange: [800, 1200], yRange: [400, 700] },
];

const NODE_WIDTH = 280;
const NODE_HEIGHT = 150;

// 生成随机漫游目标
function getRandomRoamPosition(zoneIndex: number): { x: number; y: number } {
  const zone = ROAM_ZONES[zoneIndex % ROAM_ZONES.length];
  return {
    x: zone.xRange[0] + Math.random() * (zone.xRange[1] - zone.xRange[0]),
    y: zone.yRange[0] + Math.random() * (zone.yRange[1] - zone.yRange[0]),
  };
}

export function CanvasMarkie() {
  const { nodes, activeCanvasId } = useCanvasStore();
  const minionsEnabled = useAppStore((s) => s.minionsEnabled);
  
  const [pokedId, setPokedId] = useState<number | null>(null);
  const [bubbleState, setBubbleState] = useState<{ id: number; content: string; type: 'emoji' | 'text' } | null>(null);
  
  // Click Feedback: 连击计数 + 音效
  const [clickCounts, setClickCounts] = useState<Record<number, number>>({});
  const clickResetTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});
  const { trigger } = useSensory();
  
  // Refs (Must be top-level)
  const prevPositionsRef = useRef<Record<number, { x: number; y: number; time: number }>>({});
  const prevNodeStatusRef = useRef<Record<string, string>>({});
  // P0 修复: 追踪所有活跃的 setTimeout，便于组件卸载时清理
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // P0 修复: 安全的 setTimeout wrapper，自动追踪和清理
  const safeSetTimeout = (callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      timeoutsRef.current.delete(timeoutId);
      callback();
    }, delay);
    timeoutsRef.current.add(timeoutId);
    return timeoutId;
  };
  
  // 每个 Minion 的漫游位置 (独立状态)
  const [roamPositions, setRoamPositions] = useState<Record<number, { x: number; y: number }>>(() => {
    const initial: Record<number, { x: number; y: number }> = {};
    SQUAD.forEach((m, i) => {
      initial[m.id] = getRandomRoamPosition(i);
    });
    return initial;
  });

  // 分配状态：Map<NodeId, MinionId>
  const [taskAssignments, setTaskAssignments] = useState<Record<string, number>>({});

  // Dialogue Pool (must be before early return to satisfy Hooks rules)
  const DIALOGUE_POOL = useMemo(() => ({
    escape: ['Bye!!! 💨', 'Too much! 😵', 'I flee~ 🏃', 'Adios! 👋', 'Can\'t take it! 💀'],
    dizzy: ['Dizzy... 💫', 'Stars... ⭐', 'Whoaaa 🌀', 'My head! 🤯', 'Spinny... 😵‍💫'],
    annoyed: ['Stop it! 😤', 'Hey! 😠', 'Rude! 💢', 'Ow ow ow! 😣', 'Bully! 😾'],
    orange: ['Cookie? 🍪', 'Snack time? 🍩', 'Yummy? 😋', 'Munch! 🐹', 'Hungry! 🍕', 'Nom nom 😸'],
    blue: ['Play? 🎮', 'Tag! 🏃', 'Fun! 🎉', 'Game on! 🕹️', 'Race ya! 🏎️', 'Wheee! 🎠'],
    green: ['Ribbit! 🐸', 'Croak! 🪷', 'Lily pad! 🍃', 'Bug? 🪲', 'Pond? 💧', 'Hop hop 🦗'],
    pink: ['Candy! 🍬', 'Sweet! 🍭', 'Cuuute 💕', 'Sparkle! 💖', 'Love! 💗', 'Pinky! 🌸'],
    purple: ['Sparkle~ ✨', 'Magic! 🔮', 'Mystic 🌙', 'Cosmic! 🌌', 'Shiny~ 💎', 'Stardust ⭐'],
    black: ['... 🌑', 'Hmph 🖤', 'Whatever 😑', 'Zzz 💤', 'Meh 🫥', '*stares* 👁️'],
  }), []);

  // P0 修复: 组件卸载时清理所有 timeout
  useEffect(() => {
    const currentTimeouts = timeoutsRef.current; // 复制 ref 以避免 eslint 警告
    return () => {
      currentTimeouts.forEach(id => clearTimeout(id));
      currentTimeouts.clear();
    };
  }, []);

  const activeNodes = nodes.filter(n => n.canvasId === activeCanvasId);
  // Detect all running nodes, regardless of type (agent_step, analysis, insight, etc.)
  const runningNodes = useMemo(() => 
    activeNodes.filter(n => n.status === 'running'),
    [activeNodes]
  );

  // 1:1 任务分配逻辑
  useEffect(() => {
    // A. 清理：移除已完成节点的分配
    const runningIds = new Set(runningNodes.map(n => n.id));
    const currentAssignments = { ...taskAssignments };
    let hasChanges = false;

    Object.keys(currentAssignments).forEach(nodeId => {
      if (!runningIds.has(nodeId)) {
        delete currentAssignments[nodeId];
        hasChanges = true;
      }
    });

    // B. 分配：为新加入的 Running 节点分配空闲 Minion
    const assignedMinionIds = new Set(Object.values(currentAssignments));
    const freeMinions = SQUAD.filter(m => !assignedMinionIds.has(m.id)).map(m => m.id);

    runningNodes.forEach(node => {
      if (!currentAssignments[node.id] && freeMinions.length > 0) {
        // 随机选择一个空闲 Minion
        const randomIndex = Math.floor(Math.random() * freeMinions.length);
        const minionId = freeMinions[randomIndex];
        currentAssignments[node.id] = minionId;
        
        // 从空闲列表中移除
        freeMinions.splice(randomIndex, 1);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setTaskAssignments(currentAssignments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningNodes]); // taskAssignments omitted to break loop, logic relies on runningNodes triggering update

  // Monitor Node Status Changes (Success/Error Reactions)
  useEffect(() => {
    activeNodes.forEach(node => {
      const prevStatus = prevNodeStatusRef.current[node.id];
      const actualStatus = node.status; // Correct: status is at node root level

      if (prevStatus && prevStatus !== actualStatus) {
        if (actualStatus === 'done') { // NodeStatus: 'pending' | 'running' | 'done' | 'error'
          const assignedMinionId = taskAssignments[node.id];
          if (assignedMinionId) {
             setBubbleState({ id: assignedMinionId, content: 'Shiny!✨', type: 'text' });
             safeSetTimeout(() => setBubbleState(null), 2000); // P0: 使用安全的 setTimeout
          }
        } else if (actualStatus === 'error') {
           const assignedMinionId = taskAssignments[node.id];
           if (assignedMinionId) {
             setBubbleState({ id: assignedMinionId, content: 'Bug!! 😱', type: 'text' });
             safeSetTimeout(() => setBubbleState(null), 2000); // P0: 使用安全的 setTimeout
           }
        }
      }
      prevNodeStatusRef.current[node.id] = actualStatus || '';
    });
  }, [activeNodes, taskAssignments]);

  // 空闲时的漫游逻辑
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Create a stable reference to assigned IDs to avoid closure staleness if needed,
    // but here we depend on taskAssignments so it updates naturally.
    const assignedMinionIds = Object.values(taskAssignments);
    
    SQUAD.forEach((minion, index) => {
      const roamInterval = 3000 + minion.personality.roamSpeed * 2000 + Math.random() * 2000;
      const timer = setInterval(() => {
        // 只有未被分配任务的 Minion 才会更新漫游目标
        if (!assignedMinionIds.includes(minion.id)) {
          setRoamPositions(prev => ({
            ...prev,
            [minion.id]: getRandomRoamPosition(index + Math.floor(Math.random() * 4)),
          }));
        }
      }, roamInterval);
      timers.push(timer);
    });

    return () => timers.forEach(t => clearInterval(t));
  }, [taskAssignments]); // 依赖分配状态变化

  // Calculate positions (Always run hooks, but return empty if disabled)
  const minionPositions = useMemo(() => {
    if (!activeNodes.length || !minionsEnabled) return [];

    return SQUAD.map((minion) => {
      // 1. Determine Target Position
      let targetX = 0, targetY = 0;
      let baseState = 'idle';
      let flipped = false;

      const assignedNodeId = Object.keys(taskAssignments).find(key => taskAssignments[key] === minion.id);
      const targetNode = assignedNodeId ? runningNodes.find(n => n.id === assignedNodeId) : null;
      
      if (targetNode) {
        const centerX = targetNode.x + NODE_WIDTH / 2;
        const centerY = targetNode.y + NODE_HEIGHT / 2;
        const offsetX = (minion.id % 2 === 0 ? 1 : -1) * 20;
        targetX = centerX + offsetX - 48;
        targetY = centerY - 80;
        baseState = 'working';
        flipped = offsetX > 0;
      } else {
        const roamPos = roamPositions[minion.id] || { x: 0, y: 0 };
        targetX = roamPos.x;
        targetY = roamPos.y;
        baseState = 'idle';
        flipped = minion.id % 2 === 0;
      }

      // 2. Detect Movement
      const now = Date.now();
      const prev = prevPositionsRef.current[minion.id];
      let isMoving = false;

      // Check if target changed or if we are within movement window
      if (!prev || Math.abs(prev.x - targetX) > 1 || Math.abs(prev.y - targetY) > 1) {
        prevPositionsRef.current[minion.id] = { x: targetX, y: targetY, time: now };
        isMoving = true;
      } else if (now - prev.time < 1200) {
        isMoving = true;
      }

      // Override state
      if (baseState === 'idle' && isMoving) {
        baseState = 'move';
      }

      return {
        id: minion.id,
        x: targetX,
        y: targetY,
        state: baseState,
        flipped: flipped,
      };
    });
  }, [activeNodes.length, minionsEnabled, taskAssignments, runningNodes, roamPositions]);

  // 4. Collision Side-Effect
  useEffect(() => {
    if (minionPositions.length === 0) return;

    for (let i = 0; i < minionPositions.length; i++) {
      for (let j = i + 1; j < minionPositions.length; j++) {
        const p1 = minionPositions[i];
        const p2 = minionPositions[j];
        if (!p1 || !p2) continue; // Safety

        const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        
        // Threshold 60px. Trigger bubble if no bubble currently active.
        if (dist < 60 && !bubbleState && Math.random() > 0.9) { 
             const greetings = ['Oop!', 'Hi!', 'Excuse me', 'Bump!', 'Hug?', 'Ciao', 'Pardon'];
             const content = greetings[Math.floor(Math.random() * greetings.length)];
             setBubbleState({ 
               id: Math.random() > 0.5 ? p1.id : p2.id, 
               content, 
               type: 'text' 
             });
             
             // Auto clear after 1.5s
             safeSetTimeout(() => setBubbleState(null), 1500); // P0: 使用安全的 setTimeout
             return; // Only one collision per tick to avoid chaos
        }
      }
    }
  }, [minionPositions, bubbleState]); // Re-run when positions change
  
  if (!activeNodes.length || !minionsEnabled) return null;

  // ==========================================
  // Click Feedback Handler (Multi-Modal + Escalation) 
  // ==========================================
  const handlePoke = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    
    // Helper: random pick from array
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    // Helper: get response based on click count
    const getResponse = (minionId: number, count: number) => {
      const minion = SQUAD.find(m => m.id === minionId);
      
      if (count >= 6) {
        return { text: pick(DIALOGUE_POOL.escape), sound: 'alert' as const, vibrate: 50 };
      } else if (count >= 4) {
        return { text: pick(DIALOGUE_POOL.dizzy), sound: 'alert' as const, vibrate: 30 };
      } else if (count >= 2) {
        return { text: pick(DIALOGUE_POOL.annoyed), sound: 'tap' as const, vibrate: 20 };
      }
      
      const pool = minion ? DIALOGUE_POOL[minion.variant] : ['Hey! 👋'];
      return { text: pick(pool), sound: 'tap' as const, vibrate: 10 };
    };
    
    // 1. Update click count
    const currentCount = (clickCounts[id] || 0) + 1;
    setClickCounts(prev => ({ ...prev, [id]: currentCount }));
    
    // 2. Reset click count after 1 second of no clicks
    if (clickResetTimeoutRef.current[id]) {
      clearTimeout(clickResetTimeoutRef.current[id]);
    }
    clickResetTimeoutRef.current[id] = setTimeout(() => {
      setClickCounts(prev => ({ ...prev, [id]: 0 }));
    }, 1000);
    
    // 3. Get escalated response
    const response = getResponse(id, currentCount);
    
    // 4. Multi-modal feedback
    trigger(response.sound);  // Audio
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(response.vibrate);  // Haptic
    }
    
    // 5. Visual feedback
    setPokedId(id);
    setBubbleState({ id, content: response.text, type: 'text' });
    
    safeSetTimeout(() => {
      setPokedId(null);
      setBubbleState(null);
    }, currentCount >= 6 ? 1500 : 800);
  };


  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-40">
      <AnimatePresence>
        {SQUAD.map((minion) => {
          const pos = minionPositions.find(p => p.id === minion.id);
          if (!pos) return null;

          const isPoked = pokedId === minion.id;
          const visualState = isPoked ? 'poked' : pos.state;
          const { personality } = minion;
          const isWorking = Object.values(taskAssignments).includes(minion.id);

          // Movement Physics: Super Dash for Work (Fly!), Floaty for Idle
          const idleStiffness = personality.stiffness * 0.4;
          const idleDamping = personality.damping * 2;
          
          // Dash Physics: Very high stiffness for speed, low damping for "zip" feel
          const dashTransition = { 
            type: 'spring' as const,  // Fix: use 'as const' for literal type
            stiffness: 500, // Super fast!
            damping: 30,    // No bounce, just stop
            mass: 0.8,      // Light mass for acceleration
            restDelta: 0.5
          };

          return (
            <motion.div
              key={minion.id}
              className="absolute pointer-events-auto cursor-pointer z-50"
              style={{ width: 96, height: 96 }} // Explicit clickable area
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1,
                scale: isWorking ? 1.1 : 0.9, 
                x: pos.x, 
                y: pos.y,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={
                isWorking 
                  ? dashTransition // ⚡️ FLASH!
                  : { 
                      type: 'spring', 
                      stiffness: idleStiffness,
                      damping: idleDamping,
                      mass: 1.2,
                      restDelta: 0.001
                    }
              }
              onMouseDown={(e) => e.stopPropagation()} // Prevent canvas drag
              onClick={(e) => handlePoke(e, minion.id)}
            >
              <PixelCharacter 
                state={visualState as 'idle' | 'working' | 'move' | 'poked' | 'bump'}
                variant={minion.variant}
                isFlipped={pos.flipped}
                label={isWorking ? `🔧 ${minion.name}` : minion.name}
              />

              <AnimatePresence>
                {bubbleState?.id === minion.id && (
                  <motion.div 
                    key="bubble"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap pointer-events-none
                      ${bubbleState.type === 'text' 
                        ? 'bg-white text-black px-3 py-1 rounded-xl rounded-bl-sm border-2 border-black text-xs font-bold shadow-lg' 
                        : 'text-3xl drop-shadow-lg'
                      }`}
                  >
                    {bubbleState.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
