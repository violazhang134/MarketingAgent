import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '@/lib/stores/canvas-store';
import { useAppStore } from '@/lib/stores/app-store';
import { ByteCharacter } from './markie/byte-character';

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
  variant: 'orange' | 'blue' | 'purple' | 'green' | 'pink';
  personality: MinionPersonality;
}

const SQUAD: Minion[] = [
  { id: 1, name: 'Byte', variant: 'blue', personality: { stiffness: 12, damping: 20, baseDelay: 0, idleVariant: 0, roamSpeed: 1.0 } },
  { id: 2, name: 'Bit', variant: 'orange', personality: { stiffness: 18, damping: 15, baseDelay: 0.1, idleVariant: 1, roamSpeed: 1.5 } },
  { id: 3, name: 'Kilobyte', variant: 'green', personality: { stiffness: 8, damping: 25, baseDelay: 0.2, idleVariant: 2, roamSpeed: 0.7 } },
  { id: 4, name: 'Meg', variant: 'purple', personality: { stiffness: 15, damping: 18, baseDelay: 0.05, idleVariant: 3, roamSpeed: 1.3 } },
  { id: 5, name: 'Giga', variant: 'pink', personality: { stiffness: 14, damping: 20, baseDelay: 0.15, idleVariant: 4, roamSpeed: 1.1 } },
  { id: 6, name: 'Tera', variant: 'blue', personality: { stiffness: 10, damping: 22, baseDelay: 0.25, idleVariant: 0, roamSpeed: 0.9 } },
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
  const { nodes, selectedNodeId, activeCanvasId } = useCanvasStore();
  const minionsEnabled = useAppStore((s) => s.minionsEnabled);
  
  const [pokedId, setPokedId] = useState<number | null>(null);
  const [emojiState, setEmojiState] = useState<{ id: number; char: string } | null>(null);
  
  // 每个 Minion 的漫游位置 (独立状态)
  const [roamPositions, setRoamPositions] = useState<Record<number, { x: number; y: number }>>(() => {
    const initial: Record<number, { x: number; y: number }> = {};
    SQUAD.forEach((m, i) => {
      initial[m.id] = getRandomRoamPosition(i);
    });
    return initial;
  });

  // 分配到节点的 Minions (最多2个)
  const [assignedMinions, setAssignedMinions] = useState<number[]>([]);

  const activeNodes = nodes.filter(n => n.canvasId === activeCanvasId);
  
  // 找出正在运行的节点
  const runningNodes = useMemo(() => 
    activeNodes.filter(n => n.status === 'running'),
    [activeNodes]
  );

  // 当有 Running 节点时，分配 1-2 个 Minion 去工作
  useEffect(() => {
    if (runningNodes.length > 0) {
      // 随机选择 1-2 个 Minion 派遣
      const count = Math.min(2, Math.max(1, Math.floor(Math.random() * 2) + 1));
      const available = SQUAD.map(m => m.id).filter(id => !assignedMinions.includes(id));
      const shuffled = available.sort(() => Math.random() - 0.5);
      setAssignedMinions(shuffled.slice(0, count));
    } else {
      // 没有 Running 节点，全部回归漫游
      setAssignedMinions([]);
    }
  }, [runningNodes.length]);

  // 空闲时的漫游逻辑：每隔一段时间更新各自的漫游目标
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    SQUAD.forEach((minion, index) => {
      // 只有未被分配的 Minion 才漫游
      const roamInterval = 3000 + minion.personality.roamSpeed * 2000 + Math.random() * 2000;
      
      const timer = setInterval(() => {
        if (!assignedMinions.includes(minion.id)) {
          setRoamPositions(prev => ({
            ...prev,
            [minion.id]: getRandomRoamPosition(index + Math.floor(Math.random() * 4)),
          }));
        }
      }, roamInterval);
      
      timers.push(timer);
    });

    return () => timers.forEach(t => clearInterval(t));
  }, [assignedMinions]);

  // 随机表情触发
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.5) {
        const randomMinion = SQUAD[Math.floor(Math.random() * SQUAD.length)];
        const emojis = ['🎵', '💤', '✨', '🛠️', '👀', '🐾', '💭', '❓', '💡', '😊', '🌟'];
        setEmojiState({ id: randomMinion.id, char: emojis[Math.floor(Math.random() * emojis.length)] });
        setTimeout(() => setEmojiState(null), 2500);
      }
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  if (!activeNodes.length || !minionsEnabled) return null;

  // 计算每个 Minion 的最终位置
  const minionPositions = SQUAD.map((minion) => {
    const isAssigned = assignedMinions.includes(minion.id);
    
    if (isAssigned && runningNodes.length > 0) {
      // 被分配去工作：围绕 Running 节点
      const targetNode = runningNodes[0];
      const assignedIndex = assignedMinions.indexOf(minion.id);
      const angle = ((assignedIndex * 90) - 45) * (Math.PI / 180);
      const radius = 100 + assignedIndex * 30;
      
      const centerX = targetNode.x + NODE_WIDTH / 2;
      const centerY = targetNode.y + NODE_HEIGHT / 2;
      
      return {
        id: minion.id,
        x: centerX + Math.cos(angle) * radius - 48,
        y: centerY + Math.sin(angle) * radius - 48,
        state: 'working',
        flipped: Math.cos(angle) < 0,
      };
    } else {
      // 空闲：在角落漫游
      const roamPos = roamPositions[minion.id] || { x: 0, y: 0 };
      return {
        id: minion.id,
        x: roamPos.x,
        y: roamPos.y,
        state: 'idle',
        flipped: minion.id % 2 === 0, // 交替朝向
      };
    }
  });

  const handlePoke = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setPokedId(id);
    setEmojiState({ id, char: '⚡' });
    setTimeout(() => {
      setPokedId(null);
      setEmojiState(null);
    }, 800);
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
          const isWorking = assignedMinions.includes(minion.id);

          return (
            <motion.div
              key={minion.id}
              className="absolute pointer-events-auto cursor-pointer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1,
                scale: isWorking ? 1.1 : 0.9, // 工作时稍微大一点
                x: pos.x, 
                y: pos.y,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: isWorking ? personality.stiffness * 1.2 : personality.stiffness * 0.8,
                damping: personality.damping * 1.5, // 增加阻尼，更平滑
                delay: personality.baseDelay,
              }}
              onClick={(e) => handlePoke(e, minion.id)}
            >
              <ByteCharacter 
                state={visualState}
                variant={minion.variant}
                isFlipped={pos.flipped}
                label={isWorking ? `🔧 ${minion.name}` : minion.name}
                idleVariant={personality.idleVariant}
              />

              <AnimatePresence>
                {emojiState?.id === minion.id && (
                  <motion.div 
                    key="emoji"
                    initial={{ opacity: 0, y: 0, scale: 0 }}
                    animate={{ opacity: 1, y: -35, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl drop-shadow-lg z-50"
                  >
                    {emojiState.char}
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
