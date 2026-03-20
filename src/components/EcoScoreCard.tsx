import { EcoScoreResult, LEVEL_BG, LEVEL_COLORS } from "@/lib/ecoScore";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

interface EcoScoreCardProps {
  ecoScore: EcoScoreResult;
}

export function EcoScoreCard({ ecoScore }: EcoScoreCardProps) {
  const { score, level, levelProgress, breakdown } = ecoScore;

  const breakdownItems = [
    { label: "Frequency", value: breakdown.frequency, max: 30 },
    { label: "Waste Impact", value: breakdown.wasteImpact, max: 30 },
    { label: "Packaging", value: breakdown.packagingContribution, max: 20 },
    { label: "Diversity", value: breakdown.diversity, max: 20 },
  ];

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">EcoScore</h3>
        <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full border ${LEVEL_BG[level]}`}>
          {level}
        </span>
      </div>

      {/* Score circle */}
      <div className="flex items-center gap-5 mb-4">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={LEVEL_COLORS[level]}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${score * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{score}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {breakdownItems.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}/{item.max}</span>
              </div>
              <Progress value={(item.value / item.max) * 100} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Level progress */}
      <div className="text-xs text-muted-foreground mb-1">
        Progress to next level
      </div>
      <Progress value={levelProgress} className="h-2" />
      <div className="text-xs text-muted-foreground mt-1 text-right">{levelProgress}%</div>
    </div>
  );
}
