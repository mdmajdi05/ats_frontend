'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useSiteConfig, DEFAULT_CHAT_CONFIG } from '@/hooks/useSiteConfig';
import type { ChatConfig } from '@/types/chat';
import ChatButton from './ChatButton';
import WhatsAppButton from './WhatsAppButton';
import ChatBotLogo from './ChatBotLogo';

const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });

function getChatConfigSafe(config: { chat?: ChatConfig } | null): ChatConfig {
  return config?.chat || DEFAULT_CHAT_CONFIG;
}

function wasNotifDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try { return localStorage.getItem(NOTIF_DISMISSED_KEY) === '1'; }
  catch { return false; }
}

const NOTIF_DISMISSED_KEY = 'ats_chat_notif_dismissed';
const NOTIF_FIRST_DELAY = 5000;
const NOTIF_DISPLAY_DURATION = 8000;
const NOTIF_CYCLE_INTERVAL = 60000;

const NOTIF_MESSAGES = [
  { text: 'Are you finding products? Let\u2019s connect you with our best executive for your query.', action: 'Let\u2019s Talk' },
  { text: 'We stock 5000+ certified aerospace parts \u2014 turbine blades, nozzles, bearings & more.', action: 'Browse Parts' },
  { text: 'Need a quote fast? Our team responds within 2 hours on business days.', action: 'Get Quote' },
  { text: 'LM2500, LM6000, GE Frame parts in stock \u2014 ready for immediate dispatch.', action: 'View Inventory' },
  { text: 'MIL-SPEC, FAA & EASA certified components \u2014 full traceability provided.', action: 'Learn More' },
];

export default function ChatProvider() {
  const { isOpen, toggle, close } = useChat();
  const { config } = useSiteConfig();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifIndex, setNotifIndex] = useState(0);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissedRef = useRef(false);
  const prevPathRef = useRef(pathname);
  const pausedRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
  }, []);

  const pauseNotifications = useCallback(() => {
    pausedRef.current = true;
    clearAllTimers();
    setNotifVisible(false);
  }, [clearAllTimers]);

  const startCycle = useCallback((startIndex = 0) => {
    clearAllTimers();
    pausedRef.current = false;
    let idx = startIndex;

    function showNext() {
      if (pausedRef.current || dismissedRef.current) return;
      setNotifIndex(idx);
      setNotifVisible(true);

      hideTimerRef.current = setTimeout(() => {
        setNotifVisible(false);
        idx = (idx + 1) % NOTIF_MESSAGES.length;
        cycleTimerRef.current = setTimeout(showNext, NOTIF_CYCLE_INTERVAL - NOTIF_DISPLAY_DURATION);
      }, NOTIF_DISPLAY_DURATION);
    }

    showNext();
  }, [clearAllTimers]);

  useEffect(() => {
    dismissedRef.current = wasNotifDismissed();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      close();
      pauseNotifications();
    }
  }, [pathname, close, pauseNotifications]);

  useEffect(() => {
    clearAllTimers();

    if (isOpen || dismissedRef.current) {
      pauseNotifications();
      return;
    }

    showTimerRef.current = setTimeout(() => {
      startCycle(0);
    }, NOTIF_FIRST_DELAY);

    return () => clearAllTimers();
  }, [isOpen, startCycle, clearAllTimers, pauseNotifications]);

  const dismissNotif = useCallback(() => {
    pauseNotifications();
    dismissedRef.current = true;
    try { localStorage.setItem(NOTIF_DISMISSED_KEY, '1'); } catch { /* ignore */ }
  }, [pauseNotifications]);

  const handleOpenChat = useCallback(() => {
    pauseNotifications();
    toggle();
  }, [pauseNotifications, toggle]);

  const chatConfig = getChatConfigSafe(config);
  const showChat = chatConfig.chatbotEnabled !== false;
  const showWhatsApp = chatConfig.whatsappEnabled !== false;

  if (!mounted) return null;
  if (!showChat && !showWhatsApp) return null;

  const whatsappUrl = chatConfig.whatsappNumber
    ? `https://wa.me/${chatConfig.whatsappNumber.replace(/[^0-9]/g, '')}`
    : '#';

  const botName = chatConfig.botName || 'AeroBot';
  const currentNotif = NOTIF_MESSAGES[notifIndex];

  return (
    <>
      {showChat && (
        <ChatWidget
          botName={chatConfig.botName}
          greetingMessage={chatConfig.greetingMessage}
          humanHandoffEnabled={chatConfig.humanHandoffEnabled}
        />
      )}

      <AnimatePresence>
        {notifVisible && !isOpen && (
          <motion.div
            key={`notif-${notifIndex}`}
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.4, type: 'spring', damping: 18, stiffness: 200 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <div className="relative bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-silver/40 p-4 w-[280px]">
              <button
                onClick={dismissNotif}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-silver shadow-md flex items-center justify-center hover:bg-silver/60 transition-colors z-10"
              >
                <X className="w-3 h-3 text-text-muted" />
              </button>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 relative">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
                  >
                    <ChatBotLogo size="sm" />
                  </motion.div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-sm font-bold text-navy">{botName}</span>
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] text-green-600 font-medium ml-auto">online</span>
                  </div>
                  <p className="text-[13px] text-gray-700 leading-relaxed mb-3 font-medium">
                    {currentNotif.text}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={handleOpenChat}
                      className="flex-1 text-xs font-semibold px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/20"
                    >
                      {currentNotif.action}
                    </button>
                    {showWhatsApp && chatConfig.whatsappNumber && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-xs font-semibold px-3 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all shadow-md shadow-green-600/20 flex items-center justify-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-silver/40 transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {showChat && (
          <ChatButton isOpen={isOpen} onClick={toggle} />
        )}
        {showWhatsApp && (
          <WhatsAppButton
            number={chatConfig.whatsappNumber}
            mode={chatConfig.whatsappMode}
            businessPhoneId={chatConfig.whatsappBusinessPhoneId}
            businessToken={chatConfig.whatsappBusinessToken}
          />
        )}
      </div>
    </>
  );
}
