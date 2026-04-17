import { useEffect, useState } from "react";
import { Leaf, TreePine, Car, Droplets, Zap, Wind, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockUsers, mockPickups } from "@/data/mockData";

function useCount(target: number, ms = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

function ImpactStat({ icon: Icon, value, suffix, label, sublabel, color }: { icon: typeof Leaf; value: number; suffix: string; label: string; sublabel: string; color: string }) {
  const animated = useCount(value);
  return (
    <div className="glass rounded-2xl p-5 hover-lift shadow-card">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3`} style={{ background: `hsl(${color} / 0.15)`, color: `hsl(${color})` }}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl font-bold font-display gradient-text">
        {animated.toFixed(animated < 10 ? 1 : 0)}{suffix}
      </div>
      <div className="text-sm font-medium mt-1">{label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sublabel}</div>
    </div>
  );
}

export default function CarbonImpact() {
  const { auth } = useAuth();
  const user = mockUsers.find((u) => u.id === auth.userId);
  const userPickups = mockPickups.filter((p) => p.userId === auth.userId);
  const carbon = user?.carbonSaved || 45.2;

  // Impact equivalences (rough estimates for educational purposes)
  const trees = carbon / 21; // 1 tree absorbs ~21kg CO2/year
  const carKm = carbon * 4; // 0.25 kg CO2 per km in average car
  const waterLiters = carbon * 12;
  const phoneCharges = carbon * 122;
  const lightbulbs = carbon * 8.5;

  const totalWaste = userPickups.reduce((s, p) => s + (p.weight || 0), 0);
  const completedPickups = userPickups.filter((p) => p.status === "completed").length;

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-eco">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold font-display">Your Carbon Impact</h1>
          <p className="text-sm text-muted-foreground">See the real-world value of your recycling</p>
        </div>
      </div>

      {/* Hero stat */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10 text-primary-foreground shadow-eco">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="relative">
          <div className="text-sm font-medium opacity-90">Total CO₂ saved</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-6xl md:text-7xl font-bold font-display">{useCount(carbon).toFixed(1)}</span>
            <span className="text-2xl opacity-80">kg</span>
          </div>
          <div className="text-sm mt-2 opacity-85">
            From {completedPickups} pickups · {totalWaste.toFixed(1)} kg waste recycled
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3 font-display flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" /> What this means in real life
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ImpactStat icon={TreePine} value={trees} suffix="" label="Trees worth of CO₂" sublabel="annual absorption" color="142 71% 35%" />
          <ImpactStat icon={Car} value={carKm} suffix=" km" label="Car driving avoided" sublabel="average petrol car" color="201 96% 40%" />
          <ImpactStat icon={Droplets} value={waterLiters} suffix=" L" label="Water saved" sublabel="vs landfill processing" color="200 80% 50%" />
          <ImpactStat icon={Zap} value={phoneCharges} suffix="" label="Phone charges" sublabel="energy equivalent" color="48 96% 45%" />
          <ImpactStat icon={Wind} value={lightbulbs} suffix=" hrs" label="LED bulb lit" sublabel="10W bulb equivalent" color="38 92% 50%" />
          <ImpactStat icon={Leaf} value={carbon * 0.85} suffix=" m²" label="Forest preserved" sublabel="ecosystem equivalent" color="158 84% 30%" />
        </div>
      </div>

      {/* Yearly forecast */}
      <div className="glass rounded-2xl p-6 shadow-card">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" /> Your projected yearly impact
        </h3>
        <p className="text-xs text-muted-foreground mt-1">If you maintain your current pace</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <div className="text-2xl font-bold font-display">{(carbon * 12).toFixed(0)} kg</div>
            <div className="text-xs text-muted-foreground">CO₂ per year</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-display">{(trees * 12).toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Trees / year</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-display">{(carKm * 12).toFixed(0)} km</div>
            <div className="text-xs text-muted-foreground">Driving / year</div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Estimates based on EPA & WHO carbon equivalency data for educational purposes.
      </p>
    </div>
  );
}
