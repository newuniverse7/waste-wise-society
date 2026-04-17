import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recycle, ArrowLeft, Leaf, Truck, ShieldCheck } from "lucide-react";
import { UserRole } from "@/data/types";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const names: Record<UserRole, string> = { user: "Priya Sharma", admin: "Admin User", worker: "Suresh Kumar" };
    const ids: Record<UserRole, string> = { user: "u1", admin: "a1", worker: "w1" };
    login(selectedRole, ids[selectedRole], names[selectedRole]);
  };

  const roles: { value: UserRole; label: string; desc: string; icon: typeof Leaf }[] = [
    { value: "user", label: "Resident", desc: "Track recycling", icon: Leaf },
    { value: "admin", label: "Admin", desc: "Manage operations", icon: ShieldCheck },
    { value: "worker", label: "Worker", desc: "Handle pickups", icon: Truck },
  ];

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
          <p className="text-sm text-muted-foreground mt-2">Sign in to continue your sustainability journey</p>
        </div>

        <div className="glass rounded-2xl p-6 shadow-card">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Choose your role</Label>
          <div className="grid grid-cols-3 gap-2 mt-2 mb-5">
            {roles.map((r) => {
              const Icon = r.icon;
              const active = selectedRole === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSelectedRole(r.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-smooth ${
                    active
                      ? "border-primary bg-primary/5 shadow-eco"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <Icon className={`h-5 w-5 mx-auto mb-1 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <div className={`text-xs font-semibold ${active ? "text-primary" : ""}`}>{r.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{r.desc}</div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-11" />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 h-11" />
            </div>
            <Button type="submit" className="w-full h-11 gradient-primary text-primary-foreground border-0 shadow-eco hover:shadow-glow transition-smooth font-semibold">
              Sign In as {roles.find((r) => r.value === selectedRole)?.label}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo app — any credentials will work ✨
          </p>
        </div>
      </div>
    </div>
  );
}
