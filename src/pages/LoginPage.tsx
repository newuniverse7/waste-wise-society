import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recycle, ArrowLeft, Loader2, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  society: z.string().trim().max(100).optional(),
  flat: z.string().trim().max(20).optional(),
  phone: z.string().trim().max(20).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [society, setSociety] = useState("");
  const [flat, setFlat] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate("/");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ fullName, email, password, society, flat, phone });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName, society, flat, phone },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created! You're signed in.");
    navigate("/");
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />
      <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />

      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md animate-slide-up relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl gradient-primary text-primary-foreground mb-4 shadow-eco animate-pulse-glow">
            <Recycle className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold font-display">Welcome to <span className="gradient-text">EcoTrack</span></h1>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "login" ? "Sign in to continue your sustainability journey" : "Create your account in seconds"}
          </p>
        </div>

        <div className="glass rounded-2xl p-6 shadow-card">
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted/50 rounded-lg mb-5">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`py-2 text-sm font-medium rounded-md transition-smooth ${mode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-2 text-sm font-medium rounded-md transition-smooth ${mode === "signup" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Sign Up
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-11 mb-4 gap-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or with email</span></div>
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-3">
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName" className="text-xs">Full Name *</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Priya Sharma" className="mt-1 h-10" />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-xs">Email *</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-10" />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs">Password *</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 h-10" />
            </div>
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="society" className="text-xs">Society</Label>
                  <Input id="society" value={society} onChange={(e) => setSociety(e.target.value)} placeholder="Green Heights" className="mt-1 h-10" />
                </div>
                <div>
                  <Label htmlFor="flat" className="text-xs">Flat</Label>
                  <Input id="flat" value={flat} onChange={(e) => setFlat(e.target.value)} placeholder="A-204" className="mt-1 h-10" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="phone" className="text-xs">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="mt-1 h-10" />
                </div>
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full h-11 gradient-primary text-primary-foreground border-0 shadow-eco hover:shadow-glow transition-smooth font-semibold">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <><Mail className="h-4 w-4 mr-2" /> {mode === "login" ? "Sign In" : "Create Account"}</>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
