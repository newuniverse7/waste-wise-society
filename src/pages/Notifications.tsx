import { mockNotifications } from "@/data/mockData";
import { Bell, CheckCircle, Info, Gift, AlertTriangle } from "lucide-react";

const typeIcons = {
  success: CheckCircle,
  info: Info,
  reward: Gift,
  warning: AlertTriangle,
};

const typeColors = {
  success: "text-success",
  info: "text-info",
  reward: "text-primary",
  warning: "text-warning",
};

export default function Notifications() {
  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Notifications</h1>
      </div>

      <div className="rounded-lg border bg-card divide-y">
        {mockNotifications.map((n) => {
          const Icon = typeIcons[n.type];
          return (
            <div key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? "bg-primary/[0.02]" : ""}`}>
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${typeColors[n.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
