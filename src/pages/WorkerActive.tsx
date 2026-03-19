import { useState } from "react";
import { mockPickups } from "@/data/mockData";
import { PickupCard } from "@/components/PickupCard";
import { TrackingMap } from "@/components/TrackingMap";
import { Truck } from "lucide-react";
import { toast } from "sonner";
import { PickupRequest } from "@/data/types";

export default function WorkerActive() {
  const [pickups, setPickups] = useState<PickupRequest[]>(
    mockPickups.filter((p) => p.status === "in_progress" && p.workerId === "w1")
  );
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(pickups[0] || null);

  const handleStatusChange = (id: string, status: string) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: status as PickupRequest["status"] } : p))
    );
    if (status === "completed") {
      setSelectedPickup(null);
    }
    toast.success(`Pickup marked as ${status.replace("_", " ")}`);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Truck className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Active Pickups</h1>
      </div>

      {selectedPickup && (
        <TrackingMap
          pickupLat={selectedPickup.lat}
          pickupLng={selectedPickup.lng}
          status={selectedPickup.status}
          workerName={selectedPickup.workerName}
        />
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {pickups.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedPickup(p)}
            className={`cursor-pointer rounded-lg ${selectedPickup?.id === p.id ? "ring-2 ring-accent" : ""}`}
          >
            <PickupCard pickup={p} showActions onStatusChange={handleStatusChange} />
          </div>
        ))}
        {pickups.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No active pickups.</div>
        )}
      </div>
    </div>
  );
}
