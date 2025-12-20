import * as yup from "yup";

export const addTransactionSchema = yup.object({
  type: yup
    .mixed<"deposit" | "withdrawal" | "transfer">()
    .oneOf(["deposit", "withdrawal", "transfer"])
    .required(),

  /* ---------------- Accounts ---------------- */
  source_account: yup.string().when("type", {
    is: (type: string) => type !== "deposit",
    then: (schema) => schema.required("Source account is required"),
    otherwise: (schema) => schema.optional(),
  }),

  target_account: yup.string().when("type", {
    is: (type: string) => type === "deposit" || type === "transfer",
    then: (schema) => schema.required("Target account is required"),
    otherwise: (schema) => schema.optional(),
  }),

  /* ---------------- Amount & Currency ---------------- */
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than zero")
    .required("Amount is required"),

  currency: yup.string().required("Currency is required"),

  description: yup.string().max(255).optional(),

  /* ---------------- Scheduled ---------------- */
  isScheduled: yup.boolean().required(),

  scheduled_date: yup.string().when("isScheduled", {
    is: true,
    then: (schema) =>
      schema
        .required("Scheduled date is required")
        .test(
          "future-date",
          "Scheduled date must be in the future",
          (value) => !value || new Date(value) > new Date()
        ),
    otherwise: (schema) => schema.optional(),
  }),

  /* ---------------- Recurring ---------------- */
  isRecurring: yup.boolean().required(),

  frequency: yup.mixed<"daily" | "weekly" | "monthly">().when("isRecurring", {
    is: true,
    then: (schema) =>
      schema
        .oneOf(["daily", "weekly", "monthly"])
        .required("Frequency is required"),
    otherwise: (schema) => schema.optional(),
  }),

  start_date: yup.string().when("isRecurring", {
    is: true,
    then: (schema) => schema.required("Start date is required"),
    otherwise: (schema) => schema.optional(),
  }),

  end_date: yup.string().when("isRecurring", {
    is: true,
    then: (schema) =>
      schema
        .required("End date is required")
        .test(
          "after-start",
          "End date must be after start date",
          function (value) {
            const { start_date } = this.parent;
            if (!value || !start_date) return true;
            return new Date(value) > new Date(start_date);
          }
        ),
    otherwise: (schema) => schema.optional(),
  }),
});
