"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatPage;
const navigation_1 = require("next/navigation");
const auth_helpers_nextjs_1 = require("@supabase/auth-helpers-nextjs");
const headers_1 = require("next/headers");
const chat_layout_1 = require("@/components/chat/chat-layout");
async function ChatPage() {
    const supabase = (0, auth_helpers_nextjs_1.createServerComponentClient)({ cookies: headers_1.cookies });
    const { data: { session }, } = await supabase.auth.getSession();
    if (!session) {
        (0, navigation_1.redirect)("/login");
    }
    return <chat_layout_1.default userId={session.user.id}/>;
}
//# sourceMappingURL=page.js.map