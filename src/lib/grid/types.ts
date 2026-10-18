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
};

export type TestDriver = {
  id: string;
  name: string;
  teams: TeamInfo[];
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
  outgoing: { id: string; name: string }[];
  incoming: { id: string; name: string }[];
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
  { id: "drivers", label: "Drivers Standing" },
  { id: "activity", label: "Season activity" },
  { id: "constructors", label: "Constructors standing" },
] as const;

export type GridTabId = (typeof GRID_TABS)[number]["id"];

export function isGridTabId(value: string | null): value is GridTabId {
  return GRID_TABS.some((tab) => tab.id === value);
}
