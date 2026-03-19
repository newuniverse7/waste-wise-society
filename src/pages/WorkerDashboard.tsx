import { useState } from "react";
import { mockPickups } from "@/data/mockData";
import { PickupCard } from "@/components/PickupCard";
import { ClipboardList, Truck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { toast } from "sonner";
import { PickupRequest } from "@/data/types";

export default function WorkerDashboard() {
  const [pickups, setPickups] = useState<PickupRequest[]>(
    mockPickups.filter((p) => p.workerId === "w1" || p.status === "pending")
  );

  const handleStatusChange = (id: string, status: string) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: status as PickupRequest["status"], workerId: "w1", workerName: "Suresh Kumar" } : p))
    );
    toast.success(`Pickup ${id} updated to ${status.replace("_", " ")}`);
  };

  const active = pickups.filter((p) => p.status === "in_progress");
  const pending = pickups.filter((p) => p.status === "pending");
  const completed = pickups.filter((p) => p.status === "completed");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold">Worker Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your assigned pickups</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard title="Pending" value={pending.length} icon={<ClipboardList className="h-4 w-4" />} />
        <StatCard title="In Progress" value={active.length} icon={<Truck className="h-4 w-4" />} />
        <StatCard title="Completed" value={completed.length} icon={<ClipboardList className="h-4 w-4" />} />
      </div>

      {active.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Active Pickups</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {active.map((p) => (
              <PickupCard key={p.id} pickup={p} showActions onStatusChange={handleStatusChange} />
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Pending Pickups</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {pending.map((p) => (
              <PickupCard key={p.id} pickup={p} showActions onStatusChange={handleStatusChange} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Completed Today</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {completed.map((p) => (
              <PickupCard key={p.id} pickup={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
