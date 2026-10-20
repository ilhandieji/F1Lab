export type TeamInfo = {
  id: string;
  name: string;
  logoPath: string | null;
  lightLogo: boolean;
};

export type GridDriver = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  points: number;
  team: TeamInfo;
  portraitUrl?: string | null;
};

export type ConstructorStanding = {
  team: TeamInfo;
  position: string;
  points: number;
};

export type ConstructorStandingsView = {
  constructorStandings: ConstructorStanding[];
  constructorStandingsNote: string | null;
  constructorStandingsEmptyMessage: string | null;
};

export type ActivityDriver = {
  id: string;
  name: string;
  weekends: number;
  teams: TeamInfo[];
  openedSeason: boolean;
  portraitUrl?: string | null;
};

export type TestDriver = {
  id: string;
  name: string;
  teams: TeamInfo[];
  portraitUrl?: string | null;
};

export type ActivityDriverRef = {
  id: string;
  name: string;
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
  constructorStandingsNote: string | null;
  constructorStandingsEmptyMessage: string | null;
  activity: SeasonActivity;
};

export const GRID_TABS = [
  { id: "drivers", label: "Drivers' standings" },
  { id: "activity", label: "Driver changes" },
  { id: "constructors", label: "Constructors' standings" },
] as const;

export type GridTabId = (typeof GRID_TABS)[number]["id"];

export function isGridTabId(value: string | null): value is GridTabId {
  return GRID_TABS.some((tab) => tab.id === value);
}
