export const STATUS_CONTRACT = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type StatusContract = typeof STATUS_CONTRACT[keyof typeof STATUS_CONTRACT];