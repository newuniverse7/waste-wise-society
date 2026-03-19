import { useState } from "react";
import { mockPickups } from "@/data/mockData";
import { PickupCard } from "@/components/PickupCard";
import { TrackingMap } from "@/components/TrackingMap";
import { useAuth } from "@/contexts/AuthContext";
import { ClipboardList } from "lucide-react";
import { PickupRequest } from "@/data/types";

export default function RequestHistory() {
  const { auth } = useAuth();
  const [filter, setFilter] = useState("all");
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const userPickups = mockPickups.filter((p) => p.userId === auth.userId);
  const filtered = filter === "all" ? userPickups : userPickups.filter((p) => p.status === filter);

  const filters = ["all", "pending", "in_progress", "completed"];

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Request History</h1>
      </div>

      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-md border transition-snappy capitalize ${
              filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/30"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPickup(p)}
              className={`cursor-pointer rounded-lg ${selectedPickup?.id === p.id ? "ring-2 ring-accent" : ""}`}
            >
              <PickupCard pickup={p} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-muted-foreground">No requests found.</div>
          )}
        </div>

        <div className="hidden md:block">
          {selectedPickup ? (
            <div className="sticky top-4">
              <TrackingMap
                pickupLat={selectedPickup.lat}
                pickupLng={selectedPickup.lng}
                status={selectedPickup.status}
                workerName={selectedPickup.workerName}
              />
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
              Click a pickup to view tracking
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
