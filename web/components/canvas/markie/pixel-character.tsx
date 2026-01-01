import { useMemo, useState } from 'react';
import { motion, Variants } from 'framer-motion';

// ========================================
// 1. Pixel Art Engine (Box-Shadow Technique)
// ========================================

// 调色板
const COLORS = {
  transparent: 'transparent',
  // Byte (Ginger Cat)
  catBase: '#E5A040', catLight: '#F4C47A', catDark: '#C17D1F',
  red: '#E84545', white: '#FFFFFF', black: '#2D2D2D', pink: '#FF9EAA',

  // Bit (Blue Bunny)
  bunBase: '#89CFF0', bunDark: '#5CACD6', bunBow: '#2D2D2D',

  // Kilobyte (Frog Hat Cat)
  frogGreen: '#95C623', frogDark: '#74A018', brownBase: '#8B5E3C', brownDark: '#6D462B',

  // Meg (Pink Bear)
  bearPink: '#F4A6C5', bearDark: '#D67FA2', dressYellow: '#FAD02C', candyRed: '#FF4D4D',

  // Giga (Purple Fashion Cat)
  purpBase: '#9D86E0', purpDark: '#7A65BF', eyeSparkle: '#FFF4BD', dressPlaid: '#E87A90',

  // Tera (Black Void Cat)
  voidBase: '#252525', voidDark: '#121212', bowGreen: '#4ADE80',
};

type PixelGrid = string[];

// 20x20 Grid - More Detail
// Byte: Ginger Cookie Cat
const CHAR_BYTE = [
  "....................",
  ".....RRRR...........", // Hat tip
  "....RRRRRR..........",
  "...RRWWWRR..........",
  ".....###..#.........", // Ears
  "....#####.##........",
  "...###########......",
  "...###########......",
  "...##W#####W##......", // Eyes
  "...##B#####B##......",
  "...###########......",
  "...##P##W##P##......", // Blush
  "....#########.......",
  ".....RRRRRRR........", // Bow
  ".....#######........",
  "....#########.......",
  "....##.....##.......",
  "...###.....###......",
  "....................",
  "...................."
];

// Bit: Blue Bunny (Image 2)
const CHAR_BIT = [
  ".......##.....##....", // Ears
  "......####...####...",
  "......####...####...",
  "......####...####...",
  ".....#############..",
  "....###############.",
  "....###############.",
  "....###B#######B###.",
  "....###############.",
  "....#####..B..#####.", // Bow tie on cheek/neck
  "....###############.",
  "......BBB######.....", // Body
  ".....BBBBB####......",
  ".....BBBBB####......",
  "......BBB#####......",
  ".......#######......",
  "......##....##......",
  "....................",
  "...................."
];

// Kilobyte: Frog Hat Cat (Image 1)
const CHAR_KILO = [
  "......GGGGGGGG......", // Frog Eyes
  ".....GGWGGGGWGG.....",
  "....GGGBGGGGBGGG....",
  "...GGGGGGGGGGGGGG...", // Hat rim
  "...GGGGGGGGGGGGGG...",
  "....##########......", // Cat face
  "....##W####W##......",
  "....##B####B##......",
  "....##########......",
  "....##########......",
  ".....########.......",
  "......BBBBBB........", // Body
  ".....BBBBBBBB.......",
  ".....BBBBBBBB.......",
  ".....BBBBBBBB.......",
  "......BB..BB........",
  "......W....W........", // White sidekick (small)
  "....................",
  "...................."
];

// Meg: Pink Bear (Image 4)
const CHAR_MEG = [
  "....##.......##.....", // Round ears
  "...####.....####....",
  "...####.....####....",
  "..###############...",
  "..###############...",
  "..##G#########G##...", // Green eyes
  "..##B#########B##...",
  "..###############...",
  "...#####B########...", // Nose
  "....###########.....",
  ".....#.......C......", // Arm + Candy
  ".....YYY...CCCCCC...", // Yellow Dress + Candy swirl
  "....YYYYY..CCRRCC...",
  "....YYYYY...CCRC....",
  "....YYYYY....C......",
  ".....#..#...........",
  ".....#..#...........",
  "....................",
  "...................."
];

// Giga: Purple Cat (Image 3)
const CHAR_GIGA = [
  ".....#.......#......", // Pointy ears
  "....###.....###.....",
  "...##L##...##L##....",
  "..################..",
  ".##################.",
  ".##WW###W###W###WW#.", // Big sparkle eyes
  ".##WW#######W###WW#.",
  ".##################.",
  "..################..",
  "...######W#######...", // Mouth
  ".....DDDDDDDDD......", // Dress
  "....DDDDDDDDDDD.....",
  "....DDDDDDDDDDD.....",
  ".....#...#...#......",
  ".....#...#...#......",
  "....................",
  "...................."
];

// Tera: Black Void Cat (Custom)
const CHAR_TERA = [
  "....................",
  "....##.......##.....",
  "...####.....####....",
  "..################..",
  "..################..",
  "..##G#########G##...", // Green eyes
  "..################..",
  "..######P##P######..", // Pink blush
  "...##############...",
  ".....GGGGGGGG.......", // Green bow
  "....GGGGGGGGGG......",
  "....##########......",
  "...############.....",
  "...############.....",
  "....##......##......",
  "....................",
  "...................."
];

// 像素生成器
const generateBoxShadow = (grid: PixelGrid, scale: number, colorMap: Record<string, string>) => {
  let boxShadow = '';
  
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const char = row[x];
      if (char === '.') continue;
      
      const color = colorMap[char];
      if (!color) continue;
      
      // format: x y 0 0 color
      if (boxShadow) boxShadow += ',';
      boxShadow += `${x * scale}px ${y * scale}px 0 0 ${color}`;
    }
  });
  
  return boxShadow;
};

