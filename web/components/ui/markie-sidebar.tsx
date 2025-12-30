"use client";

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, Zap, Brain, LayoutTemplate } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/app-store';
import { useCampaignStore } from '@/lib/stores/campaign-store';
import { useCanvasStore } from '@/lib/stores/canvas-store';
import { runResearchFlow, sendMessage, AssistantMessage } from '@/lib/ai-assistant';
import { useSensory } from '@/lib/hooks/use-sensory';
import { MarkieAvatar, type MarkieState } from '@/components/ui/markie-avatar';

const MARKIE_PERSONA: Record<MarkieState, {
  face: string;
  gradient: string;
  animate: string;
  subtitle: string;
}> = {
  idle: {
    face: '(^_^)',
    gradient: 'from-indigo-500 to-purple-500',
    animate: 'animate-none',
    subtitle: '我在听，这片土壤很安静',
  },
  listening: {
    face: '(^_^)',
    gradient: 'from-indigo-500 to-purple-500',
    animate: 'animate-none',
    subtitle: '抓住那个想法了！',
  },
  channeling: {
    face: '(o_o)',
    gradient: 'from-indigo-400 to-cyan-500',
    animate: 'animate-pulse',
    subtitle: '正在从数据宇宙下载灵感...',
  },
  magic: {
    face: '(^o^)',
    gradient: 'from-violet-500 to-amber-400',
    animate: 'animate-pulse',
    subtitle: '看！长出来了！',
  },
  mischief: {
    face: '(>_<)',
    gradient: 'from-rose-500 to-orange-500',
    animate: 'animate-none',
    subtitle: '哎呀，魔法反噬了...',
  },
};

interface ChatEntry extends AssistantMessage {
  role: 'user' | 'assistant';
}

