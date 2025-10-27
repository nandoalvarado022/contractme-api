export const TYPE_CONTACT = {
  GENERAL: 'information',
  PRICING: 'pricing',
  SUPPORT: 'support',
  REAL_STATE: 'real-state',
  OTHER: 'other',
} as const;

export type TypeContact = (typeof TYPE_CONTACT)[keyof typeof TYPE_CONTACT];