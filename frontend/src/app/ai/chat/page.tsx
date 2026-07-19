'use client';

import { useState, useRef, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { fetchConversations, fetchConversation } from '@/lib/api-utils';
import api from '@/lib/api';

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
    fetchConversations().then(setConversations).catch(() => {});
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

      if (!res.ok) throw new Error('Chat failed');

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
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Sorry, I encountered an error. Please try again.';
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
      <div className="flex h-[calc(100vh-8rem)]">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-72 flex-shrink-0 border-r border-border bg-white overflow-y-auto`}>
          <div className="p-4 border-b border-border">
            <button
              onClick={newConversation}
              className="w-full py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              + New Chat
            </button>
          </div>
          <div className="p-2 space-y-1">
            {conversations.length === 0 && (
              <p className="text-xs text-text-muted text-center py-4">No conversations yet</p>
            )}
            {conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => loadConversation(conv._id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  conv._id === conversationId
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-muted hover:bg-surface-muted'
                }`}
              >
                <span className="line-clamp-1">{conv.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col max-w-full">
          <div className="md:hidden px-4 py-2 border-b border-border">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sm text-primary font-medium"
            >
              {sidebarOpen ? 'Close History' : 'Conversations'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <h2 className="text-2xl font-bold mb-2">AI Career Assistant</h2>
                  <p className="text-text-muted">
                    Ask me anything about your career — job search, skill development, interview prep, and more.
                  </p>
                  <div className="mt-6 space-y-2">
                    {[
                      'How should I prepare for a behavioral interview?',
                      'What skills should I learn for cloud computing?',
                      'Help me optimize my LinkedIn profile',
                      'How do I negotiate a job offer?',
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(suggestion);
                        }}
                        className="block w-full text-left px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
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
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border text-text'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {streaming && (
              <div className="flex justify-start">
                <div className="bg-white border border-border rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border bg-white p-4">
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
