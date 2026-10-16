type TeamLogoOptions = {
  light?: boolean;
  folderName?: string;
  format?: "svg" | "webp";
};

type TeamLogo = {
  src: string;
  light: boolean;
};

type TeamLogoPaths<T extends Record<string, TeamLogoOptions>> = {
  [K in keyof T]: TeamLogo;
};

// E.G: Converts "aston-martin" to "teamAstonMartin"
function toFolderName(slug: string): string {
  return `team${slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")}`;
}

function defineTeamLogoPaths<const T extends Record<string, TeamLogoOptions>>(
  teams: T,
): TeamLogoPaths<T> {
  return Object.fromEntries(
    Object.entries(teams).map(([slug, options]) => [
      slug,
      {
        src: `/assets/${options.folderName ?? toFolderName(slug)}/logo.${options.format ?? "svg"}`,
        light: options.light ?? false,
      },
    ]),
  ) as TeamLogoPaths<T>;
}

export const teamLogoPaths: Record<string, TeamLogo> = defineTeamLogoPaths({
  alpine: { light: true },
  "aston-martin": { light: true },
  audi: {},
  cadillac: {},
  ferrari: {},
  haas: {},
  mclaren: { folderName: "teamMcLaren" },
  mercedes: { light: true },
  "racing-bulls": { light: true },
  "red-bull": { folderName: "teamRedbull" },
  williams: { folderName: "teamWiliams", light: true },
  "kick-sauber": {},
  rb: { light: true },
  alphatauri: { folderName: "teamRb", light: true },
  "alfa-romeo": {},
  "racing-point": {},
  renault: { light: true },
  "toro-rosso": { light: true },
  "force-india": {},
  sauber: {},
  manor: { format: "webp" },
  "lotus-f1": {},
  marussia: { format: "webp" },
  caterham: {},
  hrt: {},
  "lotus-racing": {},
  virgin: { light: true },
  brawn: {},
  toyota: {},
  "bmw-sauber": {},
  honda: {},
  "super-aguri": { format: "webp" },
  spyker: { format: "webp", light: true },
  midland: { format: "webp" },
  bar: {},
  jordan: { format: "webp" },
  minardi: {},
  jaguar: {},
  arrows: { format: "webp" },
  benetton: {},
  prost: {},
  stewart: { format: "webp" },
  tyrrell: {},
  lola: {},
  footwork: { format: "webp" },
  ligier: { format: "webp" },
  forti: { format: "webp" },
  larrousse: { format: "webp" },
  simtek: { format: "webp" },
  lotus: {},
  march: { format: "webp" },
  dallara: {},
  venturi: {},
  "andrea-moda": { format: "webp" },
  brabham: { format: "webp" },
  fondmetal: {},
  "leyton-house": { format: "webp" },
  ags: { format: "webp" },
  coloni: {},
  modena: { light: true },
});