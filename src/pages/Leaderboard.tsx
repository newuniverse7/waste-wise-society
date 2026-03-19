import { mockUsers } from "@/data/mockData";
import { Trophy, Leaf } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Leaderboard() {
  const sorted = [...mockUsers].sort((a, b) => b.points - a.points);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Leaderboard</h1>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {sorted.slice(0, 3).map((user, i) => (
          <div
            key={user.id}
            className={`rounded-lg border bg-card p-4 text-center transition-snappy hover:border-primary/30 ${
              i === 0 ? "ring-2 ring-primary/20" : ""
            }`}
          >
            <span className="text-2xl">{medals[i]}</span>
            <div className="font-semibold text-sm mt-2">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.society}</div>
            <div className="text-lg font-bold text-primary mt-1">{user.points.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">points</div>
            {user.badges && user.badges.length > 0 && (
              <div className="flex justify-center gap-1 mt-2">
                {user.badges.map((badge) => (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                      <span className="text-sm cursor-default">{badge.icon}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium text-xs">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full Ranking */}
      <div className="rounded-lg border bg-card divide-y">
        {sorted.map((user, i) => (
          <div key={user.id} className="flex items-center gap-4 p-4">
            <div className="w-8 text-center">
              {i < 3 ? (
                <span className="text-lg">{medals[i]}</span>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">#{i + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.society} · {user.flat}</div>
            </div>
            <div className="flex items-center gap-2">
              {user.badges && user.badges.length > 0 && (
                <div className="flex gap-0.5">
                  {user.badges.map((badge) => (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger asChild>
                        <span className="text-xs cursor-default">{badge.icon}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium text-xs">{badge.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              )}
              <div className="text-right">
                <div className="font-semibold text-sm text-primary">{user.points.toLocaleString()} pts</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Leaf className="h-3 w-3" />
                  {user.carbonSaved} kg CO₂
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
