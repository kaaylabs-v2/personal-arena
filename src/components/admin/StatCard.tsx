import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, change, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground/50" />
      </div>
      <p className="text-2xl font-display font-bold text-card-foreground">{value}</p>
      {change && <p className="text-xs text-primary mt-1">{change}</p>}
    </div>
  );
}
