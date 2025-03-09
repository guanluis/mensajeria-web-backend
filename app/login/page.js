"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const auth_helpers_nextjs_1 = require("@supabase/auth-helpers-nextjs");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const card_1 = require("@/components/ui/card");
const tabs_1 = require("@/components/ui/tabs");
const label_1 = require("@/components/ui/label");
const lucide_react_1 = require("lucide-react");
function LoginPage() {
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const router = (0, navigation_1.useRouter)();
    const supabase = (0, auth_helpers_nextjs_1.createClientComponentClient)();
    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error)
                throw error;
            router.push("/chat");
            router.refresh();
        }
        catch (error) {
            setError(error.message || "An error occurred during sign in");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error)
                throw error;
            setError("Check your email for the confirmation link");
        }
        catch (error) {
            setError(error.message || "An error occurred during sign up");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <card_1.Card className="w-full max-w-md">
        <card_1.CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <lucide_react_1.MessageCircle className="h-6 w-6 text-primary-foreground"/>
            </div>
          </div>
          <card_1.CardTitle className="text-2xl font-bold text-center">Welcome to ChatApp</card_1.CardTitle>
          <card_1.CardDescription className="text-center">Sign in to your account or create a new one</card_1.CardDescription>
        </card_1.CardHeader>
        <tabs_1.Tabs defaultValue="signin" className="w-full">
          <tabs_1.TabsList className="grid w-full grid-cols-2">
            <tabs_1.TabsTrigger value="signin">Sign In</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="signup">Sign Up</tabs_1.TabsTrigger>
          </tabs_1.TabsList>
          <tabs_1.TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <card_1.CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label_1.Label htmlFor="email">Email</label_1.Label>
                  <input_1.Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="space-y-2">
                  <label_1.Label htmlFor="password">Password</label_1.Label>
                  <input_1.Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </card_1.CardContent>
              <card_1.CardFooter>
                <button_1.Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </button_1.Button>
              </card_1.CardFooter>
            </form>
          </tabs_1.TabsContent>
          <tabs_1.TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <card_1.CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label_1.Label htmlFor="email-signup">Email</label_1.Label>
                  <input_1.Input id="email-signup" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="space-y-2">
                  <label_1.Label htmlFor="password-signup">Password</label_1.Label>
                  <input_1.Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </card_1.CardContent>
              <card_1.CardFooter>
                <button_1.Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </button_1.Button>
              </card_1.CardFooter>
            </form>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </card_1.Card>
    </div>);
}
//# sourceMappingURL=page.js.map