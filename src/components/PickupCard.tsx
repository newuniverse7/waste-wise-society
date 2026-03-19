import { PickupRequest } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Clock, Package } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  in_progress: "bg-info/10 text-info border-info/20",
  completed: "bg-success/10 text-success border-success/20",
};

const wasteIcons: Record<string, string> = {
  plastic: "♻️",
  cardboard: "📦",
  "e-waste": "🔌",
};

const timeSlotLabels: Record<string, string> = {
  morning: "🌅 Morning",
  afternoon: "☀️ Afternoon",
  evening: "🌙 Evening",
};

interface PickupCardProps {
  pickup: PickupRequest;
  showActions?: boolean;
  onStatusChange?: (id: string, status: string) => void;
}

export function PickupCard({ pickup, showActions, onStatusChange }: PickupCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 transition-snappy hover:border-primary/30 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{wasteIcons[pickup.wasteType]}</span>
          <div>
            <div className="font-medium text-sm">{pickup.userName}</div>
            <div className="text-xs text-muted-foreground">{pickup.society} · {pickup.flat}</div>
          </div>
        </div>
        <Badge variant="outline" className={statusColors[pickup.status]}>
          {pickup.status.replace("_", " ")}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Type</span>
          <div className="font-medium capitalize">{pickup.wasteType}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Weight</span>
          <div className="font-medium">{pickup.weight} kg</div>
        </div>
        <div>
          <span className="text-muted-foreground">Points</span>
          <div className="font-medium text-primary">{pickup.points}</div>
        </div>
      </div>

      {/* Time slot & estimated time */}
      {(pickup.timeSlot || pickup.estimatedPickupTime) && (
        <div className="mt-2 flex items-center gap-3 text-xs">
          {pickup.timeSlot && (
            <span className="text-muted-foreground">{timeSlotLabels[pickup.timeSlot] || pickup.timeSlot}</span>
          )}
          {pickup.estimatedPickupTime && pickup.status !== "completed" && (
            <span className="flex items-center gap-1 text-accent">
              <Clock className="h-3 w-3" />
              ETA: {pickup.estimatedPickupTime}
            </span>
          )}
        </div>
      )}

      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span>QR: {pickup.qrCode} · {new Date(pickup.createdAt).toLocaleDateString()}</span>
        {pickup.isEcommercePackaging && (
          <span className="inline-flex items-center gap-0.5 text-warning">
            <Package className="h-3 w-3" /> e-comm
          </span>
        )}
      </div>

      {showActions && pickup.status !== "completed" && onStatusChange && (
        <div className="mt-3 flex gap-2">
          {pickup.status === "pending" && (
            <button
              onClick={() => onStatusChange(pickup.id, "in_progress")}
              className="text-xs bg-accent text-accent-foreground px-3 py-1 rounded-md transition-snappy hover:opacity-90"
            >
              Start Pickup
            </button>
          )}
          {pickup.status === "in_progress" && (
            <button
              onClick={() => onStatusChange(pickup.id, "completed")}
              className="text-xs bg-success text-success-foreground px-3 py-1 rounded-md transition-snappy hover:opacity-90"
            >
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
