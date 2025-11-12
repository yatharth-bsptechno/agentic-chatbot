import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Sparkles } from "lucide-react";

export default function MessageBubble({ message }) {
  const isUser = message.from === "user";
  const isHighlight = message.highlight;

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback
            className={isHighlight ? "bg-green-600" : "bg-purple-600"}
          >
            {isHighlight ? (
              <Sparkles className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`px-4 py-3 rounded-2xl max-w-xs ${
          isUser
            ? "bg-blue-600 text-white"
            : isHighlight
            ? "bg-green-600 text-white font-bold"
            : "bg-gray-200"
        }`}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: message.text.replace(
              /\*\*(.*?)\*\*/g,
              "<strong>$1</strong>"
            ),
          }}
        />
      </div>
      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-600">
            <User className="w-5 h-5 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
