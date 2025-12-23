import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
  error?: string;
}

const Field: React.FC<FieldProps> = ({ label, children, error }) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Field;
