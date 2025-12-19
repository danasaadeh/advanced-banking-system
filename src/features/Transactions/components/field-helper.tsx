import { Label } from "@/shared/components/ui/label";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    {children}
  </div>
);

export default Field;
