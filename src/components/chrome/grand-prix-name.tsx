import { CountryFlag } from "@/components/chrome/country-flag";

type GrandPrixNameProps = {
  name: string;
  countryAlpha2: string | null;
  countryName?: string | null;
  className?: string;
};

export function GrandPrixName({
  name,
  countryAlpha2,
  countryName,
  className = "",
}: GrandPrixNameProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <CountryFlag alpha2={countryAlpha2} name={countryName} />
      <span>{name}</span>
    </span>
  );
}
