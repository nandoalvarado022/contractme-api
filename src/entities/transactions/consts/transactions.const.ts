export const TRANSACTION_STATUS = {
  PENDING: "pending",
  BLOCKED: "blocked",
  REJECTED: "rejected",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type TransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];

export const TRANSACTION_TYPE = {
  ADD: "add",
  REMOVE: "remove",
} as const;

export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];
