import { mockWorkers } from "@/data/mockData";
import { Truck } from "lucide-react";

export default function AdminWorkers() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Manage Workers</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {mockWorkers.map((w) => (
          <div key={w.id} className="rounded-lg border bg-card p-4">
            <div className="font-medium">{w.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{w.email} · {w.phone}</div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div>
                <span className="text-muted-foreground">Zone</span>
                <div className="font-medium">{w.zone}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Active</span>
                <div className="font-medium text-accent">{w.activePickups}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Done Today</span>
                <div className="font-medium text-success">{w.completedToday}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
