export function isEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length === 0;
}

export function isEmptyObject(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  );
}

export function isEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim() === "";
}

export function isEmpty(value: unknown): boolean {
  return isEmptyArray(value) || isEmptyObject(value) || isEmptyString(value);
}
