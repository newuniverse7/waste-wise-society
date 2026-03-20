import { Package, Users, Truck, Leaf, BarChart3, ShoppingBag, Building2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { analyticsData, mockPickups, mockUsers } from "@/data/mockData";
import { PickupCard } from "@/components/PickupCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { calculateSocietyIndex } from "@/lib/ecoScore";

export default function AdminDashboard() {
  const pendingPickups = mockPickups.filter((p) => p.status === "pending");
  const societyIndex = calculateSocietyIndex(mockUsers, mockPickups);
  const topSociety = societyIndex[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">System-wide analytics and management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard title="Total Waste" value={`${analyticsData.totalWaste} kg`} icon={<Package className="h-4 w-4" />} trend="+12%" />
        <StatCard title="Total Requests" value={analyticsData.totalRequests} icon={<BarChart3 className="h-4 w-4" />} />
        <StatCard title="Active Users" value={analyticsData.activeUsers} icon={<Users className="h-4 w-4" />} trend="+8%" />
        <StatCard title="Carbon Saved" value={`${analyticsData.carbonSaved} kg`} icon={<Leaf className="h-4 w-4" />} subtitle="CO₂" />
        <StatCard title="Packaging" value={`${analyticsData.packagingWaste} kg`} icon={<ShoppingBag className="h-4 w-4" />} subtitle="E-commerce" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4">Weekly Pickups</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.weeklyPickups}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="pickups" fill="hsl(149, 65%, 24%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4">Waste by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={analyticsData.wasteByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {analyticsData.wasteByType.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Society Card */}
      {topSociety && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Top Society</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">🥇 {topSociety.name}</div>
              <div className="text-xs text-muted-foreground">{topSociety.activeUsers} users · {topSociety.totalWaste} kg · {topSociety.packagingPercentage}% packaging</div>
            </div>
            <div className="text-2xl font-bold text-primary">{topSociety.sustainabilityScore}</div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Pending Pickups</h2>
          <span className="text-xs text-muted-foreground">{pendingPickups.length} awaiting assignment</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {pendingPickups.map((p) => (
            <PickupCard key={p.id} pickup={p} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Top Societies</h2>
          <button
            onClick={() => {
              const csv = "Society,Requests,Waste(kg)\n" + analyticsData.topSocieties.map(s => `${s.name},${s.requests},${s.waste}`).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "societies-report.csv";
              a.click();
            }}
            className="text-xs text-accent hover:underline"
          >
            Export CSV
          </button>
        </div>
        <div className="rounded-lg border bg-card divide-y">
          {analyticsData.topSocieties.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 text-sm">
              <span className="font-medium">{s.name}</span>
              <div className="text-xs text-muted-foreground">
                {s.requests} requests · {s.waste} kg
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
