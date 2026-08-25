import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Lightbulb, Key, Check, ShieldCheck, Sparkles, Cpu } from 'lucide-react';
import { Button } from './ui/Button.tsx';
import { EagleIcon } from './ui/icons/EagleIcon';
import {
  askForensecAI,
  getStoredApiKey,
  saveApiKey,
  getActiveProviderSetting,
  setActiveProviderSetting,
  getEffectiveProvider,
  type AIProvider,
} from '../ai/forensecAI.ts';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Hello! I'm your AI-powered Digital Forensics Assistant.\n\nI can analyze questions dynamically across all forensic disciplines, tools, and real incident workflows.\n\n🎯 **Direct QA**: Tool usage, memory, disk, and network triage\n📚 **Case Analysis**: Attack vector reconstruction and evidence artifacts\n⚡ **Dual AI Engine**: Powered by Google Gemini, OpenAI & Forensec Knowledge Matrix\n\nWhat forensic investigation topic would you like to explore?",
  sender: 'bot',
  timestamp: new Date(),
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Key & Provider State
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('auto');
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [openAiKeyInput, setOpenAiKeyInput] = useState('');
  const [effectiveProvider, setEffectiveProvider] = useState<'gemini' | 'openai' | 'dynamic'>('dynamic');
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const [suggestions] = useState<string[]>([
    'How do I detect ransomware memory artifacts with Volatility?',
    'What are the steps to investigate an insider data theft case?',
    'Explain NTFS $MFT analysis and timestomping detection',
    'How to filter exfiltration packets in Wireshark',
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputFormRef = useRef<HTMLFormElement>(null);

  // Sync state on load
  const refreshKeyState = () => {
    const gKey = getStoredApiKey('gemini');
    const oKey = getStoredApiKey('openai');
    const prov = getActiveProviderSetting();
    const eff = getEffectiveProvider();

    setGeminiKeyInput(gKey);
    setOpenAiKeyInput(oKey);
    setSelectedProvider(prov);
    setEffectiveProvider(eff);
  };

  useEffect(() => {
    refreshKeyState();
  }, []);

  // Background remains fully scrollable while chatbot is open

  // Scroll to bottom only when new messages are added
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 1) {
      const container = messagesContainerRef.current;
      const scrollToFn = (container as unknown as { scrollTo?: (options: ScrollToOptions) => void }).scrollTo;
      if (typeof scrollToFn === 'function') {
        scrollToFn.call(container, { top: container.scrollHeight, behavior: 'smooth' });
      } else {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages.length]);

  // Handle iOS mobile keyboard viewport changes
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || !('visualViewport' in window)) {
      return;
    }

    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    const handleViewportResize = () => {
      if (inputFormRef.current) {
        const offsetY = window.innerHeight - visualViewport.height;
        if (offsetY > 50) {
          inputFormRef.current.style.transform = `translateY(-${offsetY}px)`;
        } else {
          inputFormRef.current.style.transform = 'translateY(0)';
        }
      }
    };

    visualViewport.addEventListener('resize', handleViewportResize);
    visualViewport.addEventListener('scroll', handleViewportResize);

    return () => {
      visualViewport.removeEventListener('resize', handleViewportResize);
      visualViewport.removeEventListener('scroll', handleViewportResize);
      if (inputFormRef.current) {
        inputFormRef.current.style.transform = 'translateY(0)';
      }
    };
  }, [isOpen]);

  const handleSaveKeys = () => {
    saveApiKey(geminiKeyInput, 'gemini');
    saveApiKey(openAiKeyInput, 'openai');
    setActiveProviderSetting(selectedProvider);
    refreshKeyState();

    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const handleClearKey = (provider: 'gemini' | 'openai') => {
    saveApiKey('', provider);
    if (provider === 'gemini') setGeminiKeyInput('');
    if (provider === 'openai') setOpenAiKeyInput('');
    refreshKeyState();
  };

  const handleSendMessage = async (e?: React.FormEvent, quickQuery?: string) => {
    e?.preventDefault();
    const query = quickQuery || inputValue;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages
        .filter(m => m.id !== '1')
        .map(m => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        }));

      const aiReply = await askForensecAI(query, history, undefined, selectedProvider);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiReply,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Forensic AI analysis error. Please check your query or API key settings in the header.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(undefined, suggestion);
  };

  const isLiveActive = effectiveProvider === 'gemini' || effectiveProvider === 'openai';

  return (
    <>
      {/* Chatbot container - positioned at bottom-right */}
      <div className="fixed bottom-6 right-6 z-50 chatbot-container-mobile">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="chatbot-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="chatbot-title"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-80 sm:w-96 bg-[rgba(10,14,26,0.96)] backdrop-blur-xl border border-accent-cyan/30 rounded-xl shadow-2xl overflow-hidden mb-4"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'clamp(480px, 80vh, 640px)',
                maxHeight: '80vh',
                position: 'relative'
              }}
            >
              {/* Header */}
              <div className="relative bg-bg-darker/90 backdrop-blur-md p-3.5 border-b border-border-glass" style={{ flexShrink: 0 }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-neon-sm">
                      <EagleIcon className="w-5 h-5 text-white" title="Eagle" />
                    </div>
                    <div>
                      <h3 id="chatbot-title" className="font-bold text-white text-sm flex items-center gap-1.5 font-mono">
                        FORENSEC AI ASSISTANT
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                        <span className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${isLiveActive ? 'bg-green-400' : 'bg-accent-cyan'} animate-pulse inline-block`} />
                          <span className="font-mono">
                            {effectiveProvider === 'gemini' && '🟢 Gemini 2.5 Live'}
                            {effectiveProvider === 'openai' && '🟢 OpenAI GPT-4o'}
                            {effectiveProvider === 'dynamic' && '🔵 Dynamic Knowledge Matrix'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Key Settings & Close) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowKeyModal(prev => !prev)}
                      className={`p-1.5 rounded-md text-xs font-mono transition-colors flex items-center gap-1 ${
                        isLiveActive
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-white/5 text-text-tertiary hover:text-accent-neon hover:bg-white/10'
                      }`}
                      title={isLiveActive ? 'AI Keys Active (Click to configure)' : 'Configure Gemini or OpenAI API Key'}
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span className="text-[10px] hidden sm:inline">{isLiveActive ? 'Active' : 'AI Keys'}</span>
                    </button>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 text-text-secondary hover:text-white transition-colors rounded-md hover:bg-white/10"
                      aria-label="Close chat"
                      tabIndex={0}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* API Key Modal Drawer */}
                {showKeyModal && (
                  <div className="mt-3 p-3.5 bg-bg-darker/95 border border-accent-cyan/40 rounded-lg text-xs space-y-3 animate-fade-in shadow-2xl max-h-[380px] overflow-y-auto custom-scroll">
                    <div className="flex items-center justify-between text-white font-bold font-mono">
                      <span className="flex items-center gap-1.5 text-accent-cyan">
                        <Cpu className="w-4 h-4" /> AI Provider & Key Settings
                      </span>
                      <button onClick={() => setShowKeyModal(false)} className="text-text-tertiary hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Provider Toggle */}
                    <div>
                      <label className="text-[11px] font-mono text-text-tertiary block mb-1.5">Active AI Model</label>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-bg-dark rounded-lg border border-border-glass">
                        {[
                          { id: 'auto', label: 'Auto' },
                          { id: 'gemini', label: 'Gemini' },
                          { id: 'openai', label: 'OpenAI' },
                        ].map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedProvider(p.id as AIProvider)}
                            className={`py-1 text-[11px] font-mono rounded transition-colors ${
                              selectedProvider === p.id
                                ? 'bg-accent-neon text-bg-dark font-bold'
                                : 'text-text-secondary hover:text-white'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Google Gemini Key */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-accent-cyan font-bold">Google Gemini API Key</span>
                        <a
                          href="https://aistudio.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-neon hover:underline text-[10px]"
                        >
                          Get Free Key ↗
                        </a>
                      </div>
                      <div className="flex gap-1">
                        <input
                          type="password"
                          value={geminiKeyInput}
                          onChange={(e) => setGeminiKeyInput(e.target.value)}
                          placeholder="AIzaSy..."
                          className="flex-1 border border-border-glass rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-accent-neon font-mono"
                          style={{ backgroundColor: '#090d1a', color: '#ffffff', colorScheme: 'dark' }}
                          autoComplete="off"
                        />
                        {geminiKeyInput && (
                          <button
                            type="button"
                            onClick={() => handleClearKey('gemini')}
                            className="px-2 text-[10px] text-red-400 hover:bg-red-500/10 rounded"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* OpenAI Key */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-accent-purple font-bold">OpenAI API Key</span>
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-purple hover:underline text-[10px]"
                        >
                          Get Key ↗
                        </a>
                      </div>
                      <div className="flex gap-1">
                        <input
                          type="password"
                          value={openAiKeyInput}
                          onChange={(e) => setOpenAiKeyInput(e.target.value)}
                          placeholder="sk-proj-..."
                          className="flex-1 border border-border-glass rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-accent-purple font-mono"
                          style={{ backgroundColor: '#090d1a', color: '#ffffff', colorScheme: 'dark' }}
                          autoComplete="off"
                        />
                        {openAiKeyInput && (
                          <button
                            type="button"
                            onClick={() => handleClearKey('openai')}
                            className="px-2 text-[10px] text-red-400 hover:bg-red-500/10 rounded"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-2 border-t border-border-glass flex items-center justify-between">
                      <span className="text-[10px] text-text-tertiary">Stored securely in browser localStorage</span>
                      <button
                        onClick={handleSaveKeys}
                        className="px-3 py-1.5 bg-accent-neon text-bg-dark font-bold font-mono rounded text-xs hover:bg-white transition-colors flex items-center gap-1.5"
                      >
                        {keySavedMessage ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-bg-dark" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <span>Save Settings</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="chatbot-messages-container"
                data-lenis-prevent
                tabIndex={0}
                role="log"
                aria-label="Chat messages"
                aria-live="polite"
                aria-atomic="false"
                style={{
                  flex: '1 1 auto',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                  padding: '1rem',
                  paddingBottom: '8rem',
                  overflowAnchor: 'none'
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg text-xs ${
                        msg.sender === 'user'
                          ? 'bg-accent-cyan/20 text-white rounded-tr-none border border-accent-cyan/40 backdrop-blur-sm'
                          : 'bg-bg-dark/80 text-text-primary rounded-tl-none border border-border-glass backdrop-blur-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed font-mono">{msg.text}</div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-3">
                    <div className="bg-bg-dark/80 p-3 rounded-lg rounded-tl-none border border-border-glass flex items-center gap-1.5">
                      <span className="text-xs text-accent-neon font-mono animate-pulse">Analyzing digital artifacts...</span>
                      <span className="w-1.5 h-1.5 bg-accent-neon rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div
                  className="px-3 py-2 bg-bg-darker/90 backdrop-blur-md border-t border-border-glass"
                  style={{
                    flexShrink: 0,
                    position: 'sticky',
                    bottom: '64px',
                    zIndex: 10,
                  }}
                >
                  <div className="flex items-center gap-1 text-[11px] text-accent-cyan mb-1.5 font-mono">
                    <Lightbulb className="w-3 h-3" /> Quick Forensic Prompts:
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-[11px] font-mono text-left px-2.5 py-1 rounded bg-bg-dark/80 hover:bg-accent-cyan/15 hover:border-accent-cyan/40 border border-border-glass text-text-secondary hover:text-white whitespace-nowrap transition-colors flex-shrink-0"
                      >
                        {suggestion.length > 35 ? suggestion.substring(0, 35) + '...' : suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form
                ref={inputFormRef}
                onSubmit={handleSendMessage}
                className="chatbot-input-form border-t border-border-glass bg-bg-darker/95 backdrop-blur-md p-3"
                style={{
                  flexShrink: 0,
                  position: 'sticky',
                  bottom: 0,
                  zIndex: 20,
                }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about tools, artifacts, memory..."
                    className="flex-1 border border-accent-cyan/40 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-text-tertiary focus:outline-none focus:border-accent-neon focus:ring-1 focus:ring-accent-neon font-mono shadow-inner transition-colors"
                    style={{
                      backgroundColor: '#090d1a',
                      color: '#ffffff',
                      caretColor: '#00f3ff',
                      colorScheme: 'dark',
                    }}
                    autoComplete="off"
                    spellCheck="false"
                    aria-label="Type your message"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="bg-accent-neon hover:bg-white text-bg-dark px-3 py-2 flex items-center justify-center font-bold"
                    aria-label="Send message"
                    disabled={isTyping}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Chat Trigger Button - Only visible when chat is closed */}
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-accent-cyan via-accent-neon to-accent-purple p-0.5 shadow-neon hover:scale-105 transition-transform duration-200 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            aria-label="Open FORENSEC Assistant"
          >
            <div className="w-full h-full rounded-full bg-bg-dark flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-accent-neon" />
            </div>
          </motion.button>
        )}
      </div>
    </>
  );
};

export default Chatbot;
