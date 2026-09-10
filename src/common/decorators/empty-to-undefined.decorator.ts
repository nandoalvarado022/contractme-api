import { Transform } from "class-transformer";

const isBlank = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "");

export const EmptyToUndefined = (sourceKey?: string) =>
  Transform(({ value, obj }): unknown => {
    const source = obj as Record<string, unknown> | undefined;
    const raw: unknown = sourceKey ? source?.[sourceKey] : value;
    return isBlank(raw) ? undefined : (value as unknown);
  });
