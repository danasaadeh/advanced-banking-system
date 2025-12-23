import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { Controller, type Control, type FieldErrors } from "react-hook-form";

import Field from "./field-helper";
import type { AddTransactionFormValues } from "./config";

interface RecurringFieldsProps {
  control: Control<AddTransactionFormValues>;
  errors: FieldErrors<AddTransactionFormValues>;
}

const RecurringFields: React.FC<RecurringFieldsProps> = ({
  control,
  errors,
}) => {
  return (
    <div className="space-y-4 rounded-md border p-4 bg-muted/30">
      {/* Frequency */}
      <Field label="Frequency" error={errors.frequency?.message}>
        <Controller
          name="frequency"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start Date" error={errors.start_date?.message}>
          <Controller
            name="start_date"
            control={control}
            render={({ field }) => <Input type="date" {...field} />}
          />
        </Field>

        <Field label="End Date" error={errors.end_date?.message}>
          <Controller
            name="end_date"
            control={control}
            render={({ field }) => <Input type="date" {...field} />}
          />
        </Field>
      </div>
    </div>
  );
};

export default RecurringFields;
