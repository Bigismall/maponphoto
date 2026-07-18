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

export const isNullOrUndefined = (value: unknown): boolean =>
  value === null || value === undefined;

export const numberWithPadding = (digit: number) =>
  digit.toString().padStart(2, "0");

export const generateFilename = () => {
  const today = new Date();
  return `map-on-photo-${today.getFullYear()}-${numberWithPadding(today.getMonth() + 1)}-${numberWithPadding(today.getDate())}-${numberWithPadding(today.getHours())}-${numberWithPadding(today.getMinutes())}-${numberWithPadding(today.getSeconds())}.jpg`;
};
