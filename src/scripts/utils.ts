// Implement function that will check if given value is empty array
export function isEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length === 0;
}

// Implement function that will check if given value is empty object
export function isEmptyObject(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  );
}

// Implement function that will check if given value is empty string
export function isEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim() === "";
}

// Implement function that will check if given value is empty (empty array, empty object or empty string)
export function isEmpty(value: unknown): boolean {
  return isEmptyArray(value) || isEmptyObject(value) || isEmptyString(value);
}
