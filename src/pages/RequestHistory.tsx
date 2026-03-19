import { mockPickups } from "@/data/mockData";
import { PickupCard } from "@/components/PickupCard";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { ClipboardList } from "lucide-react";

export default function RequestHistory() {
  const { auth } = useAuth();
  const [filter, setFilter] = useState("all");
  const userPickups = mockPickups.filter((p) => p.userId === auth.userId);
  const filtered = filter === "all" ? userPickups : userPickups.filter((p) => p.status === filter);

  const filters = ["all", "pending", "in_progress", "completed"];

  return (
    <div className="max-w-3xl animate-fade-in">
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

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((p) => (
          <PickupCard key={p.id} pickup={p} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No requests found.</div>
        )}
      </div>
    </div>
  );
}
