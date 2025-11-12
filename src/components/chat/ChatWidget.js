"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Bot, User, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  useEffect(() => {
    if (open && !userId) startSession();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startSession = async () => {
    const res = await fetch("/api/session", { method: "POST" });
    const data = await res.json();
    setUserId(data.userId);
    setMessages([{ from: "bot", text: data.firstMessage }]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message: userMsg }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.reply) {
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
      if (data.roleState?.finalRole && data.roleState.finalRole !== "unknown") {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: `Role Detected: **${data.roleState.finalRole.toUpperCase()}**`,
            highlight: true,
          },
        ]);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border">
      <div className="bg-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <h3 className="font-bold text-lg">Support Agent</h3>
        <button
          onClick={() => setOpen(false)}
          className="hover:bg-white/20 rounded-lg p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}
          {loading && (
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-200 px-4 py-3 rounded-2xl">
                thinking...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
          />
          <Button type="submit" disabled={loading}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
