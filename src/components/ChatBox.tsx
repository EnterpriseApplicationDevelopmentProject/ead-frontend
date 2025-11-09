"use client";
import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const res = await fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages([
      ...messages,
      { user: "You", text: input },
      { user: "Bot", text: data.reply },
    ]);
    setInput("");
  };

  return (
    <div className="p-4 max-w-lg mx-auto border rounded-xl shadow bg-white">
      <div className="h-80 overflow-y-auto mb-3 p-2 border-b">
        {messages.map((msg, i) => (
          <p key={i}><b>{msg.user}:</b> {msg.text}</p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about available service slots..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-3 py-1 rounded">
          Send
        </button>
      </div>
    </div>
  );
}