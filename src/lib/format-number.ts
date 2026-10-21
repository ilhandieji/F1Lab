const latn = { numberingSystem: "latn" } as const;

export function formatGroupedNumber(value: number, maximumFractionDigits: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits, ...latn });
}
