import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Recycle, Leaf, Truck, Trophy, ArrowRight, Sparkles, Brain, Target, Gift, BarChart3, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

function useCountUp(target: number, duration = 1600, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
}

function Stat({ value, suffix, label, start }: { value: number; suffix?: string; label: string; start: boolean }) {
  const n = useCountUp(value, 1800, start);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text font-display">
        {n.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

const features = [
  { icon: Truck, title: "Smart Pickups", desc: "Schedule with time slots, QR verification, and live worker tracking." },
  { icon: Brain, title: "AI Waste Classifier", desc: "Snap a photo — get instant classification and routing suggestions." },
  { icon: Trophy, title: "Gamified Rewards", desc: "Earn points, unlock badges, and climb society leaderboards." },
  { icon: Target, title: "Community Challenges", desc: "Weekly goals that turn recycling into a team sport." },
  { icon: Gift, title: "Rewards Marketplace", desc: "Redeem points for plants, vouchers, and eco-products." },
  { icon: BarChart3, title: "Impact Analytics", desc: "Track CO₂ saved, packaging waste, and society sustainability." },
];

export default function Landing() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStatsVisible(true),
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-eco">
              <Recycle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">EcoTrack <span className="gradient-text">MBMC</span></span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0 shadow-eco hover:shadow-glow transition-smooth">
                Sign In <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-accent/20 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />

        <div className="container relative pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Smart Reverse Logistics for Modern Societies
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.05] tracking-tight">
              Turn packaging waste into{" "}
              <span className="gradient-text">community impact</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
              EcoTrack MBMC connects residents, workers, and municipal admins on one platform — schedule pickups, track impact, earn rewards, and build a greener society together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Link to="/login">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 shadow-eco hover:shadow-glow transition-smooth h-12 px-8">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="h-12 px-8 border-2 hover:bg-primary/5">
                  Explore Features
                </Button>
              </a>
            </div>

            {/* Floating preview cards */}
            <div className="relative mt-16 h-32 hidden md:block">
              <div className="absolute left-1/4 top-0 glass rounded-2xl p-4 shadow-card animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">CO₂ saved</div>
                    <div className="font-bold">512 kg</div>
                  </div>
                </div>
              </div>
              <div className="absolute right-1/4 top-8 glass rounded-2xl p-4 shadow-card animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">EcoScore</div>
                    <div className="font-bold gradient-text">87 / 100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="border-y border-border/50 bg-secondary/30 py-12">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat value={342} label="Pickups completed" start={statsVisible} />
          <Stat value={156} suffix=" kg" label="Waste recycled" start={statsVisible} />
          <Stat value={89} label="Active residents" start={statsVisible} />
          <Stat value={512} suffix=" kg" label="CO₂ saved" start={statsVisible} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-5xl font-bold font-display">
            Everything you need to <span className="gradient-text">recycle smarter</span>
          </h2>
          <p className="text-muted-foreground mt-4">From scheduling to insights — built for residents, workers, and admins.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl border border-border bg-card hover-lift"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-eco mb-4 group-hover:scale-110 transition-smooth">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Leaf, title: "For Residents", desc: "Request pickups, track rewards, climb leaderboards.", color: "primary" },
            { icon: Truck, title: "For Workers", desc: "Manage routes, scan QR, update statuses on the go.", color: "accent" },
            { icon: ShieldCheck, title: "For Admins", desc: "Real-time analytics, exports, and operational control.", color: "primary" },
          ].map((r) => (
            <div key={r.title} className="p-8 rounded-2xl gradient-hero text-primary-foreground shadow-eco hover-lift">
              <r.icon className="h-8 w-8 mb-3" />
              <h3 className="font-display text-xl font-bold">{r.title}</h3>
              <p className="text-sm text-primary-foreground/85 mt-2">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 md:p-16 text-center shadow-eco">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <MapPin className="h-10 w-10 text-primary-foreground mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground font-display">
              Ready to make your society greener?
            </h2>
            <p className="text-primary-foreground/85 mt-3 max-w-xl mx-auto">
              Join EcoTrack MBMC today — the demo is open, no signup required.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="mt-6 h-12 px-8 hover-scale">
                Try the Demo <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        © 2026 EcoTrack MBMC · Smart Reverse Logistics & Sustainability Platform
      </footer>
    </div>
  );
}
