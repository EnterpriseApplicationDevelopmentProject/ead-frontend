"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/apiClient";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatbotWidget({ customerId }: { customerId?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const storageKey = `chat_history_${customerId ?? 'default'}`;
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Restore history on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { messages?: Message[]; conversationId?: string | null };
        if (parsed.messages && Array.isArray(parsed.messages)) {
          setMessages(parsed.messages);
        }
        if (typeof parsed.conversationId === 'string' || parsed.conversationId === null) {
          setConversationId(parsed.conversationId ?? null);
        }
      }
    } catch (_) {
      // ignore parse errors
    }
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Persist on changes
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ messages, conversationId })
        );
      }
    } catch (_) {
      // ignore storage errors
    }
  }, [messages, conversationId, storageKey, hydrated]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setMessages((prev) => {
      const next: Message[] = [...prev, { role: "user" as const, text: userText }];
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify({ messages: next, conversationId }));
        }
      } catch (_) {}
      return next;
    });
    setInput("");
    setLoading(true);
    try {
      const data = await api.post("/chat", {
        message: userText,
        customerId,
        conversationId,
      });
      const newConvId = data.conversationId || conversationId;
      setConversationId(newConvId);
      const reply = typeof data.reply === "string" ? data.reply : JSON.stringify(data.reply);
      setMessages((prev) => {
        const next: Message[] = [...prev, { role: "bot" as const, text: reply }];
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify({ messages: next, conversationId: newConvId }));
          }
        } catch (_) {}
        return next;
      });
    } catch (e) {
      setMessages((prev) => {
        const next: Message[] = [
          ...prev,
          { role: "bot" as const, text: "Sorry, I couldn't process that. Please try again." },
        ];
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify({ messages: next, conversationId }));
          }
        } catch (_) {}
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
            Ask anything about services, pricing, or your appointments.
          </div>
        ) : (
          messages.map((m, idx) => (
            <div
              key={idx}
              className={`${
                m.role === "user" ? "justify-end" : "justify-start"
              } flex w-full`}
            >
              <div
                className={`${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border"
                } px-3 py-2 rounded-lg max-w-[80%] text-sm`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t bg-white flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
