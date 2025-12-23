import * as yup from "yup";

export const addTransactionSchema: yup.ObjectSchema<AddTransactionFormValues> =
  yup
    .object({
      type: yup
        .mixed<AddTransactionFormValues["type"]>()
        .oneOf(["deposit", "withdrawal", "transfer"])
        .required(),

      sourceAccountId: yup.string().when("type", {
        is: (type: string) => type !== "deposit",
        then: (s) => s.required(),
        otherwise: (s) => s.optional(),
      }),

      targetAccountId: yup.string().when("type", {
        is: (type: string) => type === "deposit" || type === "transfer",
        then: (s) => s.required(),
        otherwise: (s) => s.optional(),
      }),

      amount: yup.number().required().positive(),

      currency: yup.string().required(),

      description: yup.string().optional(),

      scheduled_at: yup.string().when("$isScheduled", {
        is: true,
        then: (s) => s.required(),
        otherwise: (s) => s.optional(),
      }),

      frequency: yup
        .mixed<"daily" | "weekly" | "monthly">()
        .when("$isRecurring", {
          is: true,
          then: (s) => s.required(),
          otherwise: (s) => s.optional(),
        }),

      start_date: yup.string().when("$isRecurring", {
        is: true,
        then: (s) => s.required(),
        otherwise: (s) => s.optional(),
      }),

      end_date: yup.string().optional(),
    })
    .required(); // 🚨 THIS IS CRITICAL

export interface AddTransactionFormValues {
  type: "deposit" | "withdrawal" | "transfer";

  sourceAccountId?: string;
  targetAccountId?: string;

  amount: number;
  currency: string;
  description?: string;

  scheduled_at?: string;

  frequency?: "daily" | "weekly" | "monthly";
  start_date?: string;
  end_date?: string;
}
