export const log = (...messages: unknown[]) => {
  // We could check DEBUG environment variable here
  console.log(...messages);
};

export const warn = (...messages: unknown[]) => {
  console.warn(...messages);
};

export const fault = (...messages: unknown[]) => {
  console.error(...messages);
};
