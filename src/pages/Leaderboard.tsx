import { mockUsers } from "@/data/mockData";
import { Trophy, Leaf, Medal } from "lucide-react";

export default function Leaderboard() {
  const sorted = [...mockUsers].sort((a, b) => b.points - a.points);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Leaderboard</h1>
      </div>

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
            <div className="text-right">
              <div className="font-semibold text-sm text-primary">{user.points.toLocaleString()} pts</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                <Leaf className="h-3 w-3" />
                {user.carbonSaved} kg CO₂
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