export function MarkieSidebar() {
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const { 
    competitorName, 
    productName, 
    productDesc, 
    updateInput,
    runAgentWorkflow,
    phase,
  } = useCampaignStore();
  const { activeCanvasId, addNode, addEdge, nodes, selectedNodeId, fitToNodes } = useCanvasStore();
  const { trigger } = useSensory();

  const [markieState, setMarkieState] = useState<MarkieState>('idle');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [isPlanting, setIsPlanting] = useState(false);
  const isBusy = markieState === 'channeling' || markieState === 'listening' || phase === 'running';

  // 调研表单本地状态（用于编辑）
  const [formCompetitor, setFormCompetitor] = useState(competitorName || '');
  const [formProduct, setFormProduct] = useState(productName || '');
  const [formDesc, setFormDesc] = useState(productDesc || '');
  const [showForm, setShowForm] = useState(true);

  // 同步 store 中的值到本地表单
  useEffect(() => {
    if (competitorName && !formCompetitor) setFormCompetitor(competitorName);
    if (productName && !formProduct) setFormProduct(productName);
    if (productDesc && !formDesc) setFormDesc(productDesc);
  }, [competitorName, productName, productDesc]);

  const activeNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const activeNodeDetailLines = useMemo(() => {
    if (!activeNode) return null;
    if (
      activeNode.title === '创意脚本方案' ||
      activeNode.title === '广告文案变体' ||
      activeNode.title === 'Hook 素材池'
    ) {
      return activeNode.summary
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    }
    return null;
  }, [activeNode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleSidebar]);

  const handleOpenCanvas = () => {
    router.push('/canvas');
  };

  const appendMessage = (entry: ChatEntry) => {
    setMessages((prev) => [...prev, entry]);
  };

  const handleFreeChat = async () => {
    if (!input.trim()) return;

    trigger('tap');

    const userMsg: ChatEntry = {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };
    appendMessage(userMsg);
    setInput('');
    setMarkieState('listening');

    try {
      setMarkieState('channeling');
      const reply = await sendMessage('default', userMsg.content);
      const assistant = reply.messages[0];
      appendMessage({
        id: assistant.id,
        role: 'assistant',
        content: assistant.content,
        createdAt: assistant.createdAt,
      });
      setMarkieState('magic');
      trigger('success');
      setTimeout(() => setMarkieState('idle'), 800);
    } catch {
      setMarkieState('mischief');
      trigger('alert');
      appendMessage({
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: '刚刚施法失败了，可以稍后再试一次。',
        createdAt: new Date().toISOString(),
      });
    }
  };

  // 开始调研（从表单）
  const handleStartResearch = async () => {
    if (!formCompetitor.trim() || !formProduct.trim()) {
      trigger('alert');
      return;
    }

    // 更新 store
    updateInput({
      competitorName: formCompetitor.trim(),
      productName: formProduct.trim(),
      productDesc: formDesc.trim(),
    });

    trigger('tap');
    setShowForm(false);
    setMarkieState('channeling');

    appendMessage({
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: `分析竞品「${formCompetitor}」，为我的产品「${formProduct}」生成营销方案。`,
      createdAt: new Date().toISOString(),
    });

    try {
      // 使用改造后的 runAgentWorkflow（会自动生成画布节点）
      await runAgentWorkflow();
      
      appendMessage({
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: '调研完成！我已在画布上生成了完整的分析节点，点击节点可查看详情。',
        createdAt: new Date().toISOString(),
      });

      setMarkieState('magic');
      trigger('milestone');

      // 自动居中所有节点
      setTimeout(() => {
        const container = document.querySelector('.infinite-canvas-container');
        if (container) {
          const rect = container.getBoundingClientRect();
          fitToNodes(rect.width, rect.height);
        }
      }, 500);

      setTimeout(() => setMarkieState('idle'), 1500);
    } catch {
      setMarkieState('mischief');
      trigger('alert');
      appendMessage({
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: '调研过程出了点问题，请稍后重试。',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const ensureNames = () => {
    if (competitorName && productName) {
      return {
        competitor: competitorName,
        product: productName,
        desc: productDesc,
      };
    }
    return {
      competitor: 'Candy Crush',
      product: '消消乐新作',
      desc: '一款受热门竞品启发的解压消除游戏',
    };
  };

  const handleQuickCompetitorAnalysis = async () => {
    const base = ensureNames();
    const canvasId = activeCanvasId || 'canvas_default';

    trigger('tap');

    appendMessage({
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: '帮我梳理竞品广告结构。',
      createdAt: new Date().toISOString(),
    });

    try {
      setMarkieState('channeling');
      const result = await runResearchFlow({
        competitorName: base.competitor,
        productName: base.product,
        productDesc: base.desc,
      });

      const commonMeta = {
        competitorName: base.competitor,
        productName: base.product,
        runType: 'markie' as const,
        createdAt: new Date().toISOString(),
      };

      const strategyNode = addNode({
        canvasId,
        type: 'text',
        x: 0,
        y: 0,
        title: '竞品广告策略',
        summary: result.analysis.strategy,
        meta: commonMeta,
      });

      const commentsNode = addNode({
        canvasId,
        type: 'text',
        x: 1,
        y: 0,
        title: '用户评论洞察',
        summary: result.summary,
        meta: commonMeta,
      });

      const diffNode = addNode({
        canvasId,
        type: 'text',
        x: 2,
        y: 0,
        title: '差异化策略',
        summary: result.insights.strategySuggestions.join('；'),
        meta: commonMeta,
      });

      addEdge({ fromNodeId: strategyNode.id, toNodeId: commentsNode.id, label: '洞察来源' });
      addEdge({ fromNodeId: commentsNode.id, toNodeId: diffNode.id, label: '策略生成' });

      const scriptsSummary = result.creativeAssets.scripts
        .map(
          (s) =>
            `${s.title} · ${s.duration} · ${s.platform.toUpperCase()}`
        )
        .join('\n');

      const copiesSummary = result.creativeAssets.copyVariants
        .slice(0, 4)
        .join('\n');

      const hooksSummary = result.creativeAssets.hooks
        .slice(0, 5)
        .join(' / ');

      const scriptsNode = addNode({
        canvasId,
        type: 'text',
        x: 0,
        y: 1,
        title: '创意脚本方案',
        summary: scriptsSummary,
        meta: commonMeta,
      });

      const copiesNode = addNode({
        canvasId,
        type: 'text',
        x: 1,
        y: 1,
        title: '广告文案变体',
        summary: copiesSummary,
        meta: commonMeta,
      });

      const hooksNode = addNode({
        canvasId,
        type: 'text',
        x: 2,
        y: 1,
        title: 'Hook 素材池',
        summary: hooksSummary,
         meta: commonMeta,
      });

      addEdge({
        fromNodeId: diffNode.id,
        toNodeId: scriptsNode.id,
        label: '脚本方向',
      });
      addEdge({
        fromNodeId: diffNode.id,
        toNodeId: copiesNode.id,
        label: '文案方向',
      });
      addEdge({
        fromNodeId: diffNode.id,
        toNodeId: hooksNode.id,
        label: 'Hook 素材',
      });

      const pack = result.experimentPack;
      const [controlArm, variantArm] = pack.arms;

      const experimentSummary = [
        `变量：${pack.variable}`,
        `对照组：${controlArm.name}`,
        `测试组：${variantArm.name}`,
      ].join('\n');

      const experimentNode = addNode({
        canvasId,
        type: 'text',
        x: 0,
        y: 2,
        title: '实验配置',
        summary: experimentSummary,
        meta: commonMeta,
      });

      addEdge({
        fromNodeId: scriptsNode.id,
        toNodeId: experimentNode.id,
        label: '投放实验',
      });

      appendMessage({
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content:
          '施法成功！看，它们在画布上长得真好。我已经种下了「竞品广告策略」「用户评论洞察」「差异化策略」「创意脚本方案」「广告文案变体」「Hook 素材池」「实验配置」这些节点。',
        createdAt: new Date().toISOString(),
      });

      setMarkieState('magic');
      trigger('milestone');
      setIsPlanting(true);
      setTimeout(() => {
        setMarkieState('idle');
        setIsPlanting(false);
      }, 900);
    } catch {
      setMarkieState('mischief');
      trigger('alert');
      appendMessage({
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: '这次没有成功连上情报源，稍后再试试。',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const badgeText = (() => {
    if (markieState === 'channeling') return '通灵中';
    if (markieState === 'listening') return '聆听中';
    if (markieState === 'magic') return '施法成功';
    if (markieState === 'mischief') return '有点调皮';
    return '待命';
  })();

  const personaVisual = MARKIE_PERSONA[markieState];

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        className="fixed right-4 bottom-20 z-[90] rounded-full bg-indigo-500 shadow-xl shadow-indigo-500/40 w-14 h-14 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>

      <AnimatePresence>
        {isPlanting && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[91]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute right-24 top-24"
              initial={{ x: 0, y: 0, scale: 0.7, opacity: 0, rotate: 0 }}
              animate={{ 
                x: -260, 
                y: [0, -40, 80], 
                scale: 1, 
                opacity: 1,
                rotate: 360
              }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ 
                duration: 0.9, 
                ease: 'easeInOut',
                times: [0, 0.4, 1] // Align y keyframes
              }}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-[0_0_24px_rgba(129,140,248,0.9)] flex items-center justify-center text-[10px] text-white">
                ✦
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="fixed inset-y-0 right-0 w-[320px] bg-black/80 border-l border-white/10 z-[89] flex flex-col backdrop-blur-xl"
          >
            <div className="px-4 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MarkieAvatar state={markieState} size={40} />
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold">Markie · 创意精灵</div>
                  <div className="text-[10px] text-white/40">{personaVisual.subtitle}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/40 border border-white/10">
                  {badgeText}
                </span>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="text-[10px] text-white/30 hover:text-white/70"
                >
                  收起
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {activeNode && (
                  <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-[11px] text-indigo-100">
                    正在围绕「{activeNode.title}」整理调研上下文
                  </div>
                )}
                {activeNode && activeNodeDetailLines && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/80 space-y-1">
                    <div className="text-[10px] text-white/40">
                      {activeNode.title === '创意脚本方案' && '脚本预览'}
                      {activeNode.title === '广告文案变体' && '文案变体'}
                      {activeNode.title === 'Hook 素材池' && 'Hook 素材池'}
                    </div>
                    <ul className="max-h-40 overflow-y-auto pr-1 space-y-1">
                      {activeNodeDetailLines.map((line, index) => (
                        <li key={index} className="leading-snug">
                          • {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {messages.length === 0 && showForm && (
                  <div className="space-y-4">
                    {/* 引导标题 */}
                    <div className="text-center space-y-1">
                      <div className="text-lg font-bold text-white">🔍 开始调研</div>
                      <div className="text-[11px] text-white/40">
                        告诉我竞品和你的产品，我会为你生成完整的营销方案
                      </div>
                    </div>

                    {/* 表单 */}
                    <div className="space-y-3">
                      {/* 竞品名称 */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/50 font-medium">竞品名称</label>
                        <input
                          type="text"
                          value={formCompetitor}
                          onChange={(e) => setFormCompetitor(e.target.value)}
                          placeholder="例如: Candy Crush, Royal Match"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 transition-colors"
                        />
                      </div>

                      {/* 产品名称 */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/50 font-medium">我的产品名称</label>
                        <input
                          type="text"
                          value={formProduct}
                          onChange={(e) => setFormProduct(e.target.value)}
                          placeholder="例如: 消消乐大师"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 transition-colors"
                        />
                      </div>

                      {/* 一句话描述 */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/50 font-medium">一句话描述（可选）</label>
                        <input
                          type="text"
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                          placeholder="例如: 一款解压休闲的消除游戏"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 transition-colors"
                        />
                      </div>

                      {/* 开始按钮 */}
                      <button
                        type="button"
                        onClick={handleStartResearch}
                        disabled={!formCompetitor.trim() || !formProduct.trim() || isBusy}
                        className={`w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          formCompetitor.trim() && formProduct.trim() && !isBusy
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90'
                            : 'bg-white/10 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                        {isBusy ? '调研中...' : '一键生成投放方案'}
                      </button>
                    </div>
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      m.role === 'user'
                        ? 'flex justify-end'
                        : 'flex justify-start'
                    }
                  >
                    <div
                      className={
                        m.role === 'user'
                          ? 'max-w-[80%] rounded-2xl bg-indigo-500 text-xs px-3 py-2 text-white'
                          : 'max-w-[80%] rounded-2xl bg-white/5 text-xs px-3 py-2 text-white/90'
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 px-3 py-2 space-y-2">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={handleQuickCompetitorAnalysis}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-500/20 text-[11px] text-indigo-200 border border-indigo-500/40 whitespace-nowrap"
                  >
                    <Zap className="w-3 h-3" />
                    一键竞品调研
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenCanvas}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 text-[11px] text-white/70 border border-white/10 whitespace-nowrap"
                  >
                    <LayoutTemplate className="w-3 h-3" />
                    打开 Research Canvas
                  </button>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/0 text-[10px] text-white/30 whitespace-nowrap">
                    <Brain className="w-3 h-3" />
                    自由对话法术练习中
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 rounded-2xl bg-white/5 px-2">
                    <MessageCircle className="w-4 h-4 text-white/30" />
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (!isBusy) {
                            handleFreeChat();
                          }
                        }
                      }}
                      placeholder={
                        isBusy
                          ? markieState === 'listening'
                            ? '我正在记住你刚才说的那句话'
                            : '我正在通灵，请稍等几秒再问我'
                          : markieState === 'magic'
                            ? '施法刚结束，还想让我种点什么？'
                            : markieState === 'mischief'
                              ? '这个咒语有点超纲了，换个说法试试？'
                              : '问我关于竞品、评论或创意的任何问题'
                      }
                      className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder:text-white/30 py-2 disabled:text-white/30"
                      disabled={isBusy}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isBusy) {
                        handleFreeChat();
                      }
                    }}
                    disabled={isBusy}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs transition-colors ${
                      isBusy
                        ? 'bg-indigo-500/40 cursor-not-allowed'
                        : 'bg-indigo-500 hover:bg-indigo-400'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
