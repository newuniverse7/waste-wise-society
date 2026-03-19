import { useState, useEffect } from "react";
import { MapPin, Navigation, Truck } from "lucide-react";

interface TrackingMapProps {
  pickupLat: number;
  pickupLng: number;
  status: string;
  workerName?: string;
}

export function TrackingMap({ pickupLat, pickupLng, status, workerName }: TrackingMapProps) {
  const [workerPos, setWorkerPos] = useState({ lat: pickupLat + 0.008, lng: pickupLng - 0.006 });
  const [progress, setProgress] = useState(0);

  // Simulate worker movement
  useEffect(() => {
    if (status !== "in_progress") return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const next = prev + 2;
        const t = next / 100;
        setWorkerPos({
          lat: pickupLat + 0.008 * (1 - t),
          lng: pickupLng - 0.006 * (1 - t),
        });
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [status, pickupLat, pickupLng]);

  const mapWidth = 100;
  const mapHeight = 100;

  // Normalize positions to percentage coordinates for display
  const pickupX = 75;
  const pickupY = 70;
  const workerX = status === "in_progress" ? 20 + progress * 0.55 : status === "completed" ? pickupX : 20;
  const workerY = status === "in_progress" ? 25 + progress * 0.45 : status === "completed" ? pickupY : 25;

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="px-4 py-2 border-b flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium">
          <Navigation className="h-3.5 w-3.5 text-accent" />
          Live Tracking
        </div>
        {status === "in_progress" && (
          <span className="text-xs text-accent animate-pulse">● Tracking active</span>
        )}
        {status === "completed" && (
          <span className="text-xs text-success">✓ Delivered</span>
        )}
      </div>
      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {/* Grid lines to simulate map */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid */}
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i}>
              <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="hsl(var(--border))" strokeWidth="0.3" />
              <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="hsl(var(--border))" strokeWidth="0.3" />
            </g>
          ))}

          {/* Simulated roads */}
          <path d="M10,30 L45,30 L75,70 L90,70" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.3" />
          <path d="M20,10 L20,80" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.2" />
          <path d="M50,5 L50,95" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.2" />

          {/* Route line */}
          {status === "in_progress" && (
            <line
              x1={workerX}
              y1={workerY}
              x2={pickupX}
              y2={pickupY}
              stroke="hsl(var(--accent))"
              strokeWidth="0.8"
              strokeDasharray="2 1"
              opacity="0.6"
            />
          )}
        </svg>

        {/* Pickup location */}
        <div
          className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-full"
          style={{ left: `${pickupX}%`, top: `${pickupY}%` }}
        >
          <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
            <MapPin className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-medium mt-0.5 bg-card/80 px-1 rounded">Pickup</span>
        </div>

        {/* Worker location */}
        {status !== "pending" && (
          <div
            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-full transition-all duration-500"
            style={{ left: `${workerX}%`, top: `${workerY}%` }}
          >
            <div className="bg-accent text-accent-foreground rounded-full p-1 shadow-lg">
              <Truck className="h-3.5 w-3.5" />
            </div>
            {workerName && (
              <span className="text-[10px] font-medium mt-0.5 bg-card/80 px-1 rounded">{workerName}</span>
            )}
          </div>
        )}

        {/* Status overlay */}
        {status === "pending" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <span className="text-xs text-muted-foreground">Awaiting worker assignment</span>
          </div>
        )}
      </div>
      <div className="px-4 py-2 text-xs text-muted-foreground flex justify-between">
        <span>{pickupLat.toFixed(4)}°N, {pickupLng.toFixed(4)}°E</span>
        {status === "in_progress" && <span>{progress}% en route</span>}
      </div>
    </div>
  );
}
