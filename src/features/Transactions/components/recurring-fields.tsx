import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import Field from "./field-helper";

const RecurringFields = () => {
  return (
    <div className="space-y-4 rounded-md border p-4 bg-muted/30">
      <Field label="Frequency">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start Date">
          <Input type="date" />
        </Field>

        <Field label="End Date">
          <Input type="date" />
        </Field>
      </div>
    </div>
  );
};

export default RecurringFields;
