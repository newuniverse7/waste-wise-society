import { analyticsData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { BarChart3 } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Analytics</h1>
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

        <div className="rounded-lg border bg-card p-4 md:col-span-2">
          <h3 className="text-sm font-semibold mb-4">Pickup Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData.weeklyPickups}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="pickups" stroke="hsl(201, 96%, 40%)" strokeWidth={2} dot={{ fill: "hsl(201, 96%, 40%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
