'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
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

const NOTIFICATION_INTERVAL = 45000;
const NOTIFICATION_DURATION = 8000;

export default function ChatProvider() {
  const { isOpen, toggle } = useChat();
  const { config } = useSiteConfig();
  const [mounted, setMounted] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const showNotification = useCallback(() => {
    if (!isOpen) setNotifVisible(true);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) { setNotifVisible(false); return; }
    const initial = setTimeout(showNotification, 8000);
    const interval = setInterval(showNotification, NOTIFICATION_INTERVAL);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [isOpen, showNotification]);

  useEffect(() => {
    if (!notifVisible) return;
    const timer = setTimeout(() => setNotifVisible(false), NOTIFICATION_DURATION);
    return () => clearTimeout(timer);
  }, [notifVisible]);

  const chatConfig = getChatConfigSafe(config);
  const showChat = chatConfig.chatbotEnabled !== false;
  const showWhatsApp = chatConfig.whatsappEnabled !== false;

  if (!mounted) return null;
  if (!showChat && !showWhatsApp) return null;

  const whatsappUrl = chatConfig.whatsappNumber
    ? `https://wa.me/${chatConfig.whatsappNumber.replace(/[^0-9]/g, '')}`
    : '#';

  const botName = chatConfig.botName || 'AeroBot';

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
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3, type: 'spring', damping: 20 }}
            className="fixed bottom-28 right-6 z-50"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl border border-silver/60 p-4 w-72">
              {/* Close button */}
              <button
                onClick={() => setNotifVisible(false)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-silver shadow-md flex items-center justify-center hover:bg-silver/60 transition-colors z-10"
              >
                <X className="w-3 h-3 text-text-muted" />
              </button>

              {/* Bot avatar + message */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <ChatBotLogo size="sm" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm font-bold text-navy">{botName}</span>
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed mb-3">
                    Looking for a turbine part? I can help you search our catalog or connect you with our team.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { toggle(); setNotifVisible(false); }}
                      className="flex-1 text-xs font-semibold px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/20"
                    >
                      Chat Now
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

              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-silver/60 transform rotate-45" />
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