// ========================================
// 2. Component
// ========================================

interface PixelCharacterProps {
  variant: 'orange' | 'blue' | 'purple' | 'green' | 'pink' | 'black'; 
  state: 'idle' | 'working' | 'move' | 'poked' | 'bump';
  isFlipped?: boolean;
  label?: string;
}

export function PixelCharacter({ variant, state, isFlipped, label }: PixelCharacterProps) {
  
  // 1. 确定角色设计
  const { grid, activeColorMap } = useMemo(() => {
    let selectedBaseColors: Record<string, string>;
    let selectedGrid: PixelGrid;

    switch (variant) {
      case 'orange': // Byte
        selectedGrid = CHAR_BYTE;
        selectedBaseColors = { '#': COLORS.catBase, 'L': COLORS.catLight, 'D': COLORS.catDark, 'W': COLORS.white, 'B': COLORS.black, 'R': COLORS.red, 'P': COLORS.pink };
        break;
      case 'blue': // Bit (Bunny)
        selectedGrid = CHAR_BIT;
        selectedBaseColors = { '#': COLORS.bunBase, 'B': COLORS.bunBow, 'W': COLORS.white };
        break;
      case 'green': // Kilobyte (Frog)
        selectedGrid = CHAR_KILO;
        selectedBaseColors = { 'G': COLORS.frogGreen, '#': COLORS.brownBase, 'W': COLORS.white, 'B': COLORS.black };
        break;
      case 'pink': // Meg (Bear)
        selectedGrid = CHAR_MEG;
        selectedBaseColors = { '#': COLORS.bearPink, 'G': COLORS.frogGreen, 'B': COLORS.black, 'Y': COLORS.dressYellow, 'C': COLORS.white, 'R': COLORS.candyRed };
        break;
      case 'purple': // Giga (Fashion Cat)
        selectedGrid = CHAR_GIGA;
        selectedBaseColors = { '#': COLORS.purpBase, 'L': COLORS.purpDark, 'W': COLORS.white, 'D': COLORS.dressPlaid };
        break;
      case 'black': // Tera (Void)
        selectedGrid = CHAR_TERA;
        selectedBaseColors = { '#': COLORS.voidBase, 'G': COLORS.bowGreen, 'P': COLORS.pink };
        break;
      default:
        selectedGrid = CHAR_BYTE;
        selectedBaseColors = { '#': COLORS.catBase, 'L': COLORS.catLight, 'D': COLORS.catDark, 'W': COLORS.white, 'B': COLORS.black, 'R': COLORS.red, 'P': COLORS.pink };
    }
    
    return { grid: selectedGrid, activeColorMap: selectedBaseColors };
  }, [variant]);

  // 3. 生成 Box-Shadow
  const pixelSize = 6; // Increased from 4 to 6 for larger characters
  const boxShadow = generateBoxShadow(grid, pixelSize, activeColorMap);

  // Create random timing variations on mount using lazy state (pure)
  const [animTiming] = useState(() => ({
    idleDuration: 2 + Math.random() * 1.5, // 2s - 3.5s
    moveDuration: 0.3 + Math.random() * 0.2, // 0.3s - 0.5s
    bobDelay: Math.random() * 0.5,
  }));

  // 4. 动画变体 (Organic Animation v3)
  const containerVariants: Variants = {
    idle: { 
      y: [0, -3, 0],
      scale: [1, 1.02, 1], 
      transition: { 
        duration: animTiming.idleDuration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: animTiming.bobDelay 
      }
    },
    working: {
      y: [0, -2, 0],
      rotate: [-2, 2, -2],
      scale: [1, 1.05, 1],
      transition: { duration: 0.8, repeat: Infinity }
    },
    move: {
      y: [0, -6, 0],
      rotate: [0, 8, 0, -8, 0], 
      scaleY: [0.95, 1.05, 0.95], 
      transition: { 
        duration: animTiming.moveDuration, 
        repeat: Infinity,
        repeatType: "reverse"
      }
    },
    poked: {
      scale: [1, 1.3, 0.9, 1.1, 1],
      rotate: [0, 15, -15, 5, 0],
      transition: { duration: 0.5, type: "tween", ease: "easeOut" } // spring不支持多关键帧
    },
    bump: { 
      x: [0, -5, 5, 0],
      rotate: [0, -10, 10, 0],
      scale: [1, 0.9, 1.1, 1],
      transition: { duration: 0.4, type: "tween", ease: "easeInOut" }
    }
  };

  const currentAnim = state; // Directly use passed state which now includes 'bump' 

  return (
    <div className="relative flex flex-col items-center justify-end">
      {/* 像素角色容器 */}
      <motion.div
        variants={containerVariants}
        animate={currentAnim}
        style={{
          width: pixelSize, // Set base width/height to 1 unit, the rest is shadow
          height: pixelSize,
          boxShadow: boxShadow,
          imageRendering: 'pixelated', // Keep it crisp
        }}
        className={`relative ${isFlipped ? '-scale-x-100' : ''}`} // Flipping via transform
      >
        {/* 额外的 DOM 元素 (如尾巴动画) 可以放在这里，如果是独立于 grid 的 */}
      </motion.div>

      {/* 标签 */}
      {label && (
        <motion.div 
          className="absolute -bottom-10 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-[10px] text-white/90 font-mono pointer-events-none"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {label}
        </motion.div>
      )}
    </div>
  );
}
