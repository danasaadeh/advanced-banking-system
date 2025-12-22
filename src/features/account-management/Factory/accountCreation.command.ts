// accountCreation.command.ts
export interface AccountCreationCommand<TPayload> {
  mutate: (payload: TPayload, options?: unknown) => void;
  isLoading: boolean;
}
