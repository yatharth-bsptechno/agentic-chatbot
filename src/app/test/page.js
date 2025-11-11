"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatTest() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    startSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
            text: `I've identified you as: **${data.roleState.finalRole.toUpperCase()}**`,
            highlight: true,
          },
        ]);
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#6366f1" }}>
        Agentic Chatbot - Live Test
      </h1>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          height: "500px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "1rem",
            overflowY: "auto",
            background: "#f9fafb",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                margin: "0.5rem 0",
                textAlign: m.from === "user" ? "right" : "left",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  maxWidth: "80%",
                  padding: "0.75rem 1rem",
                  borderRadius: "18px",
                  background:
                    m.from === "user"
                      ? "#6366f1"
                      : m.highlight
                      ? "#10b981"
                      : "#e5e7eb",
                  color: m.from === "user" || m.highlight ? "white" : "black",
                  fontWeight: m.highlight ? "bold" : "normal",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: m.text.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>"
                    ),
                  }}
                />
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "0.75rem 1rem",
                  borderRadius: "18px",
                  background: "#e5e7eb",
                }}
              >
                thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={sendMessage}
          style={{
            padding: "1rem",
            borderTop: "1px solid #ddd",
            background: "white",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          marginTop: "1rem",
          textAlign: "center",
          color: "#666",
          fontSize: "0.9rem",
        }}
      >
        Test role detection: Try saying "I want to resell your product" or "I'm
        a service partner"
      </div>
    </div>
  );
}
