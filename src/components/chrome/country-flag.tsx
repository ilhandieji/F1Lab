import { countryFlagUrl } from "@/lib/country-flag";

type CountryFlagProps = {
  alpha2: string | null | undefined;
  name?: string | null;
  className?: string;
  labelled?: boolean;
};

export function CountryFlag({
  alpha2,
  name,
  className = "",
  labelled = true,
}: CountryFlagProps) {
  const src = countryFlagUrl(alpha2);
  if (!src) return null;

  const label = name?.trim() || alpha2?.toUpperCase() || "Country";

  return (
    <span className={`inline-flex shrink-0 ${className}`} title={label}>
      {/* Remote SVG. next/image skips SVG, and inlining these files collides on clipPath ids. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={18}
        height={12}
        loading="lazy"
        decoding="async"
        className="h-3 w-[1.125rem] rounded-[1px] object-contain ring-1 ring-white/30"
      />
      {labelled ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}

type NationalityFlagsProps = {
  primaryAlpha2: string | null | undefined;
  primaryName?: string | null;
  secondAlpha2?: string | null;
  secondName?: string | null;
  className?: string;
  labelled?: boolean;
};

export function NationalityFlags({
  primaryAlpha2,
  primaryName,
  secondAlpha2,
  secondName,
  className = "",
  labelled = true,
}: NationalityFlagsProps) {
  if (!countryFlagUrl(primaryAlpha2) && !countryFlagUrl(secondAlpha2)) return null;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <CountryFlag alpha2={primaryAlpha2} name={primaryName} labelled={labelled} />
      <CountryFlag alpha2={secondAlpha2} name={secondName} labelled={labelled} />
    </span>
  );
}
