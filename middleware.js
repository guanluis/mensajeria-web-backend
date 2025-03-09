"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
const auth_helpers_nextjs_1 = require("@supabase/auth-helpers-nextjs");
const server_1 = require("next/server");
async function middleware(req) {
    const res = server_1.NextResponse.next();
    const supabase = (0, auth_helpers_nextjs_1.createMiddlewareClient)({ req, res });
    const { data: { session }, } = await supabase.auth.getSession();
    if (!session && req.nextUrl.pathname !== "/login") {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/login";
        return server_1.NextResponse.redirect(redirectUrl);
    }
    return res;
}
exports.config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
//# sourceMappingURL=middleware.js.map