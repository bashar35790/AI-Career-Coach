'use client';

import { useState, useRef, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { fetchConversations, fetchConversation } from '@/lib/api-utils';
import api from '@/lib/api';
import { MessageSquare, Plus, Send, Menu, X } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationSummary {
  _id: string;
  title: string;
  createdAt: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations().then(setConversations).catch(() => { });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadConversation(id: string) {
    try {
      const conv = await fetchConversation(id);
      setConversationId(id);
      setMessages(conv.messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })));
      setSidebarOpen(false);
    } catch {
      // ignore
    }
  }

  function newConversation() {
    setConversationId(null);
    setMessages([]);
    setInput('');
    setSidebarOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    setLoading(true);
    setStreaming(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${api.defaults.baseURL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage, conversationId }),
      });

      if (!res.ok) {
        let errMsg = 'Chat failed';
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch { }
        throw new Error(errMsg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      let fullResponse = '';
      let newConvId = conversationId;

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.chunk) {
              fullResponse += parsed.chunk;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: fullResponse };
                return updated;
              });
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.done) {
              newConvId = parsed.conversationId;
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      if (newConvId && newConvId !== conversationId) {
        setConversationId(newConvId);
        const convs = await fetchConversations();
        setConversations(convs);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      const msg = error.response?.data?.error || error.message || 'Sorry, I encountered an error. Please try again.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: msg },
      ]);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  return (
    <AuthGuard>
      <div className="flex h-[calc(100vh-4rem)] relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── Sidebar ─── */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-[70] w-72 h-full bg-zinc-900/95 backdrop-blur-xl border-r border-border flex flex-col transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:z-40`}
        >
          {/* sidebar header */}
          <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text tracking-wide uppercase">Conversations</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md text-text-muted hover:text-text hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={newConversation}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          {/* conversation list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {conversations.length === 0 && (
              <div className="text-center py-12 px-4">
                <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-text-muted">No conversations yet</p>
                <p className="text-xs text-zinc-600 mt-1">Start a new chat to begin</p>
              </div>
            )}
            {conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => loadConversation(conv._id)}
                className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-all ${
                  conv._id === conversationId
                    ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                    : 'text-text-muted hover:bg-zinc-800 hover:text-text border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${conv._id === conversationId ? 'text-primary' : 'text-zinc-600'}`} />
                  <span className="line-clamp-1">{conv.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* sidebar footer */}
          <div className="p-3 border-t border-border">
            <p className="text-xs text-zinc-600 text-center">AI Career Coach</p>
          </div>
        </aside>

        {/* ─── Main Chat Area ─── */}
        <div className="flex-1 flex flex-col min-w-0 bg-black lg:ml-0">
          {/* mobile top bar */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-zinc-900/50 backdrop-blur-xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-text-muted hover:text-text rounded-lg hover:bg-zinc-800 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm text-text">AI Career Assistant</span>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-lg">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">AI Career Assistant</h2>
                  <p className="text-text-muted text-sm mb-8 max-w-sm mx-auto">
                    Ask me anything about your career — job search, skill development, interview prep, and more.
                  </p>
                  <div className="space-y-2.5 max-w-md mx-auto">
                    {[
                      'How should I prepare for a behavioral interview?',
                      'What skills should I learn for cloud computing?',
                      'Help me optimize my LinkedIn profile',
                      'How do I negotiate a job offer?',
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => { setInput(suggestion); }}
                        className="block w-full text-left px-4 py-3 bg-zinc-900 border border-border rounded-xl text-sm text-text-muted hover:border-primary/40 hover:text-text hover:bg-zinc-800/80 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] lg:max-w-[65%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-zinc-900 border border-border text-text rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {streaming && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* input bar */}
          <div className="border-t border-border bg-zinc-900/50 backdrop-blur-xl p-4">
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-zinc-900 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 disabled:opacity-50 text-sm placeholder:text-zinc-600 transition-all"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-5 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
