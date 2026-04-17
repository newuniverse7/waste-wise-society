import { useState } from "react";
import { Target, Users, Calendar, Trophy, Flame, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { celebrate } from "@/lib/confetti";
import { toast } from "sonner";

type Challenge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  unit: string;
  reward: number;
  participants: number;
  daysLeft: number;
  joined: boolean;
  category: "weekly" | "monthly" | "society";
};

const initial: Challenge[] = [
  { id: "c1", title: "Plastic-Free Week", description: "Recycle 5kg of plastic this week", icon: "♻️", current: 3.2, target: 5, unit: "kg", reward: 150, participants: 47, daysLeft: 3, joined: true, category: "weekly" },
  { id: "c2", title: "Cardboard Crusher", description: "Submit 10 cardboard pickups this month", icon: "📦", current: 6, target: 10, unit: "pickups", reward: 250, participants: 89, daysLeft: 14, joined: true, category: "monthly" },
  { id: "c3", title: "E-Waste Hero", description: "Recycle 2kg of electronic waste", icon: "🔌", current: 0, target: 2, unit: "kg", reward: 300, participants: 23, daysLeft: 21, joined: false, category: "monthly" },
  { id: "c4", title: "Society Sprint", description: "Green Valley Towers — collective 100kg goal", icon: "🏘️", current: 67, target: 100, unit: "kg", reward: 500, participants: 34, daysLeft: 9, joined: true, category: "society" },
  { id: "c5", title: "Morning Recycler", description: "Schedule 5 morning pickups", icon: "🌅", current: 2, target: 5, unit: "pickups", reward: 100, participants: 56, daysLeft: 7, joined: false, category: "weekly" },
  { id: "c6", title: "Packaging Patrol", description: "Recycle 8 e-commerce packages", icon: "📮", current: 5, target: 8, unit: "packages", reward: 200, participants: 71, daysLeft: 5, joined: true, category: "weekly" },
];

const categoryStyle = {
  weekly: { label: "Weekly", icon: Calendar, bg: "bg-accent/10 text-accent border-accent/20" },
  monthly: { label: "Monthly", icon: Flame, bg: "bg-warning/10 text-warning border-warning/20" },
  society: { label: "Society", icon: Users, bg: "bg-primary/10 text-primary border-primary/20" },
};

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(initial);

  const toggleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const joined = !c.joined;
        if (joined) {
          celebrate("small");
          toast.success(`Joined "${c.title}" 🎯`);
        } else {
          toast.info(`Left "${c.title}"`);
        }
        return { ...c, joined };
      })
    );
  };

  const joined = challenges.filter((c) => c.joined);
  const totalReward = joined.reduce((s, c) => s + c.reward, 0);

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-eco">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-display">Community Challenges</h1>
            <p className="text-sm text-muted-foreground">Join goals, earn rewards, build a greener society</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 hover-lift">
          <Target className="h-4 w-4 text-primary mb-2" />
          <div className="text-2xl font-bold font-display">{joined.length}</div>
          <div className="text-xs text-muted-foreground">Active challenges</div>
        </div>
        <div className="glass rounded-xl p-4 hover-lift">
          <Trophy className="h-4 w-4 text-accent mb-2" />
          <div className="text-2xl font-bold font-display gradient-text">{totalReward}</div>
          <div className="text-xs text-muted-foreground">Potential reward points</div>
        </div>
        <div className="glass rounded-xl p-4 hover-lift">
          <CheckCircle2 className="h-4 w-4 text-success mb-2" />
          <div className="text-2xl font-bold font-display">3</div>
          <div className="text-xs text-muted-foreground">Completed this month</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {challenges.map((c) => {
          const pct = Math.min(100, (c.current / c.target) * 100);
          const completed = pct >= 100;
          const style = categoryStyle[c.category];
          const Icon = style.icon;
          return (
            <div key={c.id} className="glass rounded-2xl p-5 shadow-card hover-lift">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{c.icon}</div>
                  <div>
                    <h3 className="font-display font-semibold">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-1 rounded-full border inline-flex items-center gap-1 ${style.bg}`}>
                  <Icon className="h-2.5 w-2.5" /> {style.label}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium">{c.current} / {c.target} {c.unit}</span>
                  <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.participants}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {c.daysLeft}d left</span>
                  <span className="inline-flex items-center gap-1 text-primary font-semibold"><Trophy className="h-3 w-3" /> +{c.reward}</span>
                </div>
                <Button
                  size="sm"
                  variant={c.joined ? "outline" : "default"}
                  onClick={() => toggleJoin(c.id)}
                  className={!c.joined ? "gradient-primary text-primary-foreground border-0" : ""}
                  disabled={completed}
                >
                  {completed ? "Done!" : c.joined ? "Joined" : "Join"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
