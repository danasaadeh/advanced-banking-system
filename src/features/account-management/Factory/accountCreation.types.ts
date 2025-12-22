/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationResult } from "@tanstack/react-query";
import type {
  CreateAccountPayload,
  CreateAccountGroupPayload,
} from "../types/accounts.data";

export type AccountCreationType = "ROOT" | "CHILD" | "GROUP";

export type MutationMap = {
  ROOT: UseMutationResult<any, any, CreateAccountPayload, unknown>;
  CHILD: UseMutationResult<any, any, CreateAccountPayload, unknown>;
  GROUP: UseMutationResult<any, any, CreateAccountGroupPayload, unknown>;
};
