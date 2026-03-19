import { Package, Leaf, Trophy, Truck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PickupCard } from "@/components/PickupCard";
import { mockPickups, mockRewardActivities } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const { auth } = useAuth();
  const userPickups = mockPickups.filter((p) => p.userId === auth.userId);
  const recentPickups = userPickups.slice(0, 3);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold">Welcome back, {auth.userName.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Track your recycling impact</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Reward Points" value="1,250" icon={<Trophy className="h-4 w-4" />} trend="+25 today" />
        <StatCard title="Carbon Saved" value="45.2 kg" icon={<Leaf className="h-4 w-4" />} subtitle="CO₂ equivalent" />
        <StatCard title="Total Pickups" value={userPickups.length} icon={<Package className="h-4 w-4" />} />
        <StatCard title="Active" value={userPickups.filter((p) => p.status !== "completed").length} icon={<Truck className="h-4 w-4" />} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recent Requests</h2>
        <div className="flex gap-2">
          <Link to="/dashboard/history">
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </Link>
          <Link to="/dashboard/request">
            <Button size="sm" className="text-xs">New Pickup</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {recentPickups.map((p) => (
          <PickupCard key={p.id} pickup={p} />
        ))}
        {recentPickups.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground">
            No pickup requests yet. Start recycling today!
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3">Recent Rewards</h2>
        <div className="rounded-lg border bg-card divide-y">
          {mockRewardActivities.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 text-sm">
              <div>
                <div className="font-medium text-xs">{r.action}</div>
                <div className="text-xs text-muted-foreground">{r.date}</div>
              </div>
              <span className="text-primary font-semibold text-sm">+{r.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
