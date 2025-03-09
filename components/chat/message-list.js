"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MessageList;
const react_1 = require("react");
const scroll_area_1 = require("@/components/ui/scroll-area");
const avatar_1 = require("@/components/ui/avatar");
const utils_1 = require("@/lib/utils");
const lucide_react_1 = require("lucide-react");
function MessageList({ messages, currentUserId }) {
    const scrollRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    const groupedMessages = {};
    messages.forEach((message) => {
        const date = new Date(message.createdAt).toLocaleDateString();
        if (!groupedMessages[date]) {
            groupedMessages[date] = [];
        }
        groupedMessages[date].push(message);
    });
    return (<scroll_area_1.ScrollArea className="flex-1 p-4">
      <div className="space-y-6">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (<div key={date} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"/>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">
                  {date === new Date().toLocaleDateString() ? "Today" : date}
                </span>
              </div>
            </div>

            {dateMessages.map((message) => {
                const isCurrentUser = message.senderId === currentUserId;
                return (<div key={message.id} className={(0, utils_1.cn)("flex items-end space-x-2", isCurrentUser ? "justify-end" : "justify-start")}>
                  {!isCurrentUser && (<avatar_1.Avatar className="h-8 w-8">
                      <avatar_1.AvatarFallback>
                        <lucide_react_1.User className="h-4 w-4"/>
                      </avatar_1.AvatarFallback>
                    </avatar_1.Avatar>)}

                  <div className={(0, utils_1.cn)("max-w-md rounded-lg px-4 py-2 shadow-sm", isCurrentUser ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-900")}>
                    {message.imageUrl && (<img src={message.imageUrl || "/placeholder.svg"} alt="Message attachment" className="mb-2 rounded-md max-w-full max-h-60 object-contain"/>)}
                    {message.content && <p>{message.content}</p>}
                    <span className={(0, utils_1.cn)("block text-xs mt-1", isCurrentUser ? "text-primary-foreground/80" : "text-gray-500")}>
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                    </span>
                  </div>
                </div>);
            })}
          </div>))}
        <div ref={scrollRef}/>
      </div>
    </scroll_area_1.ScrollArea>);
}
//# sourceMappingURL=message-list.js.map