import { Input } from "@/shared/components/ui/input";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

import Field from "./field-helper";
import type { AddTransactionFormValues } from "./config";
interface ScheduledFieldsProps {
  control: Control<AddTransactionFormValues>;
  errors: FieldErrors<AddTransactionFormValues>;
}
const ScheduledFields: React.FC<ScheduledFieldsProps> = ({
  control,
  errors,
}) => {
  return (
    <div className="space-y-4 rounded-md border p-4 bg-muted/30">
      <Field label="Scheduled Date" error={errors.scheduled_at?.message}>
        <Controller
          name="scheduled_at"
          control={control}
          render={({ field }) => <Input type="date" {...field} />}
        />
      </Field>
    </div>
  );
};

export default ScheduledFields;
