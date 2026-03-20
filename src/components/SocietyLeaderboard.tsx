import { SocietyIndex } from "@/lib/ecoScore";
import { Progress } from "@/components/ui/progress";
import { Building2, Leaf, Package } from "lucide-react";

interface SocietyLeaderboardProps {
  societies: SocietyIndex[];
}

export function SocietyLeaderboard({ societies }: SocietyLeaderboardProps) {
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-3">
      {societies.map((s) => (
        <div
          key={s.name}
          className={`rounded-lg border bg-card p-4 transition-snappy hover:border-primary/30 ${
            s.rank === 1 ? "ring-2 ring-primary/20" : ""
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg w-7 text-center">
              {s.rank <= 3 ? medals[s.rank - 1] : `#${s.rank}`}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {s.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {s.activeUsers} active users
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{s.sustainabilityScore}</div>
              <div className="text-xs text-muted-foreground">score</div>
            </div>
          </div>

          <Progress value={s.sustainabilityScore} className="h-1.5 mb-3" />

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-3 w-3" />
              {s.totalWaste} kg
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Leaf className="h-3 w-3" />
              Avg {s.avgEcoScore}
            </div>
            <div className="text-muted-foreground">
              {s.packagingPercentage}% packaging
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
