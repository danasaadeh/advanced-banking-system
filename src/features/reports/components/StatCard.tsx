import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm flex flex-col gap-2 transition-all">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-muted rounded-lg border border-border/50">
          {icon}
        </div>
        <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" /> +2.5%
        </span>
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        {description && (
          <p className="text-xs text-muted-foreground/60 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
