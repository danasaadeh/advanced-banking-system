import { FileSearch, Download } from "lucide-react";

interface HeaderActionsProps {
  onExport: () => void;
}

export default function HeaderActions({ onExport }: HeaderActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer">
        <FileSearch className="w-4 h-4" /> Audit Logs
      </button>
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-sm cursor-pointer"
      >
        <Download className="w-4 h-4" /> Export Daily Report
      </button>
    </div>
  );
}
