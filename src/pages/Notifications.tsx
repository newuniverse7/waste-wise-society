import { useState } from "react";
import { mockNotifications } from "@/data/mockData";
import { Bell, CheckCircle, Info, Gift, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/data/types";

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
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs" onClick={markAllRead}>
            <Check className="h-3 w-3 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card divide-y">
        {notifications.map((n) => {
          const Icon = typeIcons[n.type];
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-3 p-4 cursor-pointer transition-snappy hover:bg-muted/50 ${
                !n.read ? "bg-primary/[0.03]" : ""
              }`}
            >
              <div className={`mt-0.5 shrink-0 p-1 rounded-full ${!n.read ? "bg-primary/10" : "bg-muted"}`}>
                <Icon className={`h-3.5 w-3.5 ${!n.read ? typeColors[n.type] : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? "font-medium" : ""}`}>{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
            </div>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No notifications</div>
        )}
      </div>
    </div>
  );
}
