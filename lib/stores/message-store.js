"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageStore = void 0;
const zustand_1 = require("zustand");
exports.useMessageStore = (0, zustand_1.create)((set) => ({
    messages: [],
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
    })),
}));
//# sourceMappingURL=message-store.js.map