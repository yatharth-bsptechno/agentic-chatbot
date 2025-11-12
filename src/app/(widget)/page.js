"use client";
import ChatWidget from "@/components/chat/ChatWidget";
import { MessageCircle } from "lucide-react";

export default function WidgetPage() {
  return (
    <>
      <ChatWidget />
      <button
        onClick={() => window.dispatchEvent(new Event("open-chat"))}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-5 rounded-full shadow-2xl hover:bg-purple-700 z-50 transition-all hover:scale-110"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    </>
  );
}
