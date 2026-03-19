import { analyticsData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { BarChart3, Package, TrendingUp, Leaf } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function AdminAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Analytics</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Waste" value={`${analyticsData.totalWaste} kg`} icon={<Package className="h-4 w-4" />} trend="+12%" />
        <StatCard title="Total Requests" value={analyticsData.totalRequests} icon={<BarChart3 className="h-4 w-4" />} trend="+18%" />
        <StatCard title="Packaging Waste" value={`${analyticsData.packagingWaste} kg`} icon={<Package className="h-4 w-4" />} subtitle="E-commerce" />
        <StatCard title="Carbon Saved" value={`${analyticsData.carbonSaved} kg`} icon={<Leaf className="h-4 w-4" />} subtitle="CO₂" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4">Weekly Pickups</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.weeklyPickups}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="pickups" fill="hsl(149, 65%, 24%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4">Waste Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={analyticsData.wasteByType} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {analyticsData.wasteByType.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analyticsData.monthlyTrend}>
              <defs>
                <linearGradient id="colorPickups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(149, 65%, 24%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(149, 65%, 24%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="pickups" stroke="hsl(149, 65%, 24%)" fill="url(#colorPickups)" strokeWidth={2} />
              <Area type="monotone" dataKey="waste" stroke="hsl(201, 96%, 40%)" fill="none" strokeWidth={2} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-warning" />
            E-commerce Packaging Stats
          </h3>
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-primary">{analyticsData.packagingWaste} kg</div>
              <div className="text-xs text-muted-foreground mt-1">packaging waste collected</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-primary/5 p-3 text-center">
                <div className="text-lg font-semibold">{analyticsData.packagingRequests}</div>
                <div className="text-xs text-muted-foreground">requests</div>
              </div>
              <div className="rounded-md bg-accent/5 p-3 text-center">
                <div className="text-lg font-semibold">{((analyticsData.packagingWaste / analyticsData.totalWaste) * 100).toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">of total waste</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
