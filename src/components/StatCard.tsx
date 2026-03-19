import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: string;
}

export function StatCard({ title, value, icon, subtitle, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-1">
          {trend && <span className="text-xs text-success font-medium">{trend}</span>}
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
