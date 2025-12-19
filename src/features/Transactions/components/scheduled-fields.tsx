import { Input } from "@/shared/components/ui/input";
import Field from "./field-helper";

const ScheduledFields = () => {
  return (
    <div className="space-y-4 rounded-md border p-4 bg-muted/30">
      <Field label="Scheduled Date">
        <Input type="date" />
      </Field>
    </div>
  );
};

export default ScheduledFields;
