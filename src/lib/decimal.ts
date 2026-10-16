export function pointsToNumber(points: unknown): number {
  let value: unknown = points;

  if (points !== null && typeof points === "object") {
    const decimalValue = Reflect.get(points, "value");
    const decimalType = Reflect.get(points, "$type");
    const toNumber = Reflect.get(points, "toNumber");

    if (decimalType === "Decimal" && typeof decimalValue === "string") {
      value = decimalValue;
    } else if (typeof toNumber === "function") {
      value = toNumber.call(points);
    }
  }

  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  if (!Number.isFinite(numericValue)) {
    throw new Error("Invalid points value in constructor standings data.");
  }

  return numericValue;
}
