import type { TeamInfo } from "@/lib/grid/types";

export type DriverPortraitRef = {
  seasonKey: string;
  objectKey: string;
};

export type DriverFamilyLink = {
  type: string;
  otherDriverId: string;
  otherDriverName: string;
  otherDriverAbbreviation: string;
  portraits: DriverPortraitRef[];
};

export type DriverCareerTotals = {
  championshipWins: number;
  raceWins: number;
  podiums: number;
  polePositions: number;
  fastestLaps: number;
  careerPoints: number;
  grandSlams: number;
  raceEntries: number;
  raceStarts: number;
  bestChampionshipPosition: number | null;
  driverOfTheDay: number;
};

export type DriverProfile = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  abbreviation: string;
  permanentNumber: string | null;
  dateOfBirth: string;
  dateOfDeath: string | null;
  placeOfBirth: string;
  countryOfBirth: string;
  nationality: string;
  secondNationality: string | null;
  careerTotals: DriverCareerTotals;
  careerYears: number[];
  debutYear: number;
  defaultSeason: number;
  family: DriverFamilyLink[];
  portraits: DriverPortraitRef[];
};

export type DriverSeasonStanding = {
  position: string;
  positionNumber: number | null;
  points: number;
  championshipWon: boolean;
};

export type DriverSeasonTotals = {
  raceEntries: number;
  raceStarts: number;
  wins: number;
  podiums: number;
  polePositions: number;
  fastestLaps: number;
  points: number;
  grandSlams: number;
  sprintRaceWins: number;
  driverOfTheDay: number;
};

export type DriverTeamStint = {
  team: TeamInfo;
  rounds: string | null;
  roundsText: string | null;
  testDriver: boolean;
};

export type DriverRaceResult = {
  round: number;
  grandPrixName: string;
  team: TeamInfo;
  gridPosition: string | null;
  finishPosition: string;
  finishNumber: number | null;
  points: number;
  pole: boolean;
  fastestLap: boolean;
  retired: boolean;
  retirementReason: string | null;
  driverOfTheDay: boolean;
};

export type DriverSprintResult = {
  round: number;
  grandPrixName: string;
  team: TeamInfo;
  finishPosition: string;
  points: number;
};

export type DriverSeasonView = {
  year: number;
  standing: DriverSeasonStanding | null;
  totals: DriverSeasonTotals | null;
  teams: DriverTeamStint[];
  races: DriverRaceResult[];
  sprints: DriverSprintResult[];
};

export const DRIVER_TABS = [
  { id: "season", label: "Season" },
  { id: "races", label: "Results" },
] as const;

export type DriverTabId = (typeof DRIVER_TABS)[number]["id"];

export function isDriverTabId(value: string | null | undefined): value is DriverTabId {
  return DRIVER_TABS.some((tab) => tab.id === value);
}

export type DriverSearchHit = {
  id: string;
  fullName: string;
  abbreviation: string;
  nationality: string;
  championshipWins: number;
  portraitUrl: string | null;
};
