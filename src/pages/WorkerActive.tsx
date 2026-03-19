import { useState } from "react";
import { mockPickups } from "@/data/mockData";
import { PickupCard } from "@/components/PickupCard";
import { Truck } from "lucide-react";
import { toast } from "sonner";
import { PickupRequest } from "@/data/types";

export default function WorkerActive() {
  const [pickups, setPickups] = useState<PickupRequest[]>(
    mockPickups.filter((p) => p.status === "in_progress" && p.workerId === "w1")
  );

  const handleStatusChange = (id: string, status: string) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: status as PickupRequest["status"] } : p))
    );
    toast.success(`Pickup marked as ${status.replace("_", " ")}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Active Pickups</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {pickups.map((p) => (
          <PickupCard key={p.id} pickup={p} showActions onStatusChange={handleStatusChange} />
        ))}
        {pickups.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No active pickups.</div>
        )}
      </div>
    </div>
  );
}
