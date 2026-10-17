type LogoFormat = "svg" | "webp";

type TeamLogoStyle = {
  light?: boolean;
  folderName?: string;
  format?: LogoFormat;
  fileName?: string;
};

/**
 * One historical badge for a constructor.
 * Later matching eras win, so a single-season override can follow a wider range.
 *
 * ferrari: {
 *   seasons: [
 *     { from: 1997, to: 2006, folderName: "teamFerrari2000" },
 *     { from: 2007, folderName: "teamFerrariModern" },
 *   ],
 * }
 */
export type TeamLogoEra = TeamLogoStyle & {
  from: number;
  to?: number;
};

type TeamLogoOptions = TeamLogoStyle & {
  seasons?: TeamLogoEra[];
};

export type TeamLogo = {
  src: string;
  light: boolean;
};

type ResolvedTeamLogo = TeamLogo & {
  style: TeamLogoStyle;
  seasons: TeamLogoEra[];
};

type TeamLogoPaths<T extends Record<string, TeamLogoOptions>> = {
  [K in keyof T]: ResolvedTeamLogo;
};

function toFolderName(slug: string): string {
  return `team${slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")}`;
}

function logoAsset(slug: string, style: TeamLogoStyle): TeamLogo {
  const folder = style.folderName ?? toFolderName(slug);
  const fileName = style.fileName ?? "logo";
  const format = style.format ?? "svg";
  return {
    src: `/assets/${folder}/${fileName}.${format}`,
    light: style.light ?? false,
  };
}

function defineTeamLogoPaths<const T extends Record<string, TeamLogoOptions>>(
  teams: T,
): TeamLogoPaths<T> {
  return Object.fromEntries(
    Object.entries(teams).map(([slug, options]) => {
      const { seasons = [], ...style } = options;
      return [
        slug,
        {
          ...logoAsset(slug, style),
          style,
          seasons,
        },
      ];
    }),
  ) as TeamLogoPaths<T>;
}

export const teamLogoPaths = defineTeamLogoPaths({
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

type TeamLogoId = keyof typeof teamLogoPaths;

function isTeamLogoId(teamId: string): teamId is TeamLogoId {
  return Object.prototype.hasOwnProperty.call(teamLogoPaths, teamId);
}

export class TeamLogoCatalog {
  resolve(teamId: string, year: number): TeamLogo | null {
    if (!isTeamLogoId(teamId)) return null;
    const configured = teamLogoPaths[teamId];

    const era = [...configured.seasons]
      .reverse()
      .find(({ from, to }) => year >= from && (to === undefined || year <= to));

    if (!era) return logoAsset(teamId, configured.style);
    return logoAsset(teamId, { ...configured.style, ...era });
  }
}

const catalog = new TeamLogoCatalog();

export function getTeamLogo(teamId: string, year: number): TeamLogo | null {
  return catalog.resolve(teamId, year);
}
