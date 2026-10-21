export type TeamInfo = {
  id: string;
  name: string;
  logoPath: string | null;
  lightLogo: boolean;
  countryAlpha2?: string | null;
  countryName?: string | null;
};

export type GridDriver = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  points: number;
  team: TeamInfo;
  nationalityAlpha2: string | null;
  nationalityName: string | null;
  portraitUrl?: string | null;
};

export type ConstructorStanding = {
  team: TeamInfo;
  position: string;
  points: number;
};

export type ConstructorStandingsNoteCode =
  | "official-plus-zero"
  | "grouped-ties"
  | "built-from-results";

export type ConstructorStandingsEmptyCode = "entry-list-no-points" | "no-data";

export type ConstructorStandingsView = {
  constructorStandings: ConstructorStanding[];
  constructorStandingsNote: ConstructorStandingsNoteCode | null;
  constructorStandingsEmptyMessage: ConstructorStandingsEmptyCode | null;
};

export type ActivityDriver = {
  id: string;
  name: string;
  weekends: number;
  teams: TeamInfo[];
  openedSeason: boolean;
  nationalityAlpha2: string | null;
  nationalityName: string | null;
  portraitUrl?: string | null;
};

export type TestDriver = {
  id: string;
  name: string;
  teams: TeamInfo[];
  nationalityAlpha2: string | null;
  nationalityName: string | null;
  portraitUrl?: string | null;
};

export type ActivityDriverRef = {
  id: string;
  name: string;
  nationalityAlpha2: string | null;
  nationalityName: string | null;
  portraitUrl?: string | null;
};

export type ActivityChangeKind =
  | "transfer"
  | "return"
  | "substitution"
  | "lineup-change";

export type ActivityStint = {
  driverId: string;
  startRound: number;
  endRound: number;
  weekends: number;
};

export type ActivityChange = {
  team: TeamInfo;
  outgoing: ActivityDriverRef[];
  incoming: ActivityDriverRef[];
  kind: ActivityChangeKind;
  stints: ActivityStint[];
};

export type ActivityEvent = {
  round: number;
  name: string;
  countryAlpha2: string | null;
  countryName: string | null;
  changes: ActivityChange[];
};

export type SeasonActivity = {
  summary: {
    uniqueRaceDrivers: number;
    substitutions: number;
    changedTeams: number;
  };
  events: ActivityEvent[];
  drivers: ActivityDriver[];
  testDrivers: TestDriver[];
};

export type SeasonGrid = {
  year: number;
  startingDrivers: GridDriver[];
  highestPoints: number;
  constructorStandings: ConstructorStanding[];
  constructorStandingsNote: ConstructorStandingsNoteCode | null;
  constructorStandingsEmptyMessage: ConstructorStandingsEmptyCode | null;
  activity: SeasonActivity;
};

export const GRID_TABS = [
  { id: "drivers" },
  { id: "constructors" },
  { id: "activity" },
] as const;

export type GridTabId = (typeof GRID_TABS)[number]["id"];

export function isGridTabId(value: string | null): value is GridTabId {
  return GRID_TABS.some((tab) => tab.id === value);
}
