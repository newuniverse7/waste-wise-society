import { mockUsers } from "@/data/mockData";
import { Users } from "lucide-react";

export default function AdminUsers() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Manage Users</h1>
      </div>
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-xs">Name</th>
                <th className="text-left p-3 font-medium text-xs">Email</th>
                <th className="text-left p-3 font-medium text-xs">Society</th>
                <th className="text-left p-3 font-medium text-xs">Flat</th>
                <th className="text-right p-3 font-medium text-xs">Points</th>
                <th className="text-right p-3 font-medium text-xs">CO₂ Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockUsers.map((u) => (
                <tr key={u.id} className="transition-snappy hover:bg-muted/30">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3">{u.society}</td>
                  <td className="p-3">{u.flat}</td>
                  <td className="p-3 text-right text-primary font-medium">{u.points}</td>
                  <td className="p-3 text-right">{u.carbonSaved} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
