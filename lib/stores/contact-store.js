"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContactStore = void 0;
const zustand_1 = require("zustand");
exports.useContactStore = (0, zustand_1.create)((set) => ({
    contacts: [],
    selectedContactId: null,
    setContacts: (contacts) => set({ contacts }),
    setSelectedContactId: (id) => set({ selectedContactId: id }),
    updateContact: (id, data) => set((state) => ({
        contacts: state.contacts.map((contact) => (contact.id === id ? { ...contact, ...data } : contact)),
    })),
}));
//# sourceMappingURL=contact-store.js.map