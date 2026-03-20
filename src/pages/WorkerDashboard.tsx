import { useState } from "react";
import { mockPickups } from "@/data/mockData";
import { PickupCard } from "@/components/PickupCard";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { ClipboardList, Truck, QrCode } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { toast } from "sonner";
import { PickupRequest } from "@/data/types";

export default function WorkerDashboard() {
  const [pickups, setPickups] = useState<PickupRequest[]>(
    mockPickups.filter((p) => p.workerId === "w1" || p.status === "pending")
  );
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

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

      {/* QR Code verification popup */}
      {selectedQR && (
        <div className="rounded-lg border bg-card p-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <QrCode className="h-4 w-4 text-primary" /> Verification QR
          </div>
          <QRCodeDisplay value={`ecotrack://pickup/${selectedQR}`} label={selectedQR} size={100} />
          <button onClick={() => setSelectedQR(null)} className="text-xs text-muted-foreground hover:underline">Close</button>
        </div>
      )}

      {active.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Active Pickups</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {active.map((p) => (
              <div key={p.id}>
                <PickupCard pickup={p} showActions onStatusChange={handleStatusChange} />
                <button onClick={() => setSelectedQR(p.qrCode)} className="text-xs text-accent hover:underline mt-1 flex items-center gap-1">
                  <QrCode className="h-3 w-3" /> Show QR
                </button>
              </div>
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
