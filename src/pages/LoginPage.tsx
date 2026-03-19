import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recycle } from "lucide-react";
import { UserRole } from "@/data/types";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const names: Record<UserRole, string> = {
      user: "Priya Sharma",
      admin: "Admin User",
      worker: "Suresh Kumar",
    };
    const ids: Record<UserRole, string> = { user: "u1", admin: "a1", worker: "w1" };
    login(selectedRole, ids[selectedRole], names[selectedRole]);
  };

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: "user", label: "Resident", desc: "Request pickups & track recycling" },
    { value: "admin", label: "Admin", desc: "Manage operations & analytics" },
    { value: "worker", label: "Worker", desc: "Handle assigned pickups" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary text-primary-foreground mb-4">
            <Recycle className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">EcoTrack MBMC</h1>
          <p className="text-sm text-muted-foreground mt-1">Packaging Waste & Recycling Management</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setSelectedRole(r.value)}
                className={`p-3 rounded-md border text-center transition-snappy text-xs ${
                  selectedRole === r.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="font-medium">{r.label}</div>
                <div className="text-muted-foreground mt-0.5 leading-tight">{r.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In as {roles.find(r => r.value === selectedRole)?.label}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo app — click Sign In with any credentials
          </p>
        </div>
      </div>
    </div>
  );
}
