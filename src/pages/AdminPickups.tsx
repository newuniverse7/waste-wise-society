import { mockPickups } from "@/data/mockData";
import { PickupCard } from "@/components/PickupCard";
import { ClipboardList } from "lucide-react";

export default function AdminPickups() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">All Pickup Requests</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {mockPickups.map((p) => (
          <PickupCard key={p.id} pickup={p} />
        ))}
      </div>
    </div>
  );
}
